// app/search/route-details.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { RouteDetailsSkeleton } from '@/components/skeletons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useRouteService } from '@/hooks/useRouteService';
import { useTripService } from '@/hooks/useTripService';
import { useDialog } from '@/contexts/DialogContext';

function cleanMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')      // Remove *italic*
    .replace(/^[-*]\s+/gm, '')        // Remove bullet markers
    .replace(/#{1,6}\s+/g, '')        // Remove heading markers
    .replace(/\n{2,}/g, '\n')         // Collapse multiple newlines
    .trim();
}

function getTransportDisplayName(mode: string | any): string {
  // Handle malformed transportMode (e.g., JSON strings or objects)
  let cleanMode = mode;

  if (typeof mode === 'object' && mode !== null) {
    // If it's an object, try to extract the type
    cleanMode = mode.type || mode.mode || Object.values(mode)[0] || 'transport';
  } else if (typeof mode === 'string') {
    // Clean up any JSON formatting artifacts
    cleanMode = mode
      .replace(/^\{?"?/g, '')  // Remove leading { or {"
      .replace(/"?\}?$/g, '')  // Remove trailing "} or }
      .replace(/^["'\[]*/g, '') // Remove leading quotes/brackets
      .replace(/["'\]]*$/g, '') // Remove trailing quotes/brackets
      .trim();
  }

  const normalizedMode = String(cleanMode).toLowerCase();

  switch (normalizedMode) {
    case 'bus': return 'Bus';
    case 'taxi': return 'Taxi';
    case 'keke': return 'Keke';
    case 'okada': return 'Okada';
    case 'walk': case 'walking': return 'Walk';
    default: return cleanMode ? String(cleanMode).charAt(0).toUpperCase() + String(cleanMode).slice(1) : 'Transport';
  }
}

function getTransportModesDisplay(step: any): string {
  // If step has multiple transport modes, show them all
  if (step.transportModes && Array.isArray(step.transportModes) && step.transportModes.length > 1) {
    const uniqueModes = [...new Set(step.transportModes.map((m: any) => getTransportDisplayName(m)))];
    return uniqueModes.join('/');
  }
  // Fallback to single transport mode
  return getTransportDisplayName(step.transportMode);
}

function getStepSummary(step: any): string {
  if (step.fromLocation && step.toLocation) {
    const mode = getTransportModesDisplay(step);
    return `${mode} from ${step.fromLocation} to ${step.toLocation}`;
  }
  // Fallback: clean any markdown from instructions
  return cleanMarkdown(step.instructions || step.instruction || step.name || '');
}

export default function RouteDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useThemedColors();
  const dialog = useDialog();
  const mapRef = useRef<MapView>(null);
  const { findSmartRoutes } = useRouteService();
  const { getActiveTrip, startTrip, endTrip, isLoading: tripLoading } = useTripService();

  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(0);

  useEffect(() => {
    loadRouteData();
  }, []);

  const loadRouteData = async () => {
    try {
      setLoading(true);

      const startLat = parseFloat(params.startLat as string);
      const startLng = parseFloat(params.startLng as string);
      const endLat = parseFloat(params.destLat as string);
      const endLng = parseFloat(params.destLng as string);

      const result = await findSmartRoutes(
        startLat,
        startLng,
        endLat,
        endLng,
        params.destName as string,
      );

      if (result.success && result.data) {
        setRouteData(result.data);

        // First zoom to user's location for context, then show the route
        setTimeout(() => {
          if (mapRef.current) {
            // Start by focusing on user's current location with closer zoom
            mapRef.current.animateToRegion({
              latitude: startLat,
              longitude: startLng,
              latitudeDelta: 0.008, // ~800m view - close enough to see nearby streets
              longitudeDelta: 0.008,
            }, 800);

            // After showing user location, expand to show the first step/boarding point
            setTimeout(() => {
              if (mapRef.current && result.data.routes?.[0]) {
                const route = result.data.routes[0];
                const firstStep = route.steps?.[0];

                // If there's a walking step, zoom to show user location and boarding point
                if (firstStep?.transportMode === 'walk' || firstStep?.transportMode === 'walking') {
                  // Show user location and the junction they need to walk to
                  mapRef.current.fitToCoordinates([
                    { latitude: startLat, longitude: startLng },
                    { latitude: startLat + 0.005, longitude: startLng + 0.005 }, // Approximate walking destination
                  ], {
                    edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
                    animated: true,
                  });
                } else {
                  // Show the full route with more padding at bottom for the sheet
                  const coords = route.polyline || [
                    { latitude: startLat, longitude: startLng },
                    { latitude: endLat, longitude: endLng },
                  ];

                  mapRef.current.fitToCoordinates(coords, {
                    edgePadding: { top: 80, right: 50, bottom: 280, left: 50 },
                    animated: true,
                  });
                }
              }
            }, 1500);
          }
        }, 500);
      } else {
        Alert.alert('Error', result.error || 'Could not find route');
        router.back();
      }
    } catch (error) {
      console.error('Error loading route:', error);
      Alert.alert('Error', 'Failed to load route details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    if (!routeData?.routes?.[selectedRoute]?.id) {
      dialog.showError('Error', 'No route selected');
      return;
    }

    // First check if there's an active trip
    const activeTripResult = await getActiveTrip();

    if (activeTripResult.success && activeTripResult.data?.trip) {
      // There's already an active trip - show options dialog
      const existingTrip = activeTripResult.data.trip;
      const destinationName = (existingTrip.route as any)?.endLocation?.name || existingTrip.route?.name || 'your destination';

      dialog.showDialog({
        type: 'warning',
        title: 'Active Trip in Progress',
        message: `You have an ongoing trip to ${destinationName}. What would you like to do?`,
        buttons: [
          {
            text: 'Resume Trip',
            style: 'primary',
            onPress: () => {
              router.push('/trips/active');
            },
          },
          {
            text: 'Cancel & Start New',
            style: 'destructive',
            onPress: async () => {
              const cancelResult = await endTrip(existingTrip.id);
              if (cancelResult.success) {
                startNewTrip();
              }
            },
          },
          {
            text: 'Go Back',
            style: 'cancel',
            onPress: () => {},
          },
        ],
      });
    } else {
      startNewTrip();
    }
  };

  const startNewTrip = async () => {
    if (!routeData?.routes?.[selectedRoute]?.id) {
      dialog.showError('Error', 'No route selected');
      return;
    }

    const routeId = routeData.routes[selectedRoute].id;
    const startLat = parseFloat(params.startLat as string);
    const startLng = parseFloat(params.startLng as string);

    const result = await startTrip(routeId, startLat, startLng);

    if (result.success) {
      dialog.showSuccess(
        'Trip Started!',
        'Your trip tracking has begun. Stay safe!',
        () => {
          router.push('/trips/active');
        }
      );
    } else {
      dialog.showError('Failed to Start Trip', result.error || 'Unable to start trip. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <RouteDetailsSkeleton />;
  }

  const route = routeData?.routes?.[selectedRoute];
  const startLat = parseFloat(params.startLat as string);
  const startLng = parseFloat(params.startLng as string);
  const endLat = parseFloat(params.destLat as string);
  const endLng = parseFloat(params.destLng as string);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: (startLat + endLat) / 2,
          longitude: (startLng + endLng) / 2,
          latitudeDelta: Math.abs(startLat - endLat) * 2 || 0.01,
          longitudeDelta: Math.abs(startLng - endLng) * 2 || 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Start Marker */}
        <Marker
          coordinate={{
            latitude: startLat,
            longitude: startLng,
          }}
          title="Your Location"
        >
          <View style={[styles.startMarker, { backgroundColor: colors.primary }]}>
            <Icon name="person" size={20} color="white" />
          </View>
        </Marker>

        {/* End Marker */}
        <Marker
          coordinate={{
            latitude: endLat,
            longitude: endLng,
          }}
          title={params.destName as string}
          description={params.destAddress as string}
        >
          <View style={styles.endMarker}>
            <Icon name="location" size={30} color="#E53935" />
          </View>
        </Marker>

        {/* Route Polyline */}
        {route?.polyline && (
          <Polyline
            coordinates={route.polyline}
            strokeColor={colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.white }]}
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.white }]}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Route Summary */}
          <View style={styles.routeSummary}>
            <View style={styles.summaryRow}>
              <Text style={[styles.destinationName, { color: colors.text }]}>
                {params.destName}
              </Text>
            </View>

            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Icon name="navigate" size={20} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {route?.distance
                    ? `${(route.distance / 1000).toFixed(1)} km`
                    : 'Calculating...'}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Icon name="time" size={20} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {route?.duration ? `${Math.round(route.duration / 60)} min` : 'Calculating...'}
                </Text>
              </View>

              {route?.minFare && route?.maxFare && (
                <View style={styles.statItem}>
                  <Icon name="cash" size={20} color="#10B981" />
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    ₦{route.minFare}-₦{route.maxFare}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Start Trip Button */}
          <TouchableOpacity
            style={[
              styles.startButton,
              { backgroundColor: colors.primary },
              tripLoading && styles.disabledButton,
            ]}
            onPress={handleStartTrip}
            disabled={tripLoading}
            activeOpacity={0.7}
          >
            {tripLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Icon name="navigate" size={24} color="white" />
                <Text style={styles.startButtonText}>Start Trip</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Route Steps Preview */}
          {route?.steps && route.steps.length > 0 && (
            <View style={styles.instructionsContainer}>
              <View style={styles.stepsHeader}>
                <Text style={[styles.instructionsTitle, { color: colors.text }]}>
                  Trip Stops
                </Text>
                <View style={[styles.stepsCount, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.stepsCountText, { color: colors.primary }]}>
                    {route.steps.length} {route.steps.length === 1 ? 'stop' : 'stops'}
                  </Text>
                </View>
              </View>

              {route.steps.slice(0, 3).map((step: any, index: number) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.stepNumberText, { color: colors.primary }]}>
                      {index + 1}
                    </Text>
                  </View>

                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepInstruction, { color: colors.text }]}>
                      {getStepSummary(step)}
                    </Text>
                    <View style={styles.stepMeta}>
                      {(step.transportMode || step.transportModes) && (
                        <View style={[styles.transportBadge, { backgroundColor: colors.background }]}>
                          <Icon
                            name={getTransportIcon(step.transportMode || step.transportModes?.[0])}
                            size={14}
                            color={colors.primary}
                          />
                          <Text style={[styles.transportText, { color: colors.textMuted }]}>
                            {getTransportModesDisplay(step)}
                          </Text>
                        </View>
                      )}
                      {step.duration > 0 && (
                        <Text style={[styles.stepDuration, { color: colors.textMuted }]}>
                          {Math.round(step.duration / 60)} min
                        </Text>
                      )}
                      {step.estimatedFare && (
                        <Text style={[styles.stepFare, { color: '#10B981' }]}>
                          ₦{step.estimatedFare}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}

              {route.steps.length > 3 && (
                <TouchableOpacity style={styles.viewMoreButton}>
                  <Text style={[styles.viewMoreText, { color: colors.primary }]}>
                    View all {route.steps.length} stops
                  </Text>
                  <Icon name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// Helper function to get icon based on maneuver type
function getStepIcon(maneuver: string): string {
  if (!maneuver) return 'arrow-forward';

  const lowerManeuver = maneuver.toLowerCase();

  if (lowerManeuver.includes('right')) return 'arrow-forward';
  if (lowerManeuver.includes('left')) return 'arrow-back';
  if (lowerManeuver.includes('straight') || lowerManeuver.includes('continue'))
    return 'arrow-up';
  if (lowerManeuver.includes('arrive')) return 'flag';

  return 'navigate';
}

// Helper function to get transport mode icon
function getTransportIcon(mode: string | any): string {
  // Handle malformed transportMode (e.g., JSON strings or objects)
  let cleanMode = mode;

  if (typeof mode === 'object' && mode !== null) {
    cleanMode = mode.type || mode.mode || Object.values(mode)[0] || '';
  } else if (typeof mode === 'string') {
    cleanMode = mode
      .replace(/^\{?"?/g, '')
      .replace(/"?\}?$/g, '')
      .replace(/^["'\[]*/g, '')
      .replace(/["'\]]*$/g, '')
      .trim();
  }

  const normalizedMode = String(cleanMode).toLowerCase();

  switch (normalizedMode) {
    case 'bus':
      return 'bus';
    case 'taxi':
    case 'car':
      return 'car';
    case 'keke':
    case 'tricycle':
      return 'car-sport';
    case 'okada':
    case 'motorcycle':
      return 'bicycle';
    case 'walk':
    case 'walking':
      return 'walk';
    default:
      return 'navigate';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  endMarker: {
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  routeSummary: {
    marginBottom: 20,
  },
  summaryRow: {
    marginBottom: 12,
  },
  destinationName: {
    fontSize: 22,
    fontWeight: '600',
  },
  summaryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    rowGap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  stepsCount: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepsCountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepInfo: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  transportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  transportText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stepDuration: {
    fontSize: 13,
    fontWeight: '500',
  },
  stepFare: {
    fontSize: 13,
    fontWeight: '600',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
