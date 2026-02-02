// src/screens/trips/ActiveTripScreen.tsx - REDESIGNED FOR REAL-TIME NAVIGATION

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useTripService } from '@/hooks/useTripService';
import { useDialog } from '@/contexts/DialogContext';
import { Button } from '@/components/common/Button';
import { tripStyles } from '@/styles/features';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RouteStep {
  id: string;
  order: number;
  fromLocation: string;
  toLocation: string;
  transportMode: 'bus' | 'taxi' | 'keke' | 'okada' | 'walk';
  instructions: string;
  duration: number;
  distance: number;
  estimatedFare?: number;
  dataAvailability?: any;
  walkingDirections?: any;
  alternativeTransport?: any;
  alternativeOptions?: any;
}

interface ActiveTrip {
  id: string;
  routeId: string;
  currentStepId: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  startedAt: string;
  estimatedArrival: string | Date;
  currentLat: number;
  currentLng: number;
  route: {
    name: string;
    distance: number;
    estimatedDuration: number;
    minFare?: number;
    maxFare?: number;
    steps: RouteStep[];
    startLocation?: any;
    endLocation?: any;
  };
}

export const ActiveTripScreen = () => {
  const router = useRouter();
  const colors = useThemedColors();
  const dialog = useDialog();
  const mapRef = useRef<MapView>(null);
  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);

  const { getActiveTrip, updateTripLocation, endTrip, isLoading } = useTripService();

  const [trip, setTrip] = useState<ActiveTrip | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0); // Track sub-step within current step
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distanceToNext, setDistanceToNext] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [sheetHeight] = useState(new Animated.Value(400)); // Bottom sheet height
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  useEffect(() => {
    loadActiveTrip();
    startLocationTracking();

    return () => {
      stopLocationTracking();
    };
  }, []);

  useEffect(() => {
    if (trip && userLocation && mapRef.current) {
      // Center map on user location
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [userLocation]);

  const loadActiveTrip = async () => {
    const result = await getActiveTrip();
    if (result.success && result.data?.trip) {
      const apiTrip = result.data.trip as any;

      if (!apiTrip.route) {
        dialog.showError('Error', 'Trip route information is missing');
        router.back();
        return;
      }

      const transformedTrip: ActiveTrip = {
        ...apiTrip,
        route: {
          ...apiTrip.route,
          steps: (apiTrip.route.steps || []).map((step: any, index: number) => ({
            id: step.id || `step-${index}`,
            order: step.order || index + 1,
            fromLocation: step.fromLocation?.name || step.fromLocation || 'Start',
            toLocation: step.toLocation?.name || step.toLocation || 'Destination',
            transportMode: step.transportMode || 'walking',
            instructions: step.instructions || 'Follow the route',
            duration: step.duration || 0,
            distance: step.distance || 0,
            estimatedFare: step.estimatedFare,
            dataAvailability: step.dataAvailability,
            walkingDirections: step.walkingDirections,
            alternativeTransport: step.alternativeTransport,
            alternativeOptions: step.alternativeOptions,
          })),
        },
      };

      setTrip(transformedTrip);
      updateCurrentStepIndex(transformedTrip);
    } else {
      dialog.showError('Error', 'No active trip found');
      router.back();
    }
  };

  const updateCurrentStepIndex = (tripData: ActiveTrip) => {
    if (!tripData.route.steps || tripData.route.steps.length === 0) return;

    const index = tripData.route.steps.findIndex(step => step.id === tripData.currentStepId);
    if (index !== -1) {
      setCurrentStepIndex(index);
    }
  };

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        dialog.showWarning('Permission Denied', 'Location permission is required for trip tracking');
        return;
      }

      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
      });

      // Start watching location
      locationWatchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Or when moved 10 meters
        },
        async (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          setUserLocation(newLocation);

          // Send location update to backend
          if (trip) {
            const result = await updateTripLocation(
              trip.id,
              {
                lat: newLocation.latitude,
                lng: newLocation.longitude,
                accuracy: location.coords.accuracy || undefined,
              }
            );

            if (result.success && result.data?.progress) {
              const progress = result.data.progress;
              // Update distance and alerts from backend
              if (progress.distanceToNextWaypoint) {
                setDistanceToNext(progress.distanceToNextWaypoint);
              }

              if (progress.alerts && progress.alerts.length > 0) {
                setAlerts(progress.alerts);
                // Show alert banner
                progress.alerts.forEach((alert: string) => {
                  dialog.showSuccess('Alert', alert);
                });
              }

              // Check if step completed
              if (progress.currentStepCompleted) {
                // Reload trip to get updated current step
                loadActiveTrip();
              }
            }
          }
        }
      );
    } catch (error) {
      console.error('Location tracking error:', error);
      dialog.showError('Error', 'Failed to start location tracking');
    }
  };

  const stopLocationTracking = () => {
    if (locationWatchRef.current) {
      locationWatchRef.current.remove();
      locationWatchRef.current = null;
    }
  };

  const handleCompleteTrip = () => {
    dialog.showConfirm(
      'Complete Trip',
      'Are you sure you have arrived at your destination?',
      async () => {
        if (!trip) return;

        const result = await endTrip(trip.id);
        if (result.success) {
          dialog.showSuccess(
            'Trip Completed!',
            'Your trip has been completed. A summary has been sent to your email.',
            () => {
              router.replace('/(tabs)');
            }
          );
        }
      }
    );
  };

  const handleCancelTrip = () => {
    dialog.showDestructive(
      'Cancel Trip',
      'Are you sure you want to cancel this trip?',
      async () => {
        if (!trip) return;

        const result = await endTrip(trip.id);
        if (result.success) {
          dialog.showSuccess(
            'Trip Cancelled',
            'Your trip has been cancelled.',
            () => {
              router.replace('/(tabs)');
            }
          );
        }
      },
      'Cancel Trip'
    );
  };

  const toggleSheet = () => {
    const toValue = isSheetExpanded ? 300 : SCREEN_HEIGHT * 0.7;
    Animated.spring(sheetHeight, {
      toValue,
      useNativeDriver: false,
    }).start();
    setIsSheetExpanded(!isSheetExpanded);
  };

  const formatTimeRemaining = (estimatedArrival: Date | string | undefined) => {
    if (!estimatedArrival) return 'Calculating...';

    const now = new Date();
    const arrivalDate = typeof estimatedArrival === 'string' ? new Date(estimatedArrival) : estimatedArrival;

    if (isNaN(arrivalDate.getTime())) return 'Calculating...';

    const diff = arrivalDate.getTime() - now.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));

    if (minutes < 1) return 'Arriving now';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'bus': return 'bus';
      case 'taxi': return 'car';
      case 'keke': return 'car-sport';
      case 'okada': return 'bicycle';
      case 'walk': return 'walk';
      default: return 'navigate';
    }
  };

  const getTransportColor = (mode: string) => {
    switch (mode) {
      case 'bus': return colors.primary;
      case 'taxi': return colors.warning;
      case 'keke': return colors.info;
      case 'okada': return colors.success;
      case 'walk': return colors.textMuted;
      default: return colors.text;
    }
  };

  // Parse instructions into actionable sub-steps - ALWAYS creates proper card-based navigation
  const parseInstructionsIntoSubSteps = (instructions: string, transportMode: string, step?: RouteStep) => {
    const subSteps: Array<{
      title: string;
      type: 'walking' | 'pickup' | 'transit' | 'arrival' | 'info';
      icon: string;
      content: string[];
      action?: string; // CTA text
    }> = [];

    // Safety check for instructions
    const safeInstructions = instructions || '';

    // Debug logging
    console.log('📍 parseInstructionsIntoSubSteps called:', {
      instructionsLength: safeInstructions.length,
      transportMode,
      stepFromLocation: step?.fromLocation,
      stepToLocation: step?.toLocation,
    });

    // Parse any instruction content from database
    const lines = safeInstructions.split('\n').filter(line => line.trim());
    const instructionItems: string[] = [];

    for (const line of lines) {
      const cleanLine = line.replace(/\*\*/g, '').replace(/^[-•]\s*/, '').trim();
      if (cleanLine.length > 0 && !cleanLine.endsWith(':')) {
        instructionItems.push(cleanLine);
      }
    }

    // Get display names
    const fromLocation = step?.fromLocation || 'pickup point';
    const toLocation = step?.toLocation || 'destination';
    const isWalking = transportMode === 'walk' || transportMode === 'walking';
    const transportName = getTransportDisplayName(transportMode);
    const duration = step?.duration ? Math.round(step.duration / 60) : null;
    const fare = step?.estimatedFare;

    if (isWalking) {
      // Walking-only step: just walking phase
      subSteps.push({
        title: `Walk to ${toLocation}`,
        type: 'walking',
        icon: 'walk',
        content: instructionItems.length > 0 ? instructionItems : [
          'Follow the route shown on the map',
          'Stay on main paths for safety',
          duration ? `Estimated walking time: ${duration} minutes` : 'Walk at a comfortable pace',
        ],
        action: 'I\'ve arrived',
      });
    } else {
      // Vehicle-based transport: walking → pickup → transit phases

      // Phase 1: Walking to pickup point
      subSteps.push({
        title: `Walk to ${fromLocation}`,
        type: 'walking',
        icon: 'walk',
        content: [
          `Head to the ${transportName} pickup area`,
          'Look for other passengers waiting',
          'Stay visible to drivers',
        ],
        action: 'I\'m at pickup point',
      });

      // Phase 2: Board the vehicle
      const pickupContent = [
        `Look for ${transportName}s heading to ${toLocation}`,
      ];

      // Add Nigerian-specific tips based on transport mode
      if (transportMode === 'bus') {
        pickupContent.push('Listen for conductors calling your destination');
        pickupContent.push('Board when the bus stops - they may not wait long');
      } else if (transportMode === 'taxi') {
        pickupContent.push('Tell the driver: "I dey go ' + toLocation + '"');
        pickupContent.push('Confirm the fare before boarding');
      } else if (transportMode === 'keke') {
        pickupContent.push('Keke-napeps are shared - wait for other passengers');
        pickupContent.push('Sit in order of your stop');
      } else if (transportMode === 'okada') {
        pickupContent.push('Negotiate the fare before riding');
        pickupContent.push('Hold on securely during the ride');
      }

      if (fare) {
        pickupContent.push(`Expected fare: ₦${fare}`);
      }

      subSteps.push({
        title: `Board ${transportName} to ${toLocation}`,
        type: 'pickup',
        icon: getTransportIcon(transportMode),
        content: pickupContent,
        action: 'I\'m in the vehicle',
      });

      // Phase 3: Transit/Journey
      const transitContent = instructionItems.length > 0 ? instructionItems : [
        `You are riding to ${toLocation}`,
        'Watch for landmarks mentioned by the conductor',
        'Avigate will notify you when approaching',
      ];

      if (duration) {
        transitContent.push(`Journey time: approximately ${duration} minutes`);
      }

      subSteps.push({
        title: `Riding to ${toLocation}`,
        type: 'transit',
        icon: 'navigate',
        content: transitContent,
        action: 'I\'ve arrived',
      });
    }

    return subSteps;
  };

  // Get human-readable transport name
  const getTransportDisplayName = (mode: string): string => {
    switch (mode.toLowerCase()) {
      case 'bus': return 'bus';
      case 'taxi': return 'taxi';
      case 'keke': return 'keke';
      case 'okada': return 'okada';
      case 'walk':
      case 'walking': return 'walking';
      default: return 'transport';
    }
  };

  const handleNextSubStep = () => {
    if (!trip || !trip.route.steps || trip.route.steps.length === 0) return;

    const currentStep = trip.route.steps[currentStepIndex];
    const subSteps = parseInstructionsIntoSubSteps(currentStep.instructions, currentStep.transportMode, currentStep);

    if (currentSubStepIndex < subSteps.length - 1) {
      // Move to next sub-step
      setCurrentSubStepIndex(currentSubStepIndex + 1);
    } else if (currentStepIndex < trip.route.steps.length - 1) {
      // Move to next main step
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentSubStepIndex(0);
    }
  };

  const handlePreviousSubStep = () => {
    if (currentSubStepIndex > 0) {
      // Move to previous sub-step
      setCurrentSubStepIndex(currentSubStepIndex - 1);
    } else if (currentStepIndex > 0) {
      // Move to previous main step
      const prevStep = trip!.route.steps[currentStepIndex - 1];
      const prevSubSteps = parseInstructionsIntoSubSteps(prevStep.instructions, prevStep.transportMode, prevStep);
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentSubStepIndex(prevSubSteps.length - 1);
    }
  };

  const getSubStepColor = (type: string) => {
    switch (type) {
      case 'walking': return colors.info;
      case 'pickup': return colors.warning;
      case 'transit': return colors.primary;
      case 'arrival': return colors.success;
      default: return colors.textMuted;
    }
  };

  const renderCurrentStepCard = () => {
    if (!trip || !trip.route.steps || trip.route.steps.length === 0) return null;

    const currentStep = trip.route.steps[currentStepIndex];
    if (!currentStep) return null;

    const subSteps = parseInstructionsIntoSubSteps(currentStep.instructions, currentStep.transportMode, currentStep);
    const currentSubStep = subSteps[currentSubStepIndex] || subSteps[0];
    const isLastStep = currentStepIndex === trip.route.steps.length - 1;
    const isLastSubStep = currentSubStepIndex === subSteps.length - 1;
    const nextMainStep = !isLastStep ? trip.route.steps[currentStepIndex + 1] : null;
    const subStepColor = getSubStepColor(currentSubStep.type);

    return (
      <View style={styles.currentStepCard}>
        {/* Progress Dots */}
        <View style={styles.subStepProgress}>
          {subSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentSubStepIndex && styles.progressDotActive,
                index < currentSubStepIndex && styles.progressDotCompleted,
                { backgroundColor: index <= currentSubStepIndex ? subStepColor : '#E5E7EB' }
              ]}
            />
          ))}
        </View>

        {/* Stop Header */}
        <View style={styles.stopHeaderRow}>
          <Text style={[styles.stopNumber, { color: colors.textMuted }]}>
            Stop {currentStepIndex + 1} of {trip.route.steps.length}
          </Text>
          {distanceToNext !== null && (
            <View style={[styles.distanceBadge, { backgroundColor: subStepColor + '20' }]}>
              <Text style={[styles.distanceText, { color: subStepColor }]}>
                {distanceToNext < 1000 ? `${Math.round(distanceToNext)}m` : `${(distanceToNext / 1000).toFixed(1)}km`}
              </Text>
            </View>
          )}
        </View>

        {/* Large Action Icon - 120px container with 72px icon */}
        <View style={[styles.largeIconContainer, { backgroundColor: subStepColor + '15' }]}>
          <Icon name={currentSubStep.icon} size={72} color={subStepColor} />
        </View>

        {/* Main Instruction */}
        <Text style={styles.mainInstructionTitle}>{currentSubStep.title}</Text>

        {/* Destination */}
        <View style={styles.destinationRow}>
          <Icon name="location" size={20} color={colors.primary} />
          <Text style={styles.destinationText}>
            To: {currentStep.toLocation}
          </Text>
        </View>

        {/* Instruction Content */}
        <ScrollView
          style={styles.instructionContentScroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {currentSubStep.content.map((item, i) => (
            <View key={i} style={styles.instructionItem}>
              <View style={[styles.instructionBullet, { backgroundColor: subStepColor }]} />
              <Text style={styles.instructionItemText}>{item}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {(currentStepIndex > 0 || currentSubStepIndex > 0) && (
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={handlePreviousSubStep}
              activeOpacity={0.7}
            >
              <Icon name="chevron-back" size={20} color={colors.text} />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          {currentSubStep.action && (
            <TouchableOpacity
              style={[styles.navButton, styles.actionButton, { backgroundColor: subStepColor }]}
              onPress={handleNextSubStep}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>{currentSubStep.action}</Text>
              <Icon name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Next Stop Preview */}
        {isLastSubStep && nextMainStep && (
          <View style={[styles.nextStopPreview, { backgroundColor: colors.background }]}>
            <Text style={styles.nextStopLabel}>NEXT STOP</Text>
            <View style={styles.nextStopContent}>
              <Icon
                name={getTransportIcon(nextMainStep.transportMode)}
                size={18}
                color={colors.textMuted}
              />
              <Text style={styles.nextStopText} numberOfLines={1}>
                {nextMainStep.transportMode.toUpperCase()}: {nextMainStep.toLocation}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderProgressBar = () => {
    if (!trip || !trip.route.steps || trip.route.steps.length === 0) return null;

    const progress = ((currentStepIndex + 1) / trip.route.steps.length) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStepIndex + 1}/{trip.route.steps.length} stops completed
        </Text>
      </View>
    );
  };

  const renderAllSteps = () => {
    if (!trip || !trip.route.steps || trip.route.steps.length === 0) return null;

    return (
      <View style={styles.allStepsContainer}>
        <Text style={styles.allStepsTitle}>All Stops</Text>
        {trip.route.steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <View key={step.id} style={styles.stepListItem}>
              <View style={[
                styles.stepNumberCircle,
                isCompleted && styles.stepNumberCircleCompleted,
                isCurrent && styles.stepNumberCircleCurrent,
              ]}>
                {isCompleted ? (
                  <Icon name="checkmark" size={16} color={colors.white} />
                ) : (
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                )}
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Icon
                    name={getTransportIcon(step.transportMode)}
                    size={16}
                    color={isCurrent ? colors.primary : colors.textMuted}
                  />
                  <Text style={[
                    styles.stepListMode,
                    isCurrent && styles.stepListModeCurrent,
                  ]}>
                    {step.transportMode.toUpperCase()}
                  </Text>
                </View>
                <Text style={[
                  styles.stepListLocation,
                  isCurrent && styles.stepListLocationCurrent,
                  isCompleted && styles.stepListLocationCompleted,
                ]}>
                  {step.toLocation}
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                  <Text style={styles.stepListMeta}>
                    {Math.round(step.duration / 60)} min
                  </Text>
                  {step.estimatedFare && (
                    <Text style={styles.stepListMeta}>
                      ₦{step.estimatedFare}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  if (!trip) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading your trip...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || trip.currentLat,
          longitude: userLocation?.longitude || trip.currentLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        followsUserLocation
      >
        {/* Destination Marker */}
        {trip.route.endLocation && (
          <Marker
            coordinate={{
              latitude: Number(trip.route.endLocation.latitude),
              longitude: Number(trip.route.endLocation.longitude),
            }}
            title={trip.route.endLocation.name}
          >
            <Icon name="location" size={40} color="#E53935" />
          </Marker>
        )}

        {/* Route Polyline - if available */}
        {/* You can add polyline here if you have route coordinates */}
      </MapView>

      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.white }]}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={[styles.etaBanner, { backgroundColor: colors.white }]}>
          <Icon name="time" size={20} color={colors.primary} />
          <Text style={styles.etaText}>
            {formatTimeRemaining(trip.estimatedArrival)}
          </Text>
          <Text style={styles.etaLabel}>ETA</Text>
        </View>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.white }]}
          onPress={handleCancelTrip}
        >
          <Icon name="close" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
        {/* Sheet Handle */}
        <TouchableOpacity onPress={toggleSheet} style={styles.sheetHandle}>
          <View style={styles.handle} />
        </TouchableOpacity>

        {/* Sheet Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderCurrentStepCard()}
          {renderProgressBar()}
          {isSheetExpanded && renderAllSteps()}

          {/* Complete Button */}
          <View style={{ padding: 16 }}>
            <Button
              title="I've Arrived"
              onPress={handleCompleteTrip}
              icon="checkmark-circle"
              style={{ backgroundColor: colors.success }}
            />
          </View>
        </ScrollView>
      </Animated.View>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <View style={[styles.alertBanner, { backgroundColor: colors.warning }]}>
          <Icon name="alert-circle" size={24} color={colors.white} />
          <Text style={styles.alertText}>{alerts[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  topControls: {
    position: 'absolute' as const,
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  etaBanner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  etaText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#111',
  },
  etaLabel: {
    fontSize: 12,
    color: '#666',
  },
  bottomSheet: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHandle: {
    alignItems: 'center' as const,
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  currentStepCard: {
    padding: 20,
    maxHeight: '80%',
  },
  subStepProgress: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginBottom: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 24,
    borderRadius: 4,
  },
  progressDotCompleted: {
    // Color set dynamically
  },
  stopHeaderRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  stopNumber: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  largeIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    alignSelf: 'center' as const,
    marginBottom: 20,
  },
  mainInstructionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111',
    textAlign: 'center' as const,
    marginBottom: 16,
    lineHeight: 32,
  },
  destinationRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignSelf: 'center' as const,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111',
  },
  instructionContentScroll: {
    maxHeight: 200,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 12,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  instructionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  instructionItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  navigationButtons: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 16,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  prevButton: {
    backgroundColor: '#F3F4F6',
    flex: 0.4,
  },
  actionButton: {
    flex: 1,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#374151',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  nextStopPreview: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nextStopLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  nextStopContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
  },
  nextStopText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
  },
  stepHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  transportIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  stepMode: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#111',
  },
  stepProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  distanceBadge: {
    backgroundColor: '#86B300',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  distanceText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  instructionContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111',
  },
  destinationInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 12,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111',
  },
  destinationBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  destinationBadgeText: {
    fontSize: 15,
    fontWeight: '600' as const,
    flex: 1,
  },
  instructionsScroll: {
    maxHeight: 350,
    marginBottom: 12,
  },
  instructionSection: {
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  sectionContent: {
    gap: 8,
  },
  sectionItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  sectionItemText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  nextStepPreview: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  nextStepLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#666',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  nextStepContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  nextStepText: {
    fontSize: 14,
    color: '#111',
    flex: 1,
  },
  progressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center' as const,
  },
  allStepsContainer: {
    padding: 16,
  },
  allStepsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#111',
    marginBottom: 16,
  },
  stepListItem: {
    flexDirection: 'row' as const,
    marginBottom: 16,
  },
  stepNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  stepNumberCircleCompleted: {
    backgroundColor: '#86B300',
  },
  stepNumberCircleCurrent: {
    backgroundColor: '#3B82F6',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
  },
  stepListMode: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
    marginLeft: 6,
  },
  stepListModeCurrent: {
    color: '#3B82F6',
  },
  stepListLocation: {
    fontSize: 15,
    color: '#666',
  },
  stepListLocationCurrent: {
    color: '#111',
    fontWeight: '600' as const,
  },
  stepListLocationCompleted: {
    textDecorationLine: 'line-through' as const,
  },
  stepListMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  alertBanner: {
    position: 'absolute' as const,
    top: Platform.OS === 'ios' ? 110 : 100,
    left: 16,
    right: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
};
