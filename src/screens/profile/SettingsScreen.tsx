// src/screens/profile/SettingsScreen.tsx

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';
import { profileStyles, commonStyles } from '@/styles';

export const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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
          subtitle: 'Use dark theme',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
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
        <View key={index} style={profileStyles.settingItem}>
          <View style={profileStyles.settingIconContainer}>
            <Icon name={item.icon} size={24} color={COLORS.primary} />
          </View>
          <View style={profileStyles.settingContent}>
            <Text style={profileStyles.settingTitle}>{item.title}</Text>
            <Text style={profileStyles.settingSubtitle}>{item.subtitle}</Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onValueChange}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
            thumbColor={item.value ? COLORS.primary : COLORS.disabled}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={profileStyles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={profileStyles.settingIconContainer}>
          <Icon name={item.icon} size={24} color={COLORS.primary} />
        </View>
        <View style={profileStyles.settingContent}>
          <Text style={profileStyles.settingTitle}>{item.title}</Text>
          <Text style={profileStyles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={profileStyles.container} showsVerticalScrollIndicator={false}>
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>{section.title}</Text>
          <View style={profileStyles.sectionContent}>
            {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
          </View>
        </View>
      ))}

      {/* Delete Account */}
      <View style={profileStyles.dangerZone}>
        <Text style={profileStyles.dangerZoneTitle}>Danger Zone</Text>
        <TouchableOpacity
          style={profileStyles.deleteButton}
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
          <Icon name="trash-outline" size={20} color={COLORS.error} />
          <Text style={profileStyles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={profileStyles.footer}>
        <Text style={profileStyles.footerText}>Made with ❤️ by Avigate Team</Text>
      </View>
    </ScrollView>
  );
};
