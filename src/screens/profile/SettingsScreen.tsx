// src/screens/profile/SettingsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useUserService } from '@/hooks/useUserService';
import { useAuth } from '@/store/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { profileStyles } from '@/styles';

export const SettingsScreen = () => {
  const router = useRouter();
  const { setThemeMode, isDark } = useTheme();
  const colors = useThemedColors();
  const { deleteAccount, isLoading } = useUserService();
  const { logout, user } = useAuth();

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleDeleteAccount = async () => {
    // Check if user is Google OAuth user
    if (user?.authProvider === 'google') {
      Alert.alert(
        'Delete Account',
        'Are you absolutely sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const success = await deleteAccount('');
              if (success) {
                await logout();
                router.replace('/(auth)/login');
              }
            },
          },
        ],
      );
    } else {
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    const success = await deleteAccount(deletePassword);
    if (success) {
      setShowDeleteModal(false);
      await logout();
      router.replace('/(auth)/login');
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
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings coming soon'),
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
          onPress: () => Alert.alert('Avigate', 'Version 1.0.0\n\nYour trusted ride companion'),
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
            Alert.alert('Contact Support', 'Email: hello@avigate.com\nPhone: +234 800 000 0000'),
        },
        {
          icon: 'star-outline',
          title: 'Rate Avigate',
          subtitle: 'Rate us on the app store',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'App store rating coming soon'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    if (item.type === 'switch') {
      return (
        <View key={index} style={[profileStyles.settingItem, { borderBottomColor: colors.border }]}>
          <View
            style={[
              profileStyles.settingIconContainer,
              { backgroundColor: colors.backgroundLight },
            ]}
          >
            <Icon name={item.icon} size={24} color={colors.primary} />
          </View>
          <View style={profileStyles.settingContent}>
            <Text style={[profileStyles.settingTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[profileStyles.settingSubtitle, { color: colors.textMuted }]}>
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
        style={[profileStyles.settingItem, { borderBottomColor: colors.border }]}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View
          style={[profileStyles.settingIconContainer, { backgroundColor: colors.backgroundLight }]}
        >
          <Icon name={item.icon} size={24} color={colors.primary} />
        </View>
        <View style={profileStyles.settingContent}>
          <Text style={[profileStyles.settingTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[profileStyles.settingSubtitle, { color: colors.textMuted }]}>
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
        style={[profileStyles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={profileStyles.section}>
            <Text style={[profileStyles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <View style={[profileStyles.sectionContent, { backgroundColor: colors.white }]}>
              {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View style={profileStyles.dangerZone}>
          <Text style={[profileStyles.dangerZoneTitle, { color: colors.error }]}>Danger Zone</Text>
          <TouchableOpacity
            style={[
              profileStyles.deleteButton,
              {
                backgroundColor: colors.white,
                borderColor: colors.error,
              },
            ]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Icon name="trash-outline" size={20} color={colors.error} />
            <Text style={[profileStyles.deleteButtonText, { color: colors.error }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        <View style={profileStyles.footer}>
          <Text style={[profileStyles.footerText, { color: colors.textMuted }]}>Avigate v1.0.0</Text>
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
              <Text style={[profileStyles.name, { color: colors.text, fontSize: 20 }]}>
                Delete Account
              </Text>
              <Text
                style={[
                  profileStyles.menuSubtitle,
                  { color: colors.textMuted, textAlign: 'center', marginTop: 8 },
                ]}
              >
                This action cannot be undone. All your data will be permanently deleted.
              </Text>
            </View>

            {/* Password Input */}
            <Input
              placeholder="Enter your password"
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
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