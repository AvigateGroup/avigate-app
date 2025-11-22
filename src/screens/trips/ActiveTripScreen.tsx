// src/screens/trips/ActiveTripScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Vibration,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useTripService } from '@/hooks/useTripService';
import { Button } from '@/components/common/Button';
import { tripStyles } from '@/styles/features';

interface TripProgress {
  currentStepCompleted: boolean;
  nextStepStarted: boolean;
  distanceToNextWaypoint: number;
  estimatedArrival: Date;
  alerts: string[];
}

interface ActiveTrip {
  id: string;
  routeId: string;
  currentStepId: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  startedAt: string;
  estimatedArrival: Date;
  currentLat: number;
  currentLng: number;
  route: {
    name: string;
    distance: number;
    estimatedDuration: number;
    minFare?: number;
    maxFare?: number;
    steps: Array<{
      id: string;
      order: number;
      fromLocation: string;
      toLocation: string;
      transportMode: string;
      instructions: string;
      duration: number;
      distance: number;
      estimatedFare?: number;
    }>;
  };
}

export const ActiveTripScreen = () => {
  const router = useRouter();
  const colors = useThemedColors();
  const params = useLocalSearchParams();
  const { watchLocation } = useCurrentLocation();
  const {
    getActiveTrip,
    updateTripLocation,
    completeTrip,
    cancelTrip,
    endTrip,
    isLoading,
  } = useTripService();

  const [trip, setTrip] = useState<ActiveTrip | null>(null);
  const [progress, setProgress] = useState<TripProgress | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadActiveTrip();
    startLocationTracking();

    return () => {
      // Cleanup location tracking on unmount
    };
  }, []);

  useEffect(() => {
    if (progress?.alerts && progress.alerts.length > 0) {
      handleProgressAlerts(progress.alerts);
    }
  }, [progress?.alerts]);
const loadActiveTrip = async () => {
  const result = await getActiveTrip();
  if (result.success && result.data?.trip) {
    setTrip(result.data.trip);
    updateCurrentStepIndex(result.data.trip);
  } else {
    Alert.alert('Error', 'No active trip found');
    router.back();
  }
};

