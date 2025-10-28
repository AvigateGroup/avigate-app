// src/screens/profile/SettingsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';

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
          onPress: () => Alert.alert('Contact Support', 'Email: support@avigate.com\nPhone: +234 800 000 0000'),
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
        <View key={index} style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Icon name={item.icon} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
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
        style={styles.settingItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingIconContainer}>
          <Icon name={item.icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
          </View>
        </View>
      ))}

      {/* Delete Account */}
      <View style={styles.dangerZone}>
        <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
        <TouchableOpacity
          style={styles.deleteButton}
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
              ]
            );
          }}
          activeOpacity={0.7}
        >
          <Icon name="trash-outline" size={20} color={COLORS.error} />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ by Avigate Team
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  dangerZone: {
    marginTop: 32,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textWhite,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});