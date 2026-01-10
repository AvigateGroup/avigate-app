// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
import { useThemedColors } from '../../src/hooks/useThemedColors';

export default function TabLayout() {
  const colors = useThemedColors();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
          borderRadius: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          zIndex: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -4,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Tab 1: Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Tab 2: Share Location */}
      <Tabs.Screen
        name="share"
        options={{
          title: 'Share Location',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'share-social' : 'share-social-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3: Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}