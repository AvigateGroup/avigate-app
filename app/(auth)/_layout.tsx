// app/(auth)/_layout.tsx
// Layout for authentication screens

import { Stack } from 'expo-router';
import { COLORS } from '../../src/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="verify-login-otp" />
      <Stack.Screen name="phone-verification" />
    </Stack>
  );
}
