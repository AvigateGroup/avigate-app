// src/screens/profile/SettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { profileStyles, commonStyles } from '@/styles';

export const SettingsScreen = () => {
  const { themeMode, setThemeMode, isDark } = useTheme();
  const colors = useThemedColors();

  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);

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
            // Toggle between light and dark (not system)
            setThemeMode(value ? 'dark' : 'light');
          },
        },
        {
          icon: 'phone-portrait-outline',
          title: 'Use System Theme',
          subtitle: 'Follow device theme settings',
          type: 'switch',
          value: themeMode === 'system',
          onValueChange: (value: boolean) => {
            setThemeMode(value ? 'system' : isDark ? 'dark' : 'light');
          },
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'lock-closed-outline',
          title: 'Change Password',
          subtitle: 'Update your password',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Change password feature coming soon'),
        },
        {
          icon: 'shield-checkmark-outline',
          title: 'Privacy Settings',
          subtitle: 'Control your privacy',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Privacy settings coming soon'),
        },
        {
          icon: 'card-outline',
          title: 'Payment Settings',
          subtitle: 'Manage payment methods',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Payment settings coming soon'),
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
          onPress: () => Alert.alert('Coming Soon', 'Terms of service coming soon'),
        },
        {
          icon: 'shield-outline',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Privacy policy coming soon'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help Center',
          subtitle: 'Get help with your account',
          type: 'navigation',
          onPress: () => Alert.alert('Coming Soon', 'Help center coming soon'),
        },
        {
          icon: 'chatbubble-outline',
          title: 'Contact Support',
          subtitle: 'Reach out to our team',
          type: 'navigation',
          onPress: () =>
            Alert.alert('Contact Support', 'Email: support@avigate.com\nPhone: +234 800 000 0000'),
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

      {/* Delete Account */}
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
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => Alert.alert('Coming Soon', 'Account deletion coming soon'),
                },
              ],
            );
          }}
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
  );
};
