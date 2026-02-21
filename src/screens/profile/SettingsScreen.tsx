// src/screens/profile/SettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useDialog } from '@/contexts/DialogContext';
import { useUserService } from '@/hooks/useUserService';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/common/Button';
import { profileFeatureStyles } from '@/styles/features';

export const SettingsScreen = () => {
  const router = useRouter();
  const { setThemeMode, isDark } = useTheme();
  const colors = useThemedColors();
  const { deleteAccount, isLoading } = useUserService();
  const { logout, user } = useAuth();

  const dialog = useDialog();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    dialog.showDestructive(
      'Delete Account',
      'Are you absolutely sure you want to delete your account? This action cannot be undone.',
      () => setShowDeleteModal(true),
      'Delete',
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      const success = await deleteAccount();
      if (success) {
        setShowDeleteModal(false);
        await logout();
        // Note: Navigation to login will be handled automatically by AuthContext
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to delete account. Please try again.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again.',
      });
    }
  };

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Push Notifications',
          subtitle: 'Receive trip and account updates',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'location-outline',
          title: 'Location Sharing',
          subtitle: 'Share your location during trips',
          type: 'switch',
          value: locationSharing,
          onValueChange: setLocationSharing,
        },
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          subtitle: isDark ? 'Dark theme enabled' : 'Light theme enabled',
          type: 'switch',
          value: isDark,
          onValueChange: (value: boolean) => {
            setThemeMode(value ? 'dark' : 'light');
          },
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'shield-checkmark-outline',
          title: 'Privacy Settings',
          subtitle: 'Control your privacy',
          type: 'navigation',
          onPress: () =>
            Toast.show({
              type: 'info',
              text1: 'Coming Soon',
              text2: 'Privacy settings coming soon',
            }),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          title: 'About Avigate',
          subtitle: 'Version 1.0.0',
          type: 'navigation',
          onPress: () =>
            Toast.show({
              type: 'info',
              text1: 'Avigate v1.0.0',
              text2: 'Your trusted ride companion',
            }),
        },
        {
          icon: 'document-text-outline',
          title: 'Terms of Service',
          subtitle: 'Read our terms',
          type: 'navigation',
          onPress: () => router.push('/terms'),
        },
        {
          icon: 'shield-outline',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'navigation',
          onPress: () => router.push('/privacy'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'chatbubble-outline',
          title: 'Contact Support',
          subtitle: 'Reach out to our team',
          type: 'navigation',
          onPress: () =>
            dialog.showDialog({
              type: 'info',
              title: 'Contact Support',
              message: 'Email: hello@avigate.com\nPhone: +234 800 000 0000',
              buttons: [{ text: 'OK', style: 'primary' }],
            }),
        },
        {
          icon: 'star-outline',
          title: 'Rate Avigate',
          subtitle: 'Rate us on the app store',
          type: 'navigation',
          onPress: () =>
            Toast.show({
              type: 'info',
              text1: 'Coming Soon',
              text2: 'App store rating coming soon',
            }),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    if (item.type === 'switch') {
      return (
        <View
          key={index}
          style={[profileFeatureStyles.settingItem, { borderBottomColor: colors.border }]}
        >
          <View
            style={[
              profileFeatureStyles.settingIconContainer,
              { backgroundColor: colors.backgroundLight },
            ]}
          >
            <Icon name={item.icon} size={24} color={colors.primary} />
          </View>
          <View style={profileFeatureStyles.settingContent}>
            <Text style={[profileFeatureStyles.settingTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[profileFeatureStyles.settingSubtitle, { color: colors.textMuted }]}>
              {item.subtitle}
            </Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={item.value ? colors.primary : colors.disabled}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={[profileFeatureStyles.settingItem, { borderBottomColor: colors.border }]}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View
          style={[
            profileFeatureStyles.settingIconContainer,
            { backgroundColor: colors.backgroundLight },
          ]}
        >
          <Icon name={item.icon} size={24} color={colors.primary} />
        </View>
        <View style={profileFeatureStyles.settingContent}>
          <Text style={[profileFeatureStyles.settingTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[profileFeatureStyles.settingSubtitle, { color: colors.textMuted }]}>
            {item.subtitle}
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScrollView
        style={[profileFeatureStyles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={profileFeatureStyles.section}>
            <Text style={[profileFeatureStyles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={[profileFeatureStyles.sectionContent, { backgroundColor: colors.white }]}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View style={profileFeatureStyles.dangerZone}>
          <Text style={[profileFeatureStyles.dangerZoneTitle, { color: colors.error }]}>
            Danger Zone
          </Text>
          <TouchableOpacity
            style={[
              profileFeatureStyles.deleteButton,
              {
                backgroundColor: colors.white,
                borderColor: colors.error,
              },
            ]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Icon name="trash-outline" size={20} color={colors.error} />
            <Text style={[profileFeatureStyles.deleteButtonText, { color: colors.error }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        <View style={profileFeatureStyles.footer}>
          <Text style={[profileFeatureStyles.footerText, { color: colors.textMuted }]}>
            Avigate v1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.errorLight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Icon name="warning" size={32} color={colors.error} />
              </View>
              <Text style={[profileFeatureStyles.name, { color: colors.text, fontSize: 20 }]}>
                Delete Account
              </Text>
              <Text
                style={[
                  profileFeatureStyles.menuSubtitle,
                  { color: colors.textMuted, textAlign: 'center', marginTop: 8 },
                ]}
              >
                This action cannot be undone. All your data will be permanently deleted.
              </Text>
            </View>

            {/* Confirmation Text */}
            <Text
              style={[
                profileFeatureStyles.menuSubtitle,
                { color: colors.text, textAlign: 'center', marginBottom: 20 },
              ]}
            >
              Type <Text style={{ fontWeight: 'bold' }}>DELETE_MY_ACCOUNT</Text> to confirm
            </Text>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <Button
                title="Cancel"
                onPress={() => setShowDeleteModal(false)}
                variant="outline"
                disabled={isLoading}
                style={{ flex: 1 }}
              />

              <Button
                title="Delete"
                onPress={confirmDeleteAccount}
                loading={isLoading}
                disabled={isLoading}
                style={{ flex: 1, backgroundColor: colors.error }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
