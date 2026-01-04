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
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useRouteService } from '@/hooks/useRouteService';

export default function RouteDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useThemedColors();
  const mapRef = useRef<MapView>(null);
  const { findSmartRoutes, startTrip, isLoading } = useRouteService();

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

        // Fit map to show entire route
        setTimeout(() => {
          if (mapRef.current && result.data.routes?.[0]) {
            const coords = result.data.routes[0].polyline || [
              { latitude: startLat, longitude: startLng },
              { latitude: endLat, longitude: endLng },
            ];

            mapRef.current.fitToCoordinates(coords, {
              edgePadding: { top: 50, right: 50, bottom: 250, left: 50 },
              animated: true,
            });
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
      Alert.alert('Error', 'No route selected');
      return;
    }

    const routeId = routeData.routes[selectedRoute].id;
    const startLat = parseFloat(params.startLat as string);
    const startLng = parseFloat(params.startLng as string);

    const result = await startTrip(routeId, startLat, startLng);

    if (result.success) {
      Alert.alert('Trip Started', 'Your trip has been started successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to active trip screen
            router.push('/trips/active');
          },
        },
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to start trip');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Finding best route...
          </Text>
        </View>
      </View>
    );
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
            </View>
          </View>

          {/* Start Trip Button */}
          <TouchableOpacity
            style={[
              styles.startButton,
              { backgroundColor: colors.primary },
              isLoading && styles.disabledButton,
            ]}
            onPress={handleStartTrip}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Icon name="navigate" size={24} color="white" />
                <Text style={styles.startButtonText}>Start Trip</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Route Instructions */}
          {route?.steps && route.steps.length > 0 && (
            <View style={styles.instructionsContainer}>
              <Text style={[styles.instructionsTitle, { color: colors.text }]}>
                Directions
              </Text>

              {route.steps.map((step: any, index: number) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepIcon, { backgroundColor: colors.background }]}>
                    <Icon
                      name={getStepIcon(step.maneuver)}
                      size={18}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.stepInfo}>
                    <Text style={[styles.stepInstruction, { color: colors.text }]}>
                      {step.instruction || step.name}
                    </Text>
                    {step.distance && (
                      <Text style={[styles.stepDistance, { color: colors.textMuted }]}>
                        {(step.distance / 1000).toFixed(1)} km
                      </Text>
                    )}
                  </View>
                </View>
              ))}
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
    gap: 24,
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
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 15,
    marginBottom: 4,
  },
  stepDistance: {
    fontSize: 13,
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
