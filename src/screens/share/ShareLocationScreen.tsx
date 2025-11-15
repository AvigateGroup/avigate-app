// src/screens/location-share/ShareLocationScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  Share as RNShare,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useLocationShareService } from '@/hooks/useLocationShareService';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/common/Button';
import { shareStyles } from '@/styles/features';

type ShareType = 'public' | 'private' | 'event';

export const ShareLocationScreen = () => {
  const router = useRouter();
  const colors = useThemedColors();
  const { user } = useAuth();
  const { createShare, isLoading } = useLocationShareService();

  const [shareType, setShareType] = useState<ShareType>('public');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEvent, setIsEvent] = useState(false);

  const handleCreateShare = async () => {
  if (!locationName.trim()) {
    Alert.alert('Error', 'Please enter a location name');
    return;
  }

  // In real app, you'd get current location here
  const result = await createShare({
    shareType,
    locationName: locationName.trim(),
    latitude: 4.815554, // Example coordinates
    longitude: 7.0498,
    description: description.trim(),
    expiresAt: hasExpiry ? expiryDate : undefined,
  });

  if (result.success && result.data) {
    const shareUrl = result.data.shareUrl;

    Alert.alert('Location Shared!', 'Your location has been shared successfully.', [
      {
        text: 'Copy Link',
        onPress: () => {
          // Copy to clipboard
          Alert.alert('Copied!', 'Share link copied to clipboard');
        },
      },
      {
        text: 'Share',
        onPress: () => handleShareLink(shareUrl),
      },
      {
        text: 'Done',
        style: 'cancel',
        onPress: () => router.back(),
      },
    ]);
  } else {
    Alert.alert('Error', result.error || 'Failed to share location');
  }
};

  const handleShareLink = async (url: string) => {
    try {
      await RNShare.share({
        message: `${locationName}\n\nI'm sharing my location with you via Avigate:\n${url}`,
        url,
        title: 'Shared Location',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  return (
    <ScrollView
      style={[shareStyles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[shareStyles.header, { backgroundColor: colors.white }]}>
        <Icon name="location" size={48} color={colors.primary} />
        <Text style={[shareStyles.headerTitle, { color: colors.text }]}>Share Your Location</Text>
        <Text style={[shareStyles.headerSubtitle, { color: colors.textMuted }]}>
          Let others navigate to you using local transportation
        </Text>
      </View>

      {/* Share Type Selection */}
      <View style={shareStyles.section}>
        <Text style={[shareStyles.sectionTitle, { color: colors.text }]}>Share Type</Text>
        <View style={shareStyles.shareTypeContainer}>
          <TouchableOpacity
            style={[
              shareStyles.shareTypeButton,
              {
                backgroundColor: shareType === 'public' ? colors.primary : colors.white,
                borderColor: shareType === 'public' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setShareType('public')}
            activeOpacity={0.7}
          >
            <Icon
              name="globe-outline"
              size={24}
              color={shareType === 'public' ? colors.textWhite : colors.text}
            />
            <Text
              style={[
                shareStyles.shareTypeText,
                { color: shareType === 'public' ? colors.textWhite : colors.text },
              ]}
            >
              Public
            </Text>
            <Text
              style={[
                shareStyles.shareTypeDesc,
                { color: shareType === 'public' ? colors.textWhite : colors.textMuted },
              ]}
            >
              Anyone with link
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              shareStyles.shareTypeButton,
              {
                backgroundColor: shareType === 'private' ? colors.primary : colors.white,
                borderColor: shareType === 'private' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setShareType('private')}
            activeOpacity={0.7}
          >
            <Icon
              name="lock-closed-outline"
              size={24}
              color={shareType === 'private' ? colors.textWhite : colors.text}
            />
            <Text
              style={[
                shareStyles.shareTypeText,
                { color: shareType === 'private' ? colors.textWhite : colors.text },
              ]}
            >
              Private
            </Text>
            <Text
              style={[
                shareStyles.shareTypeDesc,
                { color: shareType === 'private' ? colors.textWhite : colors.textMuted },
              ]}
            >
              Selected people
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              shareStyles.shareTypeButton,
              {
                backgroundColor: shareType === 'event' ? colors.primary : colors.white,
                borderColor: shareType === 'event' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => {
              setShareType('event');
              setIsEvent(true);
            }}
            activeOpacity={0.7}
          >
            <Icon
              name="calendar-outline"
              size={24}
              color={shareType === 'event' ? colors.textWhite : colors.text}
            />
            <Text
              style={[
                shareStyles.shareTypeText,
                { color: shareType === 'event' ? colors.textWhite : colors.text },
              ]}
            >
              Event
            </Text>
            <Text
              style={[
                shareStyles.shareTypeDesc,
                { color: shareType === 'event' ? colors.textWhite : colors.textMuted },
              ]}
            >
              Public event
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Details */}
      <View style={shareStyles.section}>
        <Text style={[shareStyles.sectionTitle, { color: colors.text }]}>Location Details</Text>

        <View style={[shareStyles.inputContainer, { backgroundColor: colors.white }]}>
          <Icon name="location-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[shareStyles.input, { color: colors.text }]}
            placeholder="Location name (e.g., My Birthday Party)"
            placeholderTextColor={colors.textMuted}
            value={locationName}
            onChangeText={setLocationName}
          />
        </View>

        <View style={[shareStyles.inputContainer, { backgroundColor: colors.white, height: 100 }]}>
          <Icon name="document-text-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[shareStyles.input, { color: colors.text, height: 80 }]}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Expiry Settings */}
      <View style={shareStyles.section}>
        <View style={shareStyles.settingRow}>
          <View style={shareStyles.settingInfo}>
            <Icon name="time-outline" size={24} color={colors.primary} />
            <Text style={[shareStyles.settingText, { color: colors.text }]}>Set Expiry Date</Text>
          </View>
          <Switch
            value={hasExpiry}
            onValueChange={setHasExpiry}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={hasExpiry ? colors.primary : colors.disabled}
          />
        </View>

        {hasExpiry && (
          <TouchableOpacity
            style={[shareStyles.dateButton, { backgroundColor: colors.backgroundLight }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar-outline" size={20} color={colors.primary} />
            <Text style={[shareStyles.dateText, { color: colors.text }]}>
              {expiryDate.toLocaleDateString()} {expiryDate.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={expiryDate}
            mode="datetime"
            is24Hour={true}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Info Card */}
      <View style={[shareStyles.infoCard, { backgroundColor: colors.infoLight }]}>
        <Icon name="information-circle" size={24} color={colors.info} />
        <Text style={[shareStyles.infoText, { color: colors.text }]}>
          {shareType === 'public'
            ? 'Anyone with the link will be able to get directions to your location using local transport.'
            : shareType === 'private'
              ? 'Only people you select will be able to access the shared location.'
              : 'Your event location will be visible to anyone with the link. Perfect for parties, meetups, and gatherings!'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={shareStyles.actions}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <Button
          title="Share Location"
          onPress={handleCreateShare}
          loading={isLoading}
          disabled={isLoading}
          style={{ flex: 1 }}
        />
      </View>
    </ScrollView>
  );
};
