// src/screens/profile/DevicesScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useUserService } from '@/hooks/useUserService';
import { profileFeatureStyles } from '@/styles/features';
import { getRelativeTime } from '@/utils/helpers';

interface UserDevice {
  id: string;
  deviceInfo: string;
  deviceType: string;
  platform: string;
  lastActiveAt: string;
  isActive: boolean;
  appVersion?: string;
  ipAddress?: string;
}

export const DevicesScreen: React.FC = () => {
  const colors = useThemedColors();
  const { getUserDevices, deactivateDevice, isLoading } = useUserService();
  const [devices, setDevices] = useState<UserDevice[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const deviceList = await getUserDevices();
    setDevices(deviceList);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  };

  const handleDeactivateDevice = (device: UserDevice) => {
    Alert.alert(
      'Deactivate Device',
      `Are you sure you want to deactivate this device?\n\n${device.deviceInfo}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            const success = await deactivateDevice(device.id);
            if (success) {
              await loadDevices();
            }
          },
        },
      ],
    );
  };

  const getDeviceIcon = (platform: string, deviceType: string) => {
    if (platform.toLowerCase() === 'ios') return 'logo-apple';
    if (platform.toLowerCase() === 'android') return 'logo-android';
    if (deviceType.toLowerCase() === 'desktop') return 'desktop-outline';
    if (deviceType.toLowerCase() === 'tablet') return 'tablet-portrait-outline';
    return 'phone-portrait-outline';
  };

  if (isLoading && devices.length === 0) {
    return (
      <View
        style={[
          profileFeatureStyles.container,
          { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[profileFeatureStyles.footerText, { color: colors.textMuted, marginTop: 16 }]}>
          Loading devices...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[profileFeatureStyles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      <View style={profileFeatureStyles.section}>
        <Text style={[profileFeatureStyles.sectionTitle, { color: colors.text }]}>
          Your Devices
        </Text>
        <Text
          style={[profileFeatureStyles.menuSubtitle, { color: colors.textMuted, marginBottom: 12 }]}
        >
          Manage devices that have access to your account
        </Text>

        {devices.length === 0 ? (
          <View
            style={[
              profileFeatureStyles.infoCard,
              {
                backgroundColor: colors.white,
                paddingVertical: 32,
                alignItems: 'center',
              },
            ]}
          >
            <Icon name="phone-portrait-outline" size={48} color={colors.textMuted} />
            <Text
              style={[profileFeatureStyles.menuTitle, { color: colors.textMuted, marginTop: 12 }]}
            >
              No devices found
            </Text>
          </View>
        ) : (
          devices.map((device, index) => (
            <View
              key={device.id}
              style={[
                profileFeatureStyles.menuItem,
                {
                  backgroundColor: colors.white,
                  marginBottom: 8,
                  opacity: device.isActive ? 1 : 0.6,
                },
              ]}
            >
              <View
                style={[
                  profileFeatureStyles.menuIconContainer,
                  { backgroundColor: colors.backgroundLight },
                ]}
              >
                <Icon
                  name={getDeviceIcon(device.platform, device.deviceType)}
                  size={24}
                  color={device.isActive ? colors.primary : colors.textMuted}
                />
              </View>

              <View style={profileFeatureStyles.menuContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[profileFeatureStyles.menuTitle, { color: colors.text }]}>
                    {device.deviceInfo || 'Unknown Device'}
                  </Text>
                  {!device.isActive && (
                    <View
                      style={{
                        backgroundColor: colors.errorLight,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ color: colors.error, fontSize: 10, fontWeight: '600' }}>
                        Inactive
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={[profileFeatureStyles.menuSubtitle, { color: colors.textMuted }]}>
                  {device.platform} • {device.deviceType}
                </Text>

                <Text
                  style={[
                    profileFeatureStyles.menuSubtitle,
                    { color: colors.textMuted, fontSize: 11, marginTop: 2 },
                  ]}
                >
                  Last active: {getRelativeTime(device.lastActiveAt)}
                </Text>

                {device.appVersion && (
                  <Text
                    style={[
                      profileFeatureStyles.menuSubtitle,
                      { color: colors.textMuted, fontSize: 11 },
                    ]}
                  >
                    Version: {device.appVersion}
                  </Text>
                )}
              </View>

              {device.isActive && (
                <TouchableOpacity
                  onPress={() => handleDeactivateDevice(device)}
                  style={{ padding: 8 }}
                >
                  <Icon name="close-circle-outline" size={24} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>

      <View style={[profileFeatureStyles.section, { marginTop: 8 }]}>
        <View
          style={[
            profileFeatureStyles.infoCard,
            { backgroundColor: colors.infoLight, borderLeftWidth: 4, borderLeftColor: colors.info },
          ]}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Icon name="information-circle" size={20} color={colors.info} />
            <View style={{ flex: 1 }}>
              <Text
                style={[profileFeatureStyles.menuTitle, { color: colors.info, marginBottom: 4 }]}
              >
                About Device Management
              </Text>
              <Text style={[profileFeatureStyles.menuSubtitle, { color: colors.info }]}>
                Deactivating a device will log it out and prevent it from accessing your account
                until you log in again on that device.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={profileFeatureStyles.footer}>
        <Text style={[profileFeatureStyles.footerText, { color: colors.textMuted }]}>
          {devices.filter(d => d.isActive).length} active device(s)
        </Text>
      </View>
    </ScrollView>
  );
};
