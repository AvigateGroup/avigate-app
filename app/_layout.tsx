// app/_layout.tsx
// CRITICAL: Import Firebase modules DIRECTLY here to ensure initialization
try {
  require('@react-native-firebase/app');
  require('@react-native-firebase/auth');
} catch (error) {
  console.warn('Firebase native modules not available. Some features may be disabled.', error);
}

import { useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import { StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '../src/store/AuthContext';
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext';
import { DialogProvider } from '../src/contexts/DialogContext';
import { NetworkProvider } from '../src/contexts/NetworkContext';
import { useThemedColors } from '../src/hooks/useThemedColors';
import { OfflineBanner } from '../src/components/OfflineBanner';
import { getFCMToken } from '../src/utils/helpers';
import { STORAGE_KEYS } from '../src/constants/config';
import { apiClient } from '../src/api/client';
import AnimatedSplashScreen from '../src/components/animation/AnimatedSplashScreen';
import * as SplashScreen from 'expo-splash-screen';

// Prevent native splash from auto-hiding
SplashScreen.preventAutoHideAsync();

// Configure foreground notification display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Create Android notification channel (required for Android 8+)
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('avigate_alerts', {
    name: 'Avigate Alerts',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#86B300',
    enableVibrate: true,
    sound: 'default',
  });
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isDark } = useTheme();
  const colors = useThemedColors();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Check onboarding status on mount and when pathname changes
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        const hasCompleted = value === 'true';
        setHasSeenOnboarding(hasCompleted);
      } catch (error) {
        setHasSeenOnboarding(false);
      }
    };

    checkOnboarding();

    // Also check when we're on the login screen (in case we just came from onboarding)
    if (pathname === '/(auth)/login' || pathname === '/login') {
      setTimeout(checkOnboarding, 200);
    }
  }, [pathname]);

  // Handle navigation based on auth and onboarding status
  useEffect(() => {
    if (isLoading || hasSeenOnboarding === null || isNavigating) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';
    const inSettings = segments[0] === 'settings';
    const inProfile = segments[0] === 'profile';
    const inPrivacy = segments[0] === 'privacy';
    const inTerms = segments[0] === 'terms';
    // Check both pathname and segments to catch phone verification screen
    const inPhoneVerification =
      pathname === '/(auth)/phone-verification' ||
      pathname === '/phone-verification' ||
      (segments[0] === '(auth)' && segments[1] === 'phone-verification');

    // Public routes that don't require authentication and shouldn't trigger redirects
    const isPublicRoute = inPrivacy || inTerms;

    // First time user - show onboarding (but not if already navigating to login from onboarding)
    if (!hasSeenOnboarding && !inOnboarding && !inAuthGroup && !isPublicRoute) {
      setIsNavigating(true);
      router.replace('/onboarding');
      setTimeout(() => setIsNavigating(false), 1000);
      return;
    }

    // User has seen onboarding but not authenticated - redirect to login
    // But ONLY if they're not already in the auth group OR viewing public routes
    if (hasSeenOnboarding && !isAuthenticated && !inAuthGroup && !inOnboarding && !isPublicRoute) {
      setIsNavigating(true);
      router.replace('/(auth)/login');
      setTimeout(() => setIsNavigating(false), 1000);
      return;
    }

    // CRITICAL: Check if authenticated user needs to add phone number
    if (isAuthenticated && user && !user.phoneNumberCaptured && !inPhoneVerification) {
      setIsNavigating(true);
      router.replace({
        pathname: '/(auth)/phone-verification',
        params: { fromGoogleAuth: 'true' },
      });
      setTimeout(() => setIsNavigating(false), 1000);
      return;
    }

    // User is authenticated, has phone, but in auth screens or onboarding (not in public routes or phone verification)
    if (
      isAuthenticated &&
      user?.phoneNumberCaptured &&
      (inAuthGroup || inOnboarding) &&
      !isPublicRoute &&
      !inPhoneVerification
    ) {
      setIsNavigating(true);
      router.replace('/(tabs)');
      setTimeout(() => setIsNavigating(false), 1000);
      return;
    }
  }, [isAuthenticated, segments, isLoading, hasSeenOnboarding, isNavigating, pathname, user]);

  // Push notification listeners and token registration
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;

    const registerToken = async () => {
      try {
        const token = await getFCMToken();
        if (token && isMounted) {
          await AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
          // Send token to backend so it can send push notifications
          try {
            await apiClient.post('/users/devices/register-token', { fcmToken: token });
          } catch (err) {
            console.warn('Failed to register token with backend:', err);
          }
        }
      } catch (error) {
        console.log('Failed to register push token:', error);
      }
    };

    registerToken();

    // Handle notification that launched the app from killed state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response && isMounted) {
        const data = response.notification.request.content.data;
        if (data?.actionUrl && typeof data.actionUrl === 'string') {
          router.push(data.actionUrl as any);
        } else {
          router.push('/notifications');
        }
      }
    }).catch(() => {});

    const notificationSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification.request.content.title);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.actionUrl && typeof data.actionUrl === 'string') {
          router.push(data.actionUrl as any);
        } else {
          router.push('/notifications');
        }
      }
    );

    // Listen for token refresh (FCM tokens can be rotated)
    const tokenRefreshSubscription = Notifications.addPushTokenListener((tokenData) => {
      if (isMounted && tokenData.data) {
        AsyncStorage.setItem(STORAGE_KEYS.FCM_TOKEN, tokenData.data);
        apiClient.post('/users/devices/register-token', { fcmToken: tokenData.data })
          .catch((err) => console.warn('Token refresh registration failed:', err));
      }
    });

    return () => {
      isMounted = false;
      notificationSubscription.remove();
      responseSubscription.remove();
      tokenRefreshSubscription.remove();
    };
  }, [isAuthenticated, user]);

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
        {/* Onboarding Screen */}
        <Stack.Screen
          name="onboarding/index"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade',
          }}
        />

        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />

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

        {/* Search Destination Screen */}
        <Stack.Screen
          name="search/index"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />

        {/* Privacy & Terms - Public Routes */}
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
            presentation: 'modal', // Open as modal for better UX
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
            presentation: 'modal', // Open as modal for better UX
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
      <NetworkProvider>
        <DialogProvider>
          <RootLayoutNav />
          <OfflineBanner />
        </DialogProvider>
      </NetworkProvider>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemedRootLayoutNav />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
