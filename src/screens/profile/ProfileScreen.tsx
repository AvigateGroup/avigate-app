// src/screens/profile/ProfileScreen.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { getInitials, formatDate } from '@/utils/helpers';
import { profileStyles } from '@/styles';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

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

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => {
        Alert.alert('Coming Soon', 'Edit profile feature will be available soon');
      },
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and settings',
      onPress: () => router.push('/settings'),
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => {
        Alert.alert('Coming Soon', 'Payment methods feature will be available soon');
      },
    },
    {
      icon: 'time-outline',
      title: 'Ride History',
      subtitle: 'View your past trips',
      onPress: () => {
        Alert.alert('Coming Soon', 'Ride history feature will be available soon');
      },
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
    <ScrollView style={profileStyles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={profileStyles.header}>
        <View style={profileStyles.avatarContainer}>
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={profileStyles.avatar} />
          ) : (
            <View style={profileStyles.avatarPlaceholder}>
              <Text style={profileStyles.avatarText}>
                {getInitials(user?.firstName || '', user?.lastName || '')}
              </Text>
            </View>
          )}
          <TouchableOpacity style={profileStyles.cameraButton} activeOpacity={0.7}>
            <Icon name="camera" size={16} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        <Text style={profileStyles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={profileStyles.email}>{user?.email}</Text>

        {user?.phoneNumber && (
          <View style={profileStyles.phoneContainer}>
            <Icon name="call-outline" size={16} color={COLORS.textMuted} />
            <Text style={profileStyles.phone}>{user.phoneNumber}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={profileStyles.statsContainer}>
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statValue}>{user?.reputationScore || 100}</Text>
            <Text style={profileStyles.statLabel}>Rating</Text>
          </View>
          <View style={profileStyles.statDivider} />
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statValue}>{user?.totalContributions || 0}</Text>
            <Text style={profileStyles.statLabel}>Trips</Text>
          </View>
          <View style={profileStyles.statDivider} />
          <View style={profileStyles.statItem}>
            <Text style={profileStyles.statValue}>
              {user?.createdAt
                ? new Date().getFullYear() - new Date(user.createdAt).getFullYear()
                : 0}
            </Text>
            <Text style={profileStyles.statLabel}>Years</Text>
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View style={profileStyles.section}>
        <Text style={profileStyles.sectionTitle}>Account Information</Text>
        <View style={profileStyles.infoCard}>
          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Member Since</Text>
            <Text style={profileStyles.infoValue}>
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </Text>
          </View>
          <View style={profileStyles.infoDivider} />
          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Account Status</Text>
            <View style={profileStyles.statusBadge}>
              <Icon name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={profileStyles.statusText}>
                {user?.isVerified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          </View>
          <View style={profileStyles.infoDivider} />
          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Country</Text>
            <Text style={profileStyles.infoValue}>{user?.country || 'Nigeria'}</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={profileStyles.section}>
        <Text style={profileStyles.sectionTitle}>Quick Actions</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={profileStyles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={profileStyles.menuIconContainer}>
              <Icon name={item.icon} size={24} color={COLORS.primary} />
            </View>
            <View style={profileStyles.menuContent}>
              <Text style={profileStyles.menuTitle}>{item.title}</Text>
              <Text style={profileStyles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={profileStyles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={profileStyles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={profileStyles.footer}>
        <Text style={profileStyles.footerText}>Avigate v1.0.0</Text>
      </View>
    </ScrollView>
  );
};
