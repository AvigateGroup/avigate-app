// src/screens/profile/ProfileScreen.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { getInitials, formatDate } from '@/utils/helpers';
import { profileStyles } from '@/styles';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colors = useThemedColors();
  

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
      title: 'Trip History',
      subtitle: 'View your past trips',
      onPress: () => {
        Alert.alert('Coming Soon', 'Trip history feature will be available soon');
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
    <ScrollView 
      style={[profileStyles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[profileStyles.header, { backgroundColor: colors.white }]}>
        <View style={profileStyles.avatarContainer}>
          {user?.profilePicture ? (
            <Image 
              source={{ uri: user.profilePicture }} 
              style={profileStyles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[profileStyles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={profileStyles.avatarText}>
                {getInitials(user?.firstName || '', user?.lastName || '')}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={[profileStyles.cameraButton, { backgroundColor: colors.primary }]} 
            activeOpacity={0.7}
          >
            <Icon name="camera" size={16} color={colors.textWhite} />
          </TouchableOpacity>
        </View>

        <Text style={[profileStyles.name, { color: colors.text }]}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={[profileStyles.email, { color: colors.textMuted }]}>{user?.email}</Text>

        {user?.phoneNumber && (
          <View style={profileStyles.phoneContainer}>
            <Icon name="call-outline" size={16} color={colors.textMuted} />
            <Text style={[profileStyles.phone, { color: colors.textMuted }]}>{user.phoneNumber}</Text>
          </View>
        )}

        {/* Stats */}
        <View style={[profileStyles.statsContainer, { borderTopColor: colors.border }]}>
          <View style={profileStyles.statItem}>
            <Text style={[profileStyles.statValue, { color: colors.text }]}>
              {user?.reputationScore || 100}
            </Text>
            <Text style={[profileStyles.statLabel, { color: colors.textMuted }]}>Rating</Text>
          </View>
          <View style={[profileStyles.statDivider, { backgroundColor: colors.border }]} />
          <View style={profileStyles.statItem}>
            <Text style={[profileStyles.statValue, { color: colors.text }]}>
              {user?.totalContributions || 0}
            </Text>
            <Text style={[profileStyles.statLabel, { color: colors.textMuted }]}>Trips</Text>
          </View>
          <View style={[profileStyles.statDivider, { backgroundColor: colors.border }]} />
          <View style={profileStyles.statItem}>
            <Text style={[profileStyles.statValue, { color: colors.text }]}>
              {user?.createdAt
                ? new Date().getFullYear() - new Date(user.createdAt).getFullYear()
                : 0}
            </Text>
            <Text style={[profileStyles.statLabel, { color: colors.textMuted }]}>Years</Text>
          </View>
        </View>
      </View>

      {/* Account Info */}
      <View style={profileStyles.section}>
        <Text style={[profileStyles.sectionTitle, { color: colors.text }]}>Account Information</Text>
        <View style={[profileStyles.infoCard, { backgroundColor: colors.white }]}>
          <View style={profileStyles.infoRow}>
            <Text style={[profileStyles.infoLabel, { color: colors.textMuted }]}>Member Since</Text>
            <Text style={[profileStyles.infoValue, { color: colors.text }]}>
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </Text>
          </View>
          <View style={[profileStyles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={profileStyles.infoRow}>
            <Text style={[profileStyles.infoLabel, { color: colors.textMuted }]}>Account Status</Text>
            <View style={profileStyles.statusBadge}>
              <Icon name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[profileStyles.statusText, { color: colors.success }]}>
                {user?.isVerified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
          </View>
          <View style={[profileStyles.infoDivider, { backgroundColor: colors.border }]} />
          <View style={profileStyles.infoRow}>
            <Text style={[profileStyles.infoLabel, { color: colors.textMuted }]}>Country</Text>
            <Text style={[profileStyles.infoValue, { color: colors.text }]}>
              {user?.country || 'Nigeria'}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={profileStyles.section}>
        <Text style={[profileStyles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[profileStyles.menuItem, { backgroundColor: colors.white }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View 
              style={[
                profileStyles.menuIconContainer, 
                { backgroundColor: colors.backgroundLight }
              ]}
            >
              <Icon name={item.icon} size={24} color={colors.primary} />
            </View>
            <View style={profileStyles.menuContent}>
              <Text style={[profileStyles.menuTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[profileStyles.menuSubtitle, { color: colors.textMuted }]}>
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
          profileStyles.logoutButton, 
          { 
            backgroundColor: colors.white,
            borderColor: colors.error 
          }
        ]}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Icon name="log-out-outline" size={20} color={colors.error} />
        <Text style={[profileStyles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>

      <View style={profileStyles.footer}>
        <Text style={[profileStyles.footerText, { color: colors.textMuted }]}>Avigate v1.0.0</Text>
      </View>
    </ScrollView>
  );
};