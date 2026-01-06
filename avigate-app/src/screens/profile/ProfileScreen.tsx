// src/screens/profile/ProfileScreen.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useUserService } from '@/hooks/useUserService';
import { useTripService } from '@/hooks/useTripService';
import { getInitials, formatDate } from '@/utils/helpers';
import { profileFeatureStyles } from '@/styles/features';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colors = useThemedColors();
  const { pickAndUploadProfilePicture, takeCameraPhoto, isUploadingImage, uploadProgress } =
    useUserService();
  const { getTripStatistics } = useTripService();

  const [tripStats, setTripStats] = React.useState<{
    completedTrips: number;
    totalDistance: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchTripStats = async () => {
      const result = await getTripStatistics();
      if (result.success && result.data) {
        setTripStats({
          completedTrips: result.data.completedTrips || 0,
          totalDistance: result.data.totalDistance || '0',
        });
      }
    };

    fetchTripStats();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleUploadPicture = () => {
    Alert.alert('Upload Profile Picture', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: takeCameraPhoto,
      },
      {
        text: 'Choose from Gallery',
        onPress: pickAndUploadProfilePicture,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: handleEditProfile,
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and settings',
      onPress: () => router.push('/settings'),
    },
    {
      icon: 'time-outline',
      title: 'Trip History',
      subtitle: 'View your past trips',
      onPress: () => {
        Alert.alert('Coming Soon', 'Trip history feature will be available soon');
      },
    },
    {
      icon: 'phone-portrait-outline',
      title: 'My Devices',
      subtitle: 'Manage your logged-in devices',
      onPress: () => router.push('/profile/devices'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help with your account',
      onPress: () => {
        Alert.alert('Coming Soon', 'Help & support feature will be available soon');
      },
    },
  ];

  return (
    <ScrollView
      style={[profileFeatureStyles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View
        style={[profileFeatureStyles.header, { backgroundColor: colors.white, paddingTop: 60 }]}
      >
        <View style={profileFeatureStyles.avatarContainer}>
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={profileFeatureStyles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[profileFeatureStyles.avatarPlaceholder, { backgroundColor: colors.primary }]}
            >
              <Text style={profileFeatureStyles.avatarText}>
                {getInitials(user?.firstName || '', user?.lastName || '')}
              </Text>
            </View>
          )}

          {/* Upload Progress Overlay */}
          {isUploadingImage && (
            <View style={[styles.uploadOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={[styles.uploadText, { color: colors.white }]}>{uploadProgress}%</Text>
            </View>
          )}

          <TouchableOpacity
            style={[profileFeatureStyles.cameraButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={handleUploadPicture}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <ActivityIndicator size="small" color={colors.textWhite} />
            ) : (
              <Icon name="camera" size={16} color={colors.textWhite} />
            )}
          </TouchableOpacity>
        </View>

        <Text style={[profileFeatureStyles.name, { color: colors.text, marginTop: 0 }]}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={[profileFeatureStyles.email, { color: colors.textMuted }]}>{user?.email}</Text>

        {user?.phoneNumber && (
          <View style={profileFeatureStyles.phoneContainer}>
            <Icon name="call-outline" size={16} color={colors.textMuted} />
            <Text style={[profileFeatureStyles.phone, { color: colors.textMuted }]}>
              {user.phoneNumber}
            </Text>
          </View>
        )}

        {/* Stats */}
        <View style={[profileFeatureStyles.statsContainer, { borderTopColor: colors.border }]}>
          <View style={profileFeatureStyles.statItem}>
            <Text style={[profileFeatureStyles.statValue, { color: colors.text }]}>
              {user?.reputationScore || 100}
            </Text>
            <Text style={[profileFeatureStyles.statLabel, { color: colors.textMuted }]}>
              Reputation
            </Text>
          </View>
          <View style={[profileFeatureStyles.statDivider, { backgroundColor: colors.border }]} />
          <View style={profileFeatureStyles.statItem}>
            <Text style={[profileFeatureStyles.statValue, { color: colors.text }]}>
              {tripStats?.completedTrips ?? 0}
            </Text>
            <Text style={[profileFeatureStyles.statLabel, { color: colors.textMuted }]}>
              Trips
            </Text>
          </View>
          <View style={[profileFeatureStyles.statDivider, { backgroundColor: colors.border }]} />
          <View style={profileFeatureStyles.statItem}>
            <Text style={[profileFeatureStyles.statValue, { color: colors.text }]}>
              {user?.totalContributions || 0}
            </Text>
            <Text style={[profileFeatureStyles.statLabel, { color: colors.textMuted }]}>
              Contributions
            </Text>
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View style={profileFeatureStyles.section}>
        <Text style={[profileFeatureStyles.sectionTitle, { color: colors.text }]}>
          Account Information
        </Text>
        <View style={[profileFeatureStyles.infoCard, { backgroundColor: colors.white }]}>
          <View style={profileFeatureStyles.infoRow}>
            <Text style={[profileFeatureStyles.infoLabel, { color: colors.textMuted }]}>
              Member Since
            </Text>
            <Text style={[profileFeatureStyles.infoValue, { color: colors.text }]}>
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </Text>
          </View>
          <View style={[profileFeatureStyles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={profileFeatureStyles.infoRow}>
            <Text style={[profileFeatureStyles.infoLabel, { color: colors.textMuted }]}>
              Account Status
            </Text>
            <View style={profileFeatureStyles.statusBadge}>
              <Icon name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[profileFeatureStyles.statusText, { color: colors.success }]}>
                {user?.isVerified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          </View>
          <View style={[profileFeatureStyles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={profileFeatureStyles.infoRow}>
            <Text style={[profileFeatureStyles.infoLabel, { color: colors.textMuted }]}>
              Country
            </Text>
            <Text style={[profileFeatureStyles.infoValue, { color: colors.text }]}>
              {user?.country || 'Nigeria'}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={profileFeatureStyles.section}>
        <Text style={[profileFeatureStyles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[profileFeatureStyles.menuItem, { backgroundColor: colors.white }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                profileFeatureStyles.menuIconContainer,
                { backgroundColor: colors.backgroundLight },
              ]}
            >
              <Icon name={item.icon} size={24} color={colors.primary} />
            </View>
            <View style={profileFeatureStyles.menuContent}>
              <Text style={[profileFeatureStyles.menuTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={[profileFeatureStyles.menuSubtitle, { color: colors.textMuted }]}>
                {item.subtitle}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[
          profileFeatureStyles.logoutButton,
          {
            backgroundColor: colors.white,
            borderColor: colors.error,
          },
        ]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon name="log-out-outline" size={20} color={colors.error} />
        <Text style={[profileFeatureStyles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>

      <View style={profileFeatureStyles.footer}>
        <Text style={[profileFeatureStyles.footerText, { color: colors.textMuted }]}>
          Avigate v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
