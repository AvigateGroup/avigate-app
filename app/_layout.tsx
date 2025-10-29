// app/_layout.tsx
// Root layout for the entire application

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '../src/store/AuthContext';
import { COLORS } from '../src/constants/colors';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading]);

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.background} 
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="settings" 
          options={{ 
            headerShown: true,
            title: 'Settings',
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTintColor: COLORS.text,
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}