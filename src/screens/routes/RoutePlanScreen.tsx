// src/screens/routes/RoutePlanScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useRouteService } from '@/hooks/useRouteService';
import { Button } from '@/components/common/Button';
import { routeStyles } from '@/styles/features';
import { Route, RouteStep } from '@/types/route';

export const RoutePlanScreen = () => {
  const router = useRouter();
  const colors = useThemedColors();
  const params = useLocalSearchParams();
  const { currentLocation, getCurrentLocation } = useCurrentLocation();
  const { findSmartRoutes, isLoading } = useRouteService();

  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    let startLat = params.startLat ? Number(params.startLat) : undefined;
    let startLng = params.startLng ? Number(params.startLng) : undefined;

    if (!startLat || !startLng) {
      const location = await getCurrentLocation();
      if (location) {
        startLat = location.latitude;
        startLng = location.longitude;
      } else {
        Alert.alert('Error', 'Unable to get your current location');
        return;
      }
    }

    const destinationLat = Number(params.destinationLat);
    const destinationLng = Number(params.destinationLng);
    const destinationName = params.destinationName as string;

    if (!destinationLat || !destinationLng) {
      Alert.alert('Error', 'Invalid destination coordinates');
      return;
    }

    const result = await findSmartRoutes(
      startLat,
      startLng,
      destinationLat,
      destinationLng,
      destinationName,
    );

    if (result.success && result.data.routes) {
      setRoutes(result.data.routes);
      if (result.data.routes.length > 0) {
        setSelectedRoute(result.data.routes[0]);
      }
    } else {
      Alert.alert('Error', result.error || 'Failed to find routes');
    }
  };

  const handleStartTrip = () => {
    if (!selectedRoute) return;

    router.push({
      pathname: '/trips/active' as any,
      params: {
        routeId: selectedRoute.routeId,
        routeData: JSON.stringify(selectedRoute),
      },
    });
  };

  const toggleStepExpansion = (stepOrder: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepOrder)) {
      newExpanded.delete(stepOrder);
    } else {
      newExpanded.add(stepOrder);
    }
    setExpandedSteps(newExpanded);
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'bus':
        return 'bus';
      case 'taxi':
        return 'car';
      case 'keke':
        return 'car-sport';
      case 'okada':
        return 'bicycle';
      case 'walk':
        return 'walk';
      default:
        return 'navigate';
    }
  };

  const getTransportColor = (mode: string) => {
    switch (mode) {
      case 'bus':
        return colors.primary;
      case 'taxi':
        return colors.warning;
      case 'keke':
        return colors.info;
      case 'okada':
        return colors.success;
      case 'walk':
        return colors.textMuted;
      default:
        return colors.text;
    }
  };

  const renderRouteOption = (route: Route, index: number) => {
    const isSelected = selectedRoute?.routeName === route.routeName;

    return (
      <TouchableOpacity
        key={index}
        style={[
          routeStyles.routeOption,
          {
            backgroundColor: colors.white,
            borderColor: isSelected ? colors.primary : colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => setSelectedRoute(route)}
        activeOpacity={0.7}
      >
        <View style={routeStyles.routeHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[routeStyles.routeName, { color: colors.text }]}>{route.routeName}</Text>
            <View style={routeStyles.routeMeta}>
              <View style={routeStyles.metaItem}>
                <Icon name="time-outline" size={16} color={colors.textMuted} />
                <Text style={[routeStyles.metaText, { color: colors.textMuted }]}>
                  {Math.round(route.duration)} min
                </Text>
              </View>
              <View style={routeStyles.metaItem}>
                <Icon name="navigate-outline" size={16} color={colors.textMuted} />
                <Text style={[routeStyles.metaText, { color: colors.textMuted }]}>
                  {route.distance.toFixed(1)} km
                </Text>
              </View>
              {route.minFare && route.maxFare && (
                <View style={routeStyles.metaItem}>
                  <Icon name="cash-outline" size={16} color={colors.textMuted} />
                  <Text style={[routeStyles.metaText, { color: colors.textMuted }]}>
                    ₦{route.minFare}-₦{route.maxFare}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {isSelected && <Icon name="checkmark-circle" size={24} color={colors.success} />}
        </View>

        <View style={routeStyles.transportModes}>
          {route.steps.map((step, idx) => (
            <View key={idx} style={routeStyles.transportMode}>
              <Icon
                name={getTransportIcon(step.transportMode)}
                size={20}
                color={getTransportColor(step.transportMode)}
              />
            </View>
          ))}
        </View>

        {route.requiresWalking && (
          <View style={[routeStyles.walkingBadge, { backgroundColor: colors.warningLight }]}>
            <Icon name="walk-outline" size={16} color={colors.warning} />
            <Text style={[routeStyles.walkingText, { color: colors.warning }]}>
              Includes {Math.round(route.finalDestinationInfo?.walkingDirections?.distance || 0)}m
              walk
            </Text>
          </View>
        )}

        <View style={routeStyles.confidenceBar}>
          <View
            style={[
              routeStyles.confidenceFill,
              {
                width: `${route.confidence}%`,
                backgroundColor:
                  route.confidence >= 90
                    ? colors.success
                    : route.confidence >= 70
                      ? colors.warning
                      : colors.error,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // CONSOLIDATED renderStep method
  const renderStep = (step: RouteStep, index: number) => {
    const isExpanded = expandedSteps.has(step.order);
    const isWalkingStep = step.transportMode === 'walk';
    const hasVehicleData = step.dataAvailability?.hasVehicleData ?? true;

    return (
      <View key={step.order} style={[routeStyles.stepCard, { backgroundColor: colors.white }]}>
        {/* Step Header */}
        <TouchableOpacity
          style={routeStyles.stepHeader}
          onPress={() => toggleStepExpansion(step.order)}
          activeOpacity={0.7}
        >
          <View
            style={[
              routeStyles.stepIcon,
              { backgroundColor: getTransportColor(step.transportMode) + '20' },
            ]}
          >
            <Icon
              name={getTransportIcon(step.transportMode)}
              size={24}
              color={getTransportColor(step.transportMode)}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[routeStyles.stepTitle, { color: colors.text }]}>
              Step {step.order}: {step.transportMode.toUpperCase()}
            </Text>
            <Text style={[routeStyles.stepSubtitle, { color: colors.textMuted }]}>
              {step.fromLocation} → {step.toLocation}
            </Text>

            {/* Data Availability Badge */}
            {!hasVehicleData && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <View
                  style={[
                    routeStyles.dataAvailabilityBadge,
                    { backgroundColor: colors.warningLight },
                  ]}
                >
                  <Icon name="information-circle-outline" size={14} color={colors.warning} />
                  <Text style={[routeStyles.dataAvailabilityText, { color: colors.warning }]}>
                    No vehicle data - Ask locals
                  </Text>
                </View>
              </View>
            )}

            <View style={routeStyles.stepMeta}>
              <Text style={[routeStyles.stepMetaText, { color: colors.textMuted }]}>
                {Math.round(step.duration)} min • {step.distance.toFixed(1)} km
                {step.estimatedFare && ` • ₦${step.estimatedFare}`}
              </Text>
            </View>
          </View>

          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={routeStyles.stepContent}>
            {/* Main Instructions */}
            <View
              style={[routeStyles.instructionsCard, { backgroundColor: colors.backgroundLight }]}
            >
              <Text style={[routeStyles.instructionsText, { color: colors.text }]}>
                {step.instructions}
              </Text>
            </View>

            {/* Alternative Options Card (for steps without vehicle data) */}
            {!hasVehicleData && step.alternativeOptions && (
              <View
                style={[routeStyles.alternativeOptionsCard, { backgroundColor: colors.infoLight }]}
              >
                <View style={routeStyles.alternativeOptionsHeader}>
                  <Icon name="people-outline" size={24} color={colors.info} />
                  <Text style={[routeStyles.alternativeOptionsTitle, { color: colors.text }]}>
                    Need Help? Ask Locals
                  </Text>
                </View>

                <Text
                  style={[routeStyles.alternativeOptionsDescription, { color: colors.textMuted }]}
                >
                  Avigate doesn't have vehicle data for this area. Here's what you can say:
                </Text>

                {/* Local Phrases */}
                <View style={routeStyles.localPhrases}>
                  {step.alternativeOptions.localPhrases.map((phrase, idx) => (
                    <View
                      key={idx}
                      style={[routeStyles.phraseItem, { backgroundColor: colors.white }]}
                    >
                      <Icon name="chatbubble-outline" size={16} color={colors.primary} />
                      <Text style={[routeStyles.phraseText, { color: colors.text }]}>
                        "{phrase}"
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Walkable Indicator */}
                {step.alternativeOptions.walkable && (
                  <View style={routeStyles.walkableNotice}>
                    <Icon name="walk-outline" size={16} color={colors.success} />
                    <Text style={[routeStyles.walkableText, { color: colors.success }]}>
                      This distance is walkable if no vehicle is available
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Walking Directions (if walking step) */}
            {isWalkingStep && step.walkingDirections && (
              <View style={routeStyles.walkingDirections}>
                <View style={routeStyles.walkingHeader}>
                  <Icon name="walk-outline" size={20} color={colors.warning} />
                  <Text style={[routeStyles.walkingTitle, { color: colors.text }]}>
                    Walking Directions
                  </Text>
                </View>

                {step.walkingDirections.steps.map((walkStep, idx) => (
                  <View key={idx} style={routeStyles.walkStep}>
                    <View style={routeStyles.walkStepNumber}>
                      <Text style={[routeStyles.walkStepNumberText, { color: colors.white }]}>
                        {idx + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[routeStyles.walkStepText, { color: colors.text }]}>
                        {walkStep.instruction}
                      </Text>
                      <Text style={[routeStyles.walkStepMeta, { color: colors.textMuted }]}>
                        {Math.round(walkStep.distance)}m • {Math.round(walkStep.duration)} min
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Alternative Transport (Okada/Keke) */}
                {step.alternativeTransport && (
                  <View
                    style={[routeStyles.alternativeCard, { backgroundColor: colors.successLight }]}
                  >
                    <View style={routeStyles.alternativeHeader}>
                      <Icon name="bicycle" size={20} color={colors.success} />
                      <Text style={[routeStyles.alternativeTitle, { color: colors.text }]}>
                        Alternative: Use {step.alternativeTransport.type.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[routeStyles.alternativeText, { color: colors.textMuted }]}>
                      {step.alternativeTransport.instructions}
                    </Text>
                    <Text style={[routeStyles.alternativeFare, { color: colors.success }]}>
                      Estimated fare: ₦{step.alternativeTransport.estimatedFare}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Connector Line */}
        {index < selectedRoute!.steps.length - 1 && (
          <View style={[routeStyles.stepConnector, { backgroundColor: colors.border }]} />
        )}
      </View>
    );
  };

  // ... rest of the component remains the same ...

  if (isLoading) {
    return (
      <View style={[routeStyles.container, { backgroundColor: colors.background }]}>
        <View style={routeStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[routeStyles.loadingText, { color: colors.text }]}>
            Finding best routes...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[routeStyles.container, { backgroundColor: colors.background }]}>
      <View style={[routeStyles.header, { backgroundColor: colors.white }]}>
        <TouchableOpacity onPress={() => router.back()} style={routeStyles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[routeStyles.headerTitle, { color: colors.text }]}>
            To {params.destinationName}
          </Text>
          {params.requiresWalking && (
            <Text style={[routeStyles.headerSubtitle, { color: colors.warning }]}>
              <Icon name="walk-outline" size={14} color={colors.warning} /> Walking required
            </Text>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {routes.length > 1 && (
          <View style={routeStyles.routeOptions}>
            <Text style={[routeStyles.sectionTitle, { color: colors.text }]}>
              Available Routes ({routes.length})
            </Text>
            {routes.map((route, index) => renderRouteOption(route, index))}
          </View>
        )}

        {selectedRoute && (
          <View style={routeStyles.routeDetails}>
            <Text style={[routeStyles.sectionTitle, { color: colors.text }]}>Route Details</Text>

            <View style={[routeStyles.summaryCard, { backgroundColor: colors.white }]}>
              <View style={routeStyles.summaryRow}>
                <View style={routeStyles.summaryItem}>
                  <Icon name="time-outline" size={24} color={colors.primary} />
                  <Text style={[routeStyles.summaryLabel, { color: colors.textMuted }]}>
                    Duration
                  </Text>
                  <Text style={[routeStyles.summaryValue, { color: colors.text }]}>
                    {Math.round(selectedRoute.duration)} min
                  </Text>
                </View>
                <View style={routeStyles.summaryItem}>
                  <Icon name="navigate-outline" size={24} color={colors.primary} />
                  <Text style={[routeStyles.summaryLabel, { color: colors.textMuted }]}>
                    Distance
                  </Text>
                  <Text style={[routeStyles.summaryValue, { color: colors.text }]}>
                    {selectedRoute.distance.toFixed(1)} km
                  </Text>
                </View>
                {selectedRoute.minFare && selectedRoute.maxFare && (
                  <View style={routeStyles.summaryItem}>
                    <Icon name="cash-outline" size={24} color={colors.primary} />
                    <Text style={[routeStyles.summaryLabel, { color: colors.textMuted }]}>
                      Fare
                    </Text>
                    <Text style={[routeStyles.summaryValue, { color: colors.text }]}>
                      ₦{selectedRoute.minFare}-₦{selectedRoute.maxFare}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={routeStyles.steps}>
              {selectedRoute.steps.map((step, index) => renderStep(step, index))}
            </View>

            {selectedRoute.requiresWalking && (
              <View style={[routeStyles.infoCard, { backgroundColor: colors.warningLight }]}>
                <Icon name="information-circle" size={24} color={colors.warning} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[routeStyles.infoTitle, { color: colors.text }]}>
                    Walking Required
                  </Text>
                  <Text style={[routeStyles.infoText, { color: colors.textMuted }]}>
                    This destination requires a short walk from the main road. We'll guide you
                    step-by-step!
                  </Text>
                </View>
              </View>
            )}

            {selectedRoute.source === 'intermediate_stop' && (
              <View style={[routeStyles.infoCard, { backgroundColor: colors.infoLight }]}>
                <Icon name="information-circle" size={24} color={colors.info} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[routeStyles.infoTitle, { color: colors.text }]}>
                    Intermediate Stop
                  </Text>
                  <Text style={[routeStyles.infoText, { color: colors.textMuted }]}>
                    Your destination is a stop along this route. Tell the conductor where you're
                    going!
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {selectedRoute && (
        <View style={[routeStyles.bottomAction, { backgroundColor: colors.white }]}>
          <Button
            title="Start Trip"
            onPress={handleStartTrip}
            icon="navigate"
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
};
