// src/types/navigation.types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  VerifyLoginOTP: { email: string };
  VerifyEmail: { email: string; userId?: string };
  GoogleAuth: undefined;
  PhoneVerification: { fromGoogleAuth?: boolean };
};

// Navigation prop types for each screen
export type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;
export type VerifyLoginOTPScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'VerifyLoginOTP'
>;
export type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'VerifyEmail'
>;
export type GoogleAuthScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'GoogleAuth'
>;
export type PhoneVerificationScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'PhoneVerification'
>;

// Route prop types for each screen
export type VerifyLoginOTPScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyLoginOTP'>;
export type VerifyEmailScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyEmail'>;
export type PhoneVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'PhoneVerification'>;
