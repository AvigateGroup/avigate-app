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
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useLocationShareService } from '@/hooks/useLocationShareService';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/common/Button';
import { shareStyles } from '@/styles/features';

type ShareType = 'public' | 'private' | 'event' | 'business';

interface ShareResult {
  shareUrl: string;
  qrCodeDataUrl?: string; // NEW - QR code image
  qrCodeImageUrl?: string; // NEW - QR code S3 URL
}

export const ShareLocationScreen = () => {
  const router = useRouter();
  const colors = useThemedColors();
  const { user } = useAuth();
  const { 
    createShare, 
    getQRCode, // NEW - Get QR code
    getPrintableQRCode, // NEW - Get printable version
    isLoading 
  } = useLocationShareService();

  const [shareType, setShareType] = useState<ShareType>('public');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [eventDate, setEventDate] = useState<Date | null>(null);
  
  // NEW - QR Code state
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<ShareResult | null>(null);

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
      eventDate: isEvent ? eventDate : undefined,
    });

    if (result.success && result.data) {
      setQRCodeData(result.data);
      showShareOptions(result.data);
    } else {
      Alert.alert('Error', result.error || 'Failed to share location');
    }
  };

  // NEW - Show share options with QR code
  const showShareOptions = (shareData: ShareResult) => {
    Alert.alert(
      'Location Shared! 🎉',
      'Your location has been shared successfully.',
      [
        {
          text: 'View QR Code',
          onPress: () => setShowQRModal(true),
        },
        {
          text: 'Copy Link',
          onPress: () => {
            // Copy to clipboard
            Alert.alert('Copied!', 'Share link copied to clipboard');
          },
        },
        {
          text: 'Share',
          onPress: () => handleShareLink(shareData.shareUrl),
        },
        {
          text: 'Done',
          style: 'cancel',
          onPress: () => router.back(),
        },
      ],
    );
  };

  const handleShareLink = async (url: string) => {
    try {
      const shareMessage = isEvent
        ? ` ${locationName}\n\n${description}\n\nEvent Date: ${eventDate?.toLocaleDateString()}\n\nGet directions via Avigate:\n${url}`
        : `${locationName}\n\n${description}\n\nGet directions via Avigate:\n${url}`;

      await RNShare.share({
        message: shareMessage,
        url,
        title: 'Shared Location',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // NEW - Download QR code
  const handleDownloadQR = async () => {
    if (!qrCodeData?.shareUrl) return;

    try {
      // In real app, implement download to device
      Alert.alert('Success', 'QR code saved to your device');
    } catch (error) {
      Alert.alert('Error', 'Failed to download QR code');
    }
  };

  // NEW - Print QR code
  const handlePrintQR = async () => {
    if (!qrCodeData?.shareUrl) return;

    try {
      const printableHTML = await getPrintableQRCode(qrCodeData.shareUrl);
      // In real app, open print dialog or share PDF
      Alert.alert('Print', 'QR code prepared for printing');
    } catch (error) {
      Alert.alert('Error', 'Failed to prepare QR code for printing');
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
            <Text style={[shareStyles.modalTitle, { color: colors.text }]}>
              Share QR Code
            </Text>
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
            placeholder={isEvent ? "Event name (e.g., John's Birthday)" : "Location name"}
            placeholderTextColor={colors.textMuted}
            value={locationName}
            onChangeText={setLocationName}
          />
        </View>

        <View style={[shareStyles.inputContainer, { backgroundColor: colors.white, height: 100 }]}>
          <Icon name="document-text-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[shareStyles.input, { color: colors.text, height: 80 }]}
            placeholder={isEvent ? "Event details (optional)" : "Description (optional)"}
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
            value={isEvent ? (eventDate || new Date()) : expiryDate}
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
          <Text style={[shareStyles.infoTitle, { color: colors.text }]}>
            QR Code Included
          </Text>
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
          onPress={() => router.back()}
          variant="outline"
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <Button
          title="Generate & Share"
          onPress={handleCreateShare}
          loading={isLoading}
          disabled={isLoading}
          icon="qr-code-outline"
          style={{ flex: 1 }}
        />
      </View>

      {/* QR Code Modal */}
      {renderQRModal()}
    </ScrollView>
  );
};