// app/_layout.tsx
import { useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../src/store/AuthContext';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { useThemedColors } from '../src/hooks/useThemedColors';
import AnimatedSplashScreen from '../src/components/animation/AnimatedSplashScreen';
import * as SplashScreen from 'expo-splash-screen';

// Prevent native splash from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isDark } = useTheme();
  const colors = useThemedColors();
  const segments = useSegments();
  const router = useRouter();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  // Check onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(value === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  // Handle navigation based on auth and onboarding status
  useEffect(() => {
    if (isLoading || hasSeenOnboarding === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    // First time user - show onboarding
    if (!hasSeenOnboarding && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    // Regular authentication flow
    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments, isLoading, hasSeenOnboarding]);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {/* Onboarding Screen - NEW */}
        <Stack.Screen 
          name="onboarding/index" 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }} 
        />
        
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Settings Screen */}
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            title: 'Settings',
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />

        {/* Profile Routes */}
        <Stack.Screen
          name="profile/edit"
          options={{
            headerShown: true,
            title: 'Edit Profile',
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="profile/devices"
          options={{
            headerShown: true,
            title: 'My Devices',
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />

        {/* Privacy & Terms */}
        <Stack.Screen
          name="privacy/index"
          options={{
            headerShown: true,
            title: 'Privacy Policy',
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="terms/index"
          options={{
            headerShown: true,
            title: 'Terms of Service',
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>

      {/* Toast Notifications */}
      <Toast />
    </>
  );
}

// Wrapper component that provides theme context to RootLayoutNav
function ThemedRootLayoutNav() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load any resources here
        // await Font.loadAsync({ ... });
        // await loadUserData();

        // Small delay to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the native splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setShowAnimatedSplash(false);
  }, []);

  // Show animated splash while app is loading or animation is playing
  if (!appIsReady || showAnimatedSplash) {
    return <AnimatedSplashScreen onComplete={handleAnimationComplete} />;
  }

  // Main app content with both AuthProvider and ThemeProvider
  return (
    <AuthProvider>
      <ThemedRootLayoutNav />
    </AuthProvider>
  );
}