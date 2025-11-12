// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { VerifyLoginOTPScreen } from '@/screens/auth/VerifyLoginOtpScreen';
import { VerifyEmailScreen } from '@/screens/auth/VerifyEmailScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/screens/auth/ResetPasswordScreen';
import { PhoneVerificationScreen } from '@/screens/auth/PhoneVerificationScreen';
import { COLORS } from '@/constants/colors';
import { AuthStackParamList } from '@/types/navigation.types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
      initialRouteName="Login"
    >
      {/* Login Screen - Entry point */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
        }}
      />

      {/* Registration Screen */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
          animation: 'slide_from_bottom',
        }}
      />

      {/* Login OTP Verification Screen */}
      <Stack.Screen
        name="VerifyLoginOTP"
        component={VerifyLoginOTPScreen}
        options={{
          title: 'Verify Login',
          gestureEnabled: false,
        }}
      />

      {/* Email Verification Screen */}
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          title: 'Verify Email',
          gestureEnabled: false,
        }}
      />

      {/* Forgot Password Screen */}
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Forgot Password',
        }}
      />

      {/* Reset Password Screen */}
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'Reset Password',
          gestureEnabled: false,
        }}
      />

      {/* Phone Number Verification Screen */}
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{
          title: 'Add Phone Number',
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};
