// src/navigation/MainNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';

// Import screens
import { HomeScreen } from '@/screens/home/HomeScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';
import { EditProfileScreen } from '@/screens/profile/EditProfileScreen';
import { DevicesScreen } from '@/screens/profile/DevicesScreen';
import { VerifyEmailChangeScreen } from '@/screens/profile/VerifyEmailChangeScreen';
import { ShareLocationScreen } from '@/screens/share/ShareLocationScreen';
import { SearchDestinationScreen } from '@/screens/search/SearchDestinationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false, // Hide header for cleaner look like Bolt
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{
        title: 'Avigate',
      }}
    />
    {/* Modal screen for search destination */}
    <Stack.Screen
      name="SearchDestination"
      component={SearchDestinationScreen}
      options={{
        presentation: 'modal',
        animation: 'slide_from_bottom',
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.text,
        headerTitle: '',
        headerShadowVisible: false,
      }}
    />
  </Stack.Navigator>
);

// Share Location Stack Navigator
const ShareLocationStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.textWhite,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="ShareLocationMain"
      component={ShareLocationScreen}
      options={{
        title: 'Share Location',
      }}
    />
  </Stack.Navigator>
);

// Profile Stack Navigator
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.textWhite,
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{
        title: 'Profile',
      }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: 'Settings',
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        title: 'Edit Profile',
      }}
    />
    <Stack.Screen
      name="Devices"
      component={DevicesScreen}
      options={{
        title: 'My Devices',
      }}
    />
    <Stack.Screen
      name="VerifyEmailChange"
      component={VerifyEmailChangeScreen}
      options={{
        title: 'Verify Email',
        gestureEnabled: false, // Prevent swipe back
      }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator - Updated to 3 tabs like Bolt
export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ShareLocation') {
            iconName = focused ? 'share-social' : 'share-social-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="ShareLocation"
        component={ShareLocationStack}
        options={{
          tabBarLabel: 'Share Location',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};
