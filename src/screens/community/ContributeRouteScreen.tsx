// src/screens/community/ContributeRouteScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useCommunityService } from '@/hooks/useCommunityService';
import { useDialog } from '@/contexts/DialogContext';
import { Button } from '@/components/common/Button';
import { contributeStyles } from '@/styles/features';

type ContributionType =
  | 'new_route'
  | 'route_update'
  | 'fare_correction'
  | 'new_intermediate_stop'
  | 'instructions_update';

export const ContributeRouteScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemedColors();
  const dialog = useDialog();
  const { submitContribution, isLoading } = useCommunityService();

  const [contributionType, setContributionType] = useState<ContributionType>('route_update');
  const [description, setDescription] = useState('');

  // Route data
  const [routeName, setRouteName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [transportModes, setTransportModes] = useState<string[]>([]);
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [minFare, setMinFare] = useState('');
  const [maxFare, setMaxFare] = useState('');
  const [instructions, setInstructions] = useState('');

  // Intermediate stop data
  const [stopName, setStopName] = useState('');
  const [segmentName, setSegmentName] = useState('');
  const [landmarks, setLandmarks] = useState('');
  const [isOptional, setIsOptional] = useState(false);

  const contributionTypes = [
    {
      type: 'new_route' as const,
      label: 'New Route',
      icon: 'add-circle-outline',
      description: 'Suggest a completely new route',
    },
    {
      type: 'route_update' as const,
      label: 'Route Update',
      icon: 'refresh-outline',
      description: 'Update existing route details',
    },
    {
      type: 'fare_correction' as const,
      label: 'Fare Correction',
      icon: 'cash-outline',
      description: 'Report fare changes',
    },
    {
      type: 'new_intermediate_stop' as const,
      label: 'Add Stop',
      icon: 'location-outline',
      description: 'Add intermediate stop to route',
    },
    {
      type: 'instructions_update' as const,
      label: 'Better Instructions',
      icon: 'document-text-outline',
      description: 'Improve route directions',
    },
  ];

  const transportOptions = ['bus', 'taxi', 'keke', 'okada'];

  const toggleTransportMode = (mode: string) => {
    if (transportModes.includes(mode)) {
      setTransportModes(transportModes.filter(m => m !== mode));
    } else {
      setTransportModes([...transportModes, mode]);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Toast.show({ type: 'error', text1: 'Missing Description', text2: 'Please describe your contribution' });
      return;
    }

    let proposedData: any = {};

    switch (contributionType) {
      case 'new_route':
        if (!routeName || !startLocation || !endLocation) {
          Toast.show({ type: 'error', text1: 'Missing Info', text2: 'Please fill in route name, start and end locations' });
          return;
        }
        proposedData = {
          name: routeName,
          startLocation,
          endLocation,
          transportModes,
          estimatedDuration: parseInt(estimatedDuration) || 0,
          distance: parseFloat(distance) || 0,
          minFare: parseFloat(minFare) || 0,
          maxFare: parseFloat(maxFare) || 0,
          instructions,
        };
        break;

      case 'route_update':
        proposedData = {
          name: routeName,
          transportModes,
          estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
          distance: distance ? parseFloat(distance) : undefined,
          minFare: minFare ? parseFloat(minFare) : undefined,
          maxFare: maxFare ? parseFloat(maxFare) : undefined,
          instructions,
        };
        break;

      case 'fare_correction':
        if (!minFare || !maxFare) {
          Toast.show({ type: 'error', text1: 'Missing Fare', text2: 'Please enter the current fare range' });
          return;
        }
        proposedData = {
          minFare: parseFloat(minFare),
          maxFare: parseFloat(maxFare),
        };
        break;

      case 'new_intermediate_stop':
        if (!stopName || !segmentName) {
          Toast.show({ type: 'error', text1: 'Missing Info', text2: 'Please enter stop name and select a route segment' });
          return;
        }
        proposedData = {
          stopName,
          segmentName,
          isOptional,
          landmarks: landmarks
            .split(',')
            .map(l => l.trim())
            .filter(Boolean),
        };
        break;

      case 'instructions_update':
        if (!instructions.trim()) {
          Toast.show({ type: 'error', text1: 'Missing Instructions', text2: 'Please enter improved directions' });
          return;
        }
        proposedData = {
          instructions: instructions.trim(),
          landmarks: landmarks
            .split(',')
            .map(l => l.trim())
            .filter(Boolean),
        };
        break;
    }

    try {
      const result = await submitContribution({
        contributionType,
        description: description.trim(),
        proposedData,
      });

      if (result.success) {
        dialog.showSuccess(
          'Thank You!',
          'Your contribution has been submitted. You earned 15 reputation points! Your contribution will be reviewed by our team.',
          () => navigation.goBack(),
        );
      } else {
        dialog.showError('Error', result.error || 'Failed to submit contribution');
      }
    } catch (error) {
      dialog.showError('Error', 'An unexpected error occurred');
    }
  };

  const renderTypeSelector = () => (
    <View style={contributeStyles.section}>
      <Text style={[contributeStyles.sectionTitle, { color: colors.text }]}>
        What would you like to contribute?
      </Text>
      <View style={contributeStyles.typeGrid}>
        {contributionTypes.map(type => (
          <TouchableOpacity
            key={type.type}
            style={[
              contributeStyles.typeCard,
              {
                backgroundColor:
                  contributionType === type.type ? colors.primaryLight : colors.white,
                borderColor: contributionType === type.type ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setContributionType(type.type)}
            activeOpacity={0.7}
          >
            <Icon
              name={type.icon}
              size={32}
              color={contributionType === type.type ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                contributeStyles.typeLabel,
                { color: contributionType === type.type ? colors.primary : colors.text },
              ]}
            >
              {type.label}
            </Text>
            <Text
              style={[
                contributeStyles.typeDesc,
                { color: contributionType === type.type ? colors.primary : colors.textMuted },
              ]}
            >
              {type.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDescriptionInput = () => (
    <View style={contributeStyles.section}>
      <Text style={[contributeStyles.sectionTitle, { color: colors.text }]}>
        Description <Text style={{ color: colors.error }}>*</Text>
      </Text>
      <View
        style={[contributeStyles.inputContainer, { backgroundColor: colors.white, height: 120 }]}
      >
        <TextInput
          style={[contributeStyles.input, { color: colors.text, height: 100 }]}
          placeholder="Explain what you're suggesting and why it's helpful..."
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          maxLength={300}
        />
        <Text style={[contributeStyles.charCount, { color: colors.textMuted }]}>
          {description.length}/300
        </Text>
      </View>
    </View>
  );

  const renderRouteFields = () => {
    if (contributionType !== 'new_route' && contributionType !== 'route_update') return null;

    return (
      <>
        <View style={contributeStyles.section}>
          <Text style={[contributeStyles.sectionTitle, { color: colors.text }]}>Route Details</Text>

          {contributionType === 'new_route' && (
            <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
              <Icon name="map-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[contributeStyles.input, { color: colors.text, marginLeft: 12 }]}
                placeholder="Route name (e.g., Choba to Rumuokoro)"
                placeholderTextColor={colors.textMuted}
                value={routeName}
                onChangeText={setRouteName}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <View
              style={[contributeStyles.inputContainer, { backgroundColor: colors.white, flex: 1 }]}
            >
              <Icon name="flag-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[contributeStyles.input, { color: colors.text, marginLeft: 12 }]}
                placeholder="Start location"
                placeholderTextColor={colors.textMuted}
                value={startLocation}
                onChangeText={setStartLocation}
              />
            </View>

            <View
              style={[contributeStyles.inputContainer, { backgroundColor: colors.white, flex: 1 }]}
            >
              <Icon name="location-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={[contributeStyles.input, { color: colors.text, marginLeft: 12 }]}
                placeholder="End location"
                placeholderTextColor={colors.textMuted}
                value={endLocation}
                onChangeText={setEndLocation}
              />
            </View>
          </View>

          <Text style={[contributeStyles.label, { color: colors.text, marginTop: 16 }]}>
            Transport Modes
          </Text>
          <View style={contributeStyles.transportModes}>
            {transportOptions.map(mode => (
              <TouchableOpacity
                key={mode}
                style={[
                  contributeStyles.transportChip,
                  {
                    backgroundColor: transportModes.includes(mode)
                      ? colors.primaryLight
                      : colors.backgroundLight,
                    borderColor: transportModes.includes(mode) ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => toggleTransportMode(mode)}
              >
                <Text
                  style={[
                    contributeStyles.transportText,
                    { color: transportModes.includes(mode) ? colors.primary : colors.text },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[contributeStyles.label, { color: colors.text }]}>Duration (min)</Text>
              <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
                <TextInput
                  style={[contributeStyles.input, { color: colors.text }]}
                  placeholder="30"
                  placeholderTextColor={colors.textMuted}
                  value={estimatedDuration}
                  onChangeText={setEstimatedDuration}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[contributeStyles.label, { color: colors.text }]}>Distance (km)</Text>
              <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
                <TextInput
                  style={[contributeStyles.input, { color: colors.text }]}
                  placeholder="15.5"
                  placeholderTextColor={colors.textMuted}
                  value={distance}
                  onChangeText={setDistance}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[contributeStyles.label, { color: colors.text }]}>Min Fare (₦)</Text>
              <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
                <TextInput
                  style={[contributeStyles.input, { color: colors.text }]}
                  placeholder="300"
                  placeholderTextColor={colors.textMuted}
                  value={minFare}
                  onChangeText={setMinFare}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[contributeStyles.label, { color: colors.text }]}>Max Fare (₦)</Text>
              <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
                <TextInput
                  style={[contributeStyles.input, { color: colors.text }]}
                  placeholder="500"
                  placeholderTextColor={colors.textMuted}
                  value={maxFare}
                  onChangeText={setMaxFare}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderFareFields = () => {
    if (contributionType !== 'fare_correction') return null;

    return (
      <View style={contributeStyles.section}>
        <Text style={[contributeStyles.sectionTitle, { color: colors.text }]}>
          Current Fare Range
        </Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[contributeStyles.label, { color: colors.text }]}>
              Min Fare (₦) <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
              <TextInput
                style={[contributeStyles.input, { color: colors.text }]}
                placeholder="400"
                placeholderTextColor={colors.textMuted}
                value={minFare}
                onChangeText={setMinFare}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[contributeStyles.label, { color: colors.text }]}>
              Max Fare (₦) <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
              <TextInput
                style={[contributeStyles.input, { color: colors.text }]}
                placeholder="600"
                placeholderTextColor={colors.textMuted}
                value={maxFare}
                onChangeText={setMaxFare}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={[contributeStyles.infoCard, { backgroundColor: colors.infoLight }]}>
          <Icon name="information-circle" size={20} color={colors.info} />
          <Text style={[contributeStyles.infoText, { color: colors.textMuted }]}>
            Report the current fare you paid today. This helps keep our fares accurate!
          </Text>
        </View>
      </View>
    );
  };

  const renderIntermediateStopFields = () => {
    if (contributionType !== 'new_intermediate_stop') return null;

    return (
      <View style={contributeStyles.section}>
        <Text style={[contributeStyles.sectionTitle, { color: colors.text }]}>Stop Details</Text>

        <View style={[contributeStyles.inputContainer, { backgroundColor: colors.white }]}>
          <Icon name="location-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[contributeStyles.input, { color: colors.text, marginLeft: 12 }]}
            placeholder="Stop name (e.g., Wimpy Junction)"
            placeholderTextColor={colors.textMuted}
            value={stopName}
            onChangeText={setStopName}
          />
        </View>

        <View
          style={[
            contributeStyles.inputContainer,
            { backgroundColor: colors.white, marginTop: 12 },
          ]}
        >
          <Icon name="map-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[contributeStyles.input, { color: colors.text, marginLeft: 12 }]}
            placeholder="Which route is this on?"
            placeholderTextColor={colors.textMuted}
            value={segmentName}
            onChangeText={setSegmentName}
          />
        </View>

        <View
          style={[
            contributeStyles.inputContainer,
            { backgroundColor: colors.white, marginTop: 12 },
          ]}
        >
          <Icon name="eye-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[contributeStyles.input, { color: colors.text, marginLeft: 12 }]}
            placeholder="Landmarks (comma-separated)"
            placeholderTextColor={colors.textMuted}
            value={landmarks}
            onChangeText={setLandmarks}
          />
        </View>

        <TouchableOpacity
          style={contributeStyles.optionalToggle}
          onPress={() => setIsOptional(!isOptional)}
        >
          <Icon
            name={isOptional ? 'checkbox' : 'square-outline'}
            size={24}
            color={isOptional ? colors.primary : colors.textMuted}
          />
          <Text style={[contributeStyles.optionalText, { color: colors.text }]}>
            This is an optional stop (not all vehicles stop here)
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInstructionsFields = () => {
    if (
      contributionType !== 'instructions_update' &&
      contributionType !== 'new_route' &&
      contributionType !== 'route_update'
    )
      return null;

    return (
      <View style={contributeStyles.section}>
        <Text style={[contributeStyles.sectionTitle, { color: colors.text }]}>
          Directions{' '}
          {contributionType === 'instructions_update' && (
            <Text style={{ color: colors.error }}>*</Text>
          )}
        </Text>

        <View
          style={[contributeStyles.inputContainer, { backgroundColor: colors.white, height: 150 }]}
        >
          <TextInput
            style={[contributeStyles.input, { color: colors.text, height: 130 }]}
            placeholder="Write clear, step-by-step directions in Nigerian Pidgin or English..."
            placeholderTextColor={colors.textMuted}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View
          style={[
            contributeStyles.inputContainer,
            { backgroundColor: colors.white, marginTop: 12 },
          ]}
        >
          <Icon name="eye-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[contributeStyles.input, { color: colors.text, marginLeft: 12 }]}
            placeholder="Add landmarks (comma-separated)"
            placeholderTextColor={colors.textMuted}
            value={landmarks}
            onChangeText={setLandmarks}
          />
        </View>
      </View>
    );
  };

  const renderRewardInfo = () => (
    <View style={[contributeStyles.rewardCard, { backgroundColor: colors.successLight }]}>
      <Icon name="star" size={32} color={colors.success} />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={[contributeStyles.rewardTitle, { color: colors.text }]}>
          Earn Reputation Points!
        </Text>
        <Text style={[contributeStyles.rewardText, { color: colors.textMuted }]}>
          • Submit: +15 points{'\n'}• Approved: +25 bonus{'\n'}• Implemented: +50 bonus{'\n'}
          Total possible: 90 points!
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[contributeStyles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View
          style={[
            contributeStyles.header,
            { backgroundColor: colors.white, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[contributeStyles.headerTitle, { color: colors.text }]}>
            Contribute Route
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={contributeStyles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderRewardInfo()}
          {renderTypeSelector()}
          {renderDescriptionInput()}
          {renderRouteFields()}
          {renderFareFields()}
          {renderIntermediateStopFields()}
          {renderInstructionsFields()}

          <View style={contributeStyles.submitSection}>
            <Button
              title="Submit Contribution"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading || !description.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