const startLocationTracking = async () => {
  const subscription = await watchLocation(async location => {
    if (!trip) return;

    // Update trip location on backend
    const result = await updateTripLocation(trip.id, {
      lat: location.latitude,
      lng: location.longitude,
      accuracy: location.accuracy || undefined,
    });

    if (result.success && result.data?.progress) {
      setProgress(result.data.progress);

      // Update local trip state
      setTrip(prev => {
        if (!prev || !result.data?.progress) return prev;
        return {
          ...prev,
          currentLat: location.latitude,
          currentLng: location.longitude,
          estimatedArrival: new Date(result.data.progress.estimatedArrival),
        };
      });

      // Handle step completion
      if (result.data.progress.currentStepCompleted) {
        handleStepCompletion();
      }

      // Update progress animation
      updateProgressAnimation();
    }
  });

  // Store subscription for cleanup
  return subscription;
};

  const updateCurrentStepIndex = (tripData: ActiveTrip) => {
    const currentStep = tripData.route.steps.find(
      step => step.id === tripData.currentStepId,
    );
    if (currentStep) {
      setCurrentStepIndex(currentStep.order - 1);
    }
  };

  const handleProgressAlerts = (alerts: string[]) => {
    alerts.forEach(alert => {
      // Vibrate for important alerts
      Vibration.vibrate(400);

      // Show alert notification
      if (alert.includes('Approaching') || alert.includes('arrived')) {
        Alert.alert('Trip Update', alert);
      }
    });
  };

  const handleStepCompletion = () => {
    Vibration.vibrate([0, 200, 100, 200]);
    pulseAnimation();
  };

  const updateProgressAnimation = () => {
    if (!trip || !progress) return;

    const totalSteps = trip.route.steps.length;
    const progressValue = ((currentStepIndex + 1) / totalSteps) * 100;

    Animated.timing(progressAnim, {
      toValue: progressValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCompleteTrip = () => {
    Alert.alert(
      'Complete Trip',
      'Have you arrived at your destination?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, I Arrived',
          onPress: async () => {
            if (!trip) return;
            const result = await completeTrip(trip.id);
            if (result.success) {
              Alert.alert(
                'Trip Completed! 🎉',
                'A summary has been sent to your email. Thanks for using Avigate!',
                [{ text: 'OK', onPress: () => router.replace('/') }],
              );
            }
          },
        },
      ],
    );
  };

  const handleEndTrip = () => {
    Alert.alert(
      'End Trip',
      'Are you sure you want to end this trip? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Trip',
          style: 'destructive',
          onPress: async () => {
            if (!trip) return;
            const result = await endTrip(trip.id);
            if (result.success) {
              Alert.alert(
                'Trip Ended',
                'A summary has been sent to your email.',
                [{ text: 'OK', onPress: () => router.replace('/') }],
              );
            }
          },
        },
      ],
    );
  };

  const handleCancelTrip = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelTrip = async (reason?: string) => {
    if (!trip) return;

    const result = await cancelTrip(trip.id, reason);
    if (result.success) {
      Alert.alert(
        'Trip Cancelled',
        'Your trip has been cancelled. A confirmation has been sent to your email.',
        [{ text: 'OK', onPress: () => router.replace('/') }],
      );
    }
  };

  const formatTimeRemaining = (estimatedArrival: Date) => {
    const now = new Date();
    const diff = estimatedArrival.getTime() - now.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));

    if (minutes < 1) return 'Arriving now';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStepStatus = (stepOrder: number): 'completed' | 'current' | 'upcoming' => {
    if (stepOrder < currentStepIndex) return 'completed';
    if (stepOrder === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const renderCurrentStep = () => {
    if (!trip) return null;

    const currentStep = trip.route.steps[currentStepIndex];
    if (!currentStep) return null;

    const status = getStepStatus(currentStepIndex);

    return (
      <View style={[tripStyles.currentStepCard, { backgroundColor: colors.white }]}>
        <View style={tripStyles.currentStepHeader}>
          <Animated.View
            style={[
              tripStyles.currentStepIcon,
              {
                backgroundColor: colors.primary + '20',
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Icon name="navigate" size={32} color={colors.primary} />
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={[tripStyles.currentStepLabel, { color: colors.textMuted }]}>
              Current Step ({currentStepIndex + 1}/{trip.route.steps.length})
            </Text>
            <Text style={[tripStyles.currentStepTitle, { color: colors.text }]}>
              {currentStep.fromLocation}
            </Text>
            <Text style={[tripStyles.currentStepSubtitle, { color: colors.primary }]}>
              → {currentStep.toLocation}
            </Text>
          </View>
        </View>

        {/* Progress to next waypoint */}
        {progress && (
          <View style={tripStyles.waypointProgress}>
            <View style={tripStyles.progressRow}>
              <Icon name="location-outline" size={16} color={colors.textMuted} />
              <Text style={[tripStyles.progressText, { color: colors.textMuted }]}>
                {Math.round(progress.distanceToNextWaypoint)}m to next stop
              </Text>
            </View>
            <View style={[tripStyles.progressBarContainer, { backgroundColor: colors.border }]}>
              <Animated.View
                style={[
                  tripStyles.progressBarFill,
                  {
                    backgroundColor: colors.primary,
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={[tripStyles.instructionsBox, { backgroundColor: colors.infoLight }]}>
          <Icon name="information-circle" size={20} color={colors.info} />
          <Text style={[tripStyles.instructionsText, { color: colors.text }]}>
            {currentStep.instructions.split('\n')[0]}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={tripStyles.quickActions}>
          <TouchableOpacity
            style={[tripStyles.quickAction, { backgroundColor: colors.backgroundLight }]}
            onPress={() => {
              /* TODO: Show full instructions */
            }}
          >
            <Icon name="book-outline" size={20} color={colors.primary} />
            <Text style={[tripStyles.quickActionText, { color: colors.primary }]}>
              Full Instructions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAllSteps = () => {
    if (!trip) return null;

    return (
      <View style={tripStyles.allSteps}>
        <Text style={[tripStyles.sectionTitle, { color: colors.text }]}>All Steps</Text>

        {trip.route.steps.map((step, index) => {
          const status = getStepStatus(index);
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';

          return (
            <View
              key={step.id}
              style={[
                tripStyles.stepItem,
                {
                  backgroundColor: isCurrent
                    ? colors.primaryLight
                    : isCompleted
                      ? colors.successLight
                      : colors.white,
                  borderLeftColor: isCurrent
                    ? colors.primary
                    : isCompleted
                      ? colors.success
                      : colors.border,
                },
              ]}
            >
              <View style={tripStyles.stepItemHeader}>
                <View
                  style={[
                    tripStyles.stepNumber,
                    {
                      backgroundColor: isCurrent
                        ? colors.primary
                        : isCompleted
                          ? colors.success
                          : colors.border,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Icon name="checkmark" size={16} color={colors.white} />
                  ) : (
                    <Text style={[tripStyles.stepNumberText, { color: colors.white }]}>
                      {index + 1}
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[tripStyles.stepItemTitle, { color: colors.text }]}>
                    {step.fromLocation} → {step.toLocation}
                  </Text>
                  <Text style={[tripStyles.stepItemMeta, { color: colors.textMuted }]}>
                    {step.transportMode.toUpperCase()} • {Math.round(step.duration)} min
                    {step.estimatedFare && ` • ₦${step.estimatedFare}`}
                  </Text>
                </View>

                {isCurrent && (
                  <View style={[tripStyles.currentBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[tripStyles.currentBadgeText, { color: colors.white }]}>
                      NOW
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderCancelConfirmModal = () => {
    if (!showCancelConfirm) return null;

    return (
      <View style={tripStyles.modalOverlay}>
        <View style={[tripStyles.modalContent, { backgroundColor: colors.white }]}>
          <Text style={[tripStyles.modalTitle, { color: colors.text }]}>Cancel Trip?</Text>
          <Text style={[tripStyles.modalText, { color: colors.textMuted }]}>
            Are you sure you want to cancel this trip? You can also end the trip to save your
            progress.
          </Text>

          <View style={tripStyles.modalActions}>
            <Button
              title="Keep Going"
              onPress={() => setShowCancelConfirm(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="End Trip"
              onPress={() => {
                setShowCancelConfirm(false);
                handleEndTrip();
              }}
              variant="outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Cancel"
              onPress={() => {
                setShowCancelConfirm(false);
                confirmCancelTrip('User cancelled');
              }}
              variant="destructive"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    );
  };

  if (!trip) {
    return (
      <View style={[tripStyles.container, { backgroundColor: colors.background }]}>
        <View style={tripStyles.loadingContainer}>
          <Icon name="navigate-circle-outline" size={64} color={colors.primary} />
          <Text style={[tripStyles.loadingText, { color: colors.text }]}>
            Loading your trip...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[tripStyles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[tripStyles.header, { backgroundColor: colors.primary }]}>
        <View style={tripStyles.headerTop}>
          <TouchableOpacity onPress={handleCancelTrip} style={tripStyles.headerButton}>
            <Icon name="close" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[tripStyles.headerTitle, { color: colors.white }]}>Trip in Progress</Text>
            <Text style={[tripStyles.headerSubtitle, { color: colors.white }]}>
              {trip.route.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => {}} style={tripStyles.headerButton}>
            <Icon name="menu" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* ETA Card */}
        <View style={[tripStyles.etaCard, { backgroundColor: colors.white }]}>
          <View style={tripStyles.etaRow}>
            <View style={tripStyles.etaItem}>
              <Icon name="time-outline" size={20} color={colors.primary} />
              <Text style={[tripStyles.etaLabel, { color: colors.textMuted }]}>ETA</Text>
              <Text style={[tripStyles.etaValue, { color: colors.text }]}>
                {formatTimeRemaining(trip.estimatedArrival)}
              </Text>
            </View>
            <View style={tripStyles.etaDivider} />
            <View style={tripStyles.etaItem}>
              <Icon name="navigate-outline" size={20} color={colors.primary} />
              <Text style={[tripStyles.etaLabel, { color: colors.textMuted }]}>Distance</Text>
              <Text style={[tripStyles.etaValue, { color: colors.text }]}>
                {trip.route.distance.toFixed(1)} km
              </Text>
            </View>
            <View style={tripStyles.etaDivider} />
            <View style={tripStyles.etaItem}>
              <Icon name="cash-outline" size={20} color={colors.primary} />
              <Text style={[tripStyles.etaLabel, { color: colors.textMuted }]}>Fare</Text>
              <Text style={[tripStyles.etaValue, { color: colors.text }]}>
                ₦{trip.route.minFare}-₦{trip.route.maxFare}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tripStyles.content}>
        {/* Current Step Card */}
        {renderCurrentStep()}

        {/* All Steps */}
        {renderAllSteps()}

        {/* Safety Tips */}
        <View style={[tripStyles.tipsCard, { backgroundColor: colors.infoLight }]}>
          <Icon name="shield-checkmark-outline" size={24} color={colors.info} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[tripStyles.tipsTitle, { color: colors.text }]}>Safety Tips</Text>
            <Text style={[tripStyles.tipsText, { color: colors.textMuted }]}>
              • Keep your belongings secure{'\n'}
              • Tell the driver your stop early{'\n'}
              • Share your trip with someone
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[tripStyles.bottomActions, { backgroundColor: colors.white }]}>
        <Button
          title="I've Arrived"
          onPress={handleCompleteTrip}
          icon="checkmark-circle"
          style={{ flex: 1 }}
        />
      </View>

      {/* Cancel Confirm Modal */}
      {renderCancelConfirmModal()}
    </View>
  );
};