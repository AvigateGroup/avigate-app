//app/_layout.tsx
import { useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
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

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated
      router.replace('/');
    }
  }, [isAuthenticated, segments, isLoading]);

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
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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