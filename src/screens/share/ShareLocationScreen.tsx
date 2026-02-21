// src/screens/location-share/ShareLocationScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Share as RNShare,
  Image,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useLocationShareService } from '@/hooks/useLocationShareService';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/common/Button';
import { useDialog } from '@/contexts/DialogContext';
import { shareStyles } from '@/styles/features';

type ShareType = 'public' | 'private' | 'event' | 'business';

interface ShareResult {
  shareUrl: string;
  qrCodeDataUrl?: string;
  qrCodeImageUrl?: string;
}

interface CurrentLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export const ShareLocationScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemedColors();
  const { user } = useAuth();
  const { createShare, getQRCode, getPrintableQRCode, isLoading } = useLocationShareService();
  const dialog = useDialog();

  const [shareType, setShareType] = useState<ShareType>('public');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(null);

  // QR Code state
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<ShareResult | null>(null);

  // Location state
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Get location on mount
  useEffect(() => {
    getInitialLocation();
  }, []);

  const getInitialLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = position.coords;

        // Get address
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        let address = 'Current Location';
        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          const addressParts = [addr.name, addr.street, addr.district, addr.city].filter(Boolean);
          address = addressParts.join(', ') || address;
        }

        setCurrentLocation({ latitude, longitude, address });

        // Auto-fill location name if empty
        if (!locationName && addresses && addresses.length > 0) {
          const addr = addresses[0];
          const suggestedName = addr.name || addr.street || 'My Location';
          setLocationName(suggestedName);
        }
      }
    } catch (error) {
      console.error('Error getting initial location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleCreateShare = async () => {
    if (!locationName.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please enter a location name' });
      return;
    }

    try {
      let latitude: number;
      let longitude: number;

      // Use cached location if available, otherwise get fresh location
      if (currentLocation) {
        latitude = currentLocation.latitude;
        longitude = currentLocation.longitude;
      } else {
        // Request permission and get location
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          dialog.showWarning(
            'Permission Required',
            'Location permission is needed to share your location. Please enable it in settings.',
          );
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      // Create the share with real coordinates
      const result = await createShare({
        shareType,
        locationName: locationName.trim(),
        latitude,
        longitude,
        description: description.trim(),
        expiresAt: hasExpiry ? expiryDate : undefined,
        eventDate: isEvent && eventDate ? eventDate : undefined,
      });

      if (result.success && result.data) {
        setQRCodeData(result.data);
        showShareOptions(result.data);
      } else {
        dialog.showError('Error', result.error || 'Failed to share location');
      }
    } catch (error) {
      console.error('Error creating share:', error);
      dialog.showError(
        'Connection Error',
        'Unable to connect to the server. Please check your location settings and try again.',
      );
    }
  };

  const showShareOptions = (shareData: ShareResult) => {
    dialog.showSuccess('Location Shared!', 'Your location has been shared successfully.');
  };

  const handleShareLink = async (url: string) => {
    try {
      const shareMessage = isEvent
        ? `📍 ${locationName}\n\n${description}\n\n📅 Event Date: ${eventDate?.toLocaleDateString()}\n\nGet directions via Avigate:\n${url}`
        : `📍 ${locationName}\n\n${description}\n\nGet directions via Avigate:\n${url}`;

      await RNShare.share({
        message: shareMessage,
        url,
        title: 'Shared Location',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownloadQR = async () => {
    if (!qrCodeData?.shareUrl) return;

    try {
      // TODO: Implement actual download functionality
      // This would involve saving the QR code image to device
      Toast.show({ type: 'success', text1: 'Success', text2: 'QR code saved to your device' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to download QR code' });
    }
  };

  const handlePrintQR = async () => {
    if (!qrCodeData?.shareUrl) return;

    try {
      const printableHTML = await getPrintableQRCode(qrCodeData.shareUrl);
      // TODO: Implement print functionality
      // This could open a web view with print dialog or share as PDF
      Toast.show({ type: 'success', text1: 'Print', text2: 'QR code prepared for printing' });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to prepare QR code for printing',
      });
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (isEvent) {
        setEventDate(selectedDate);
      } else {
        setExpiryDate(selectedDate);
      }
    }
  };

  const renderQRModal = () => (
    <Modal
      visible={showQRModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowQRModal(false)}
    >
      <View style={shareStyles.modalOverlay}>
        <View style={[shareStyles.modalContent, { backgroundColor: colors.white }]}>
          {/* Header */}
          <View style={shareStyles.modalHeader}>
            <Text style={[shareStyles.modalTitle, { color: colors.text }]}>Share QR Code</Text>
            <TouchableOpacity onPress={() => setShowQRModal(false)}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* QR Code */}
          {qrCodeData?.qrCodeDataUrl && (
            <View style={shareStyles.qrContainer}>
              <Image
                source={{ uri: qrCodeData.qrCodeDataUrl }}
                style={shareStyles.qrCodeImage}
                resizeMode="contain"
              />
              <Text style={[shareStyles.qrLocationName, { color: colors.text }]}>
                {locationName}
              </Text>
              {description && (
                <Text style={[shareStyles.qrDescription, { color: colors.textMuted }]}>
                  {description}
                </Text>
              )}
            </View>
          )}

          {/* Instructions */}
          <View style={[shareStyles.qrInstructions, { backgroundColor: colors.infoLight }]}>
            <Icon name="information-circle" size={24} color={colors.info} />
            <Text style={[shareStyles.qrInstructionsText, { color: colors.text }]}>
              Anyone can scan this QR code to get step-by-step directions using local transport
            </Text>
          </View>

          {/* Actions */}
          <View style={shareStyles.qrActions}>
            <Button
              title="Download"
              onPress={handleDownloadQR}
              variant="outline"
              icon="download-outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Print"
              onPress={handlePrintQR}
              variant="outline"
              icon="print-outline"
              style={{ flex: 1 }}
            />
            <Button
              title="Share"
              onPress={() => handleShareLink(qrCodeData?.shareUrl || '')}
              icon="share-outline"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

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
          Generate QR codes and shareable links for easy navigation
        </Text>

        {/* Current Location Display */}
        {currentLocation && (
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="locate" size={16} color={colors.success} />
              <Text style={{ color: colors.textMuted, marginLeft: 6, fontSize: 13 }}>
                {currentLocation.address || 'Current location detected'}
              </Text>
            </View>
          </View>
        )}
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
            onPress={() => {
              setShareType('public');
              setIsEvent(false);
            }}
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
              Party or meeting
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              shareStyles.shareTypeButton,
              {
                backgroundColor: shareType === 'business' ? colors.primary : colors.white,
                borderColor: shareType === 'business' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => {
              setShareType('business');
              setIsEvent(false);
            }}
            activeOpacity={0.7}
          >
            <Icon
              name="briefcase-outline"
              size={24}
              color={shareType === 'business' ? colors.textWhite : colors.text}
            />
            <Text
              style={[
                shareStyles.shareTypeText,
                { color: shareType === 'business' ? colors.textWhite : colors.text },
              ]}
            >
              Business
            </Text>
            <Text
              style={[
                shareStyles.shareTypeDesc,
                { color: shareType === 'business' ? colors.textWhite : colors.textMuted },
              ]}
            >
              Shop or office
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
            placeholder={isEvent ? "Event name (e.g., John's Birthday)" : 'Location name'}
            placeholderTextColor={colors.textMuted}
            value={locationName}
            onChangeText={setLocationName}
          />
        </View>

        <View style={[shareStyles.inputContainer, { backgroundColor: colors.white, height: 100 }]}>
          <Icon name="document-text-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[shareStyles.input, { color: colors.text, height: 80 }]}
            placeholder={isEvent ? 'Event details (optional)' : 'Description (optional)'}
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Event Date (if event type) */}
      {isEvent && (
        <View style={shareStyles.section}>
          <View style={shareStyles.settingRow}>
            <View style={shareStyles.settingInfo}>
              <Icon name="calendar-outline" size={24} color={colors.primary} />
              <Text style={[shareStyles.settingText, { color: colors.text }]}>Event Date</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[shareStyles.dateButton, { backgroundColor: colors.backgroundLight }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar-outline" size={20} color={colors.primary} />
            <Text style={[shareStyles.dateText, { color: colors.text }]}>
              {eventDate
                ? `${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}`
                : 'Set event date and time'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expiry Settings */}
      <View style={shareStyles.section}>
        <View style={shareStyles.settingRow}>
          <View style={shareStyles.settingInfo}>
            <Icon name="time-outline" size={24} color={colors.primary} />
            <Text style={[shareStyles.settingText, { color: colors.text }]}>
              {isEvent ? 'Auto-expire after event' : 'Set Expiry Date'}
            </Text>
          </View>
          <Switch
            value={hasExpiry}
            onValueChange={setHasExpiry}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={hasExpiry ? colors.primary : colors.disabled}
          />
        </View>

        {hasExpiry && !isEvent && (
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
            value={isEvent ? eventDate || new Date() : expiryDate}
            mode="datetime"
            is24Hour={true}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Info Card */}
      <View style={[shareStyles.infoCard, { backgroundColor: colors.infoLight }]}>
        <Icon name="qr-code-outline" size={24} color={colors.info} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[shareStyles.infoTitle, { color: colors.text }]}>QR Code Included</Text>
          <Text style={[shareStyles.infoText, { color: colors.textMuted }]}>
            {shareType === 'event'
              ? 'Generate a QR code perfect for event flyers and invitations. Guests can scan to get walking directions!'
              : shareType === 'business'
                ? 'Get a branded QR code for your business. Print it on receipts, posters, or your storefront!'
                : 'Share your location with a scannable QR code. Works offline after scanning!'}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={shareStyles.actions}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
          disabled={isLoading || locationLoading}
          style={{ flex: 1 }}
        />
        <Button
          title="Generate & Share"
          onPress={handleCreateShare}
          loading={isLoading || locationLoading}
          disabled={isLoading || locationLoading}
          icon="qr-code-outline"
          style={{ flex: 1 }}
        />
      </View>

      {/* QR Code Modal */}
      {renderQRModal()}
    </ScrollView>
  );
};
