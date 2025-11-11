// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { CountryPhonePicker } from '@/components/common/CountryPhonePicker';
import { authApi } from '@/api/auth.api';
import { validateEmail, validatePassword, validatePhoneNumber } from '@/utils/validation';
import { getDeviceInfo, getFCMToken } from '@/utils/helpers';
import { useFirebaseGoogleAuth } from '@/hooks/useFirebaseGoogleAuth';
import { RegisterDto, UserSex } from '@/types/auth.types';
import { typographyStyles, formStyles, layoutStyles, spacingStyles } from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';
import { COLORS } from '@/constants/colors';

// Terms and Privacy Policy Version Configuration
const TERMS_VERSION = '1.0';
const PRIVACY_VERSION = '1.0';

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const { signInWithGoogle, loading: googleLoading, isReady } = useFirebaseGoogleAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+234',
    country: 'Nigeria',
    sex: '' as UserSex | '',
    language: 'English',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const totalSteps = 5;

  const updateField = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Invalid email address';
        }
        break;

      case 2:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        break;

      case 3:
        if (!formData.sex) {
          newErrors.sex = 'Please select your sex';
        }
        if (!formData.language) {
          newErrors.language = 'Please select your language';
        }
        break;

      case 4:
        if (!formData.phoneNumber) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!validatePhoneNumber(formData.countryCode + formData.phoneNumber)) {
          newErrors.phoneNumber = 'Invalid phone number';
        }
        break;

      case 5:
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else {
          const passwordValidation = validatePassword(formData.password);
          if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.errors[0];
          }
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.agreedToTerms) {
          newErrors.agreedToTerms = 'You must agree to the terms and conditions to continue';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleRegister();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleRegister = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      const fcmToken = await getFCMToken();
      const deviceInfo = getDeviceInfo();

      const registerDto: RegisterDto = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        sex: formData.sex as UserSex,
        phoneNumber: formData.countryCode + formData.phoneNumber,
        country: formData.country,
        language: formData.language,
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      const response = await authApi.register(registerDto);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: response.message,
        });

        router.push({
          pathname: '/(auth)/verify-email',
          params: { email: formData.email.toLowerCase().trim() },
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // Extract error message from various possible error structures
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Registration failed';

      const statusCode = error?.response?.status || error?.response?.data?.statusCode;

      // Handle 409 Conflict errors (duplicate email/phone)
      if (statusCode === 409) {
        const lowerMessage = errorMessage.toLowerCase();

        if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
          setErrors({ email: 'This email is already registered' });
          setCurrentStep(1); // Go back to email step
          Toast.show({
            type: 'error',
            text1: 'Email Already Registered',
            text2: 'This email is already in use. Please use a different email or sign in.',
          });
          return;
        }

        if (lowerMessage.includes('phone') && lowerMessage.includes('already')) {
          setErrors({ phoneNumber: 'This phone number is already registered' });
          setCurrentStep(4); // Go back to phone step
          Toast.show({
            type: 'error',
            text1: 'Phone Number Already Registered',
            text2: 'This phone number is already in use. Please use a different number.',
          });
          return;
        }
      }

      // Handle validation errors (400)
      if (statusCode === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Information',
          text2: errorMessage,
        });
      } else {
        // Generic error handling
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={authFeatureStyles.stepContainer}>
            <Text style={authFeatureStyles.stepTitle}>What's your email?</Text>
            <Text style={authFeatureStyles.stepSubtitle}>
              We'll use this to create your account
            </Text>

            <Input
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={text => updateField('email', text)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              autoFocus
            />
          </View>
        );

      case 2:
        return (
          <View style={authFeatureStyles.stepContainer}>
            <Text style={authFeatureStyles.stepTitle}>What's your name?</Text>
            <Text style={authFeatureStyles.stepSubtitle}>Let us know what to call you</Text>

            <Input
              placeholder="First name"
              value={formData.firstName}
              onChangeText={text => updateField('firstName', text)}
              error={errors.firstName}
              leftIcon="person-outline"
              autoFocus
            />

            <Input
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={text => updateField('lastName', text)}
              error={errors.lastName}
              leftIcon="person-outline"
            />
          </View>
        );

      case 3:
        return (
          <View style={authFeatureStyles.stepContainer}>
            <Text style={authFeatureStyles.stepTitle}>Tell us about yourself</Text>
            <Text style={authFeatureStyles.stepSubtitle}>Help us personalize your experience</Text>

            <View style={spacingStyles.marginBottom20}>
              <Text style={formStyles.genderLabel}>Sex</Text>
              <View style={formStyles.genderContainer}>
                <TouchableOpacity
                  style={[
                    formStyles.genderButton,
                    formData.sex === UserSex.MALE && formStyles.genderButtonActive,
                  ]}
                  onPress={() => updateField('sex', UserSex.MALE)}
                >
                  <Text
                    style={[
                      formStyles.genderButtonText,
                      formData.sex === UserSex.MALE && formStyles.genderButtonTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    formStyles.genderButton,
                    formData.sex === UserSex.FEMALE && formStyles.genderButtonActive,
                  ]}
                  onPress={() => updateField('sex', UserSex.FEMALE)}
                >
                  <Text
                    style={[
                      formStyles.genderButtonText,
                      formData.sex === UserSex.FEMALE && formStyles.genderButtonTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.sex && <Text style={typographyStyles.errorText}>{errors.sex}</Text>}
            </View>

            <View>
              <Text style={formStyles.genderLabel}>Preferred Language</Text>
              <View style={authFeatureStyles.languageButtons}>
                {['English'].map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      authFeatureStyles.languageButton,
                      formData.language === lang && authFeatureStyles.languageButtonActive,
                    ]}
                    onPress={() => updateField('language', lang)}
                  >
                    <Text
                      style={[
                        authFeatureStyles.languageButtonText,
                        formData.language === lang && authFeatureStyles.languageButtonTextActive,
                      ]}
                    >
                      {lang}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={authFeatureStyles.stepContainer}>
            <Text style={authFeatureStyles.stepTitle}>What's your phone number?</Text>
            <Text style={authFeatureStyles.stepSubtitle}>We'll use this for account security</Text>

            <CountryPhonePicker
              countryCode={formData.countryCode}
              phoneNumber={formData.phoneNumber}
              country={formData.country}
              onCountryChange={(code, country) => {
                updateField('countryCode', code);
                updateField('country', country);
              }}
              onPhoneChange={phone => updateField('phoneNumber', phone)}
              error={errors.phoneNumber}
            />
          </View>
        );

      case 5:
        return (
          <View style={authFeatureStyles.stepContainer}>
            <Text style={authFeatureStyles.stepTitle}>Create a password</Text>
            <Text style={authFeatureStyles.stepSubtitle}>Make sure it's secure</Text>

            <Input
              placeholder="Password"
              value={formData.password}
              onChangeText={text => updateField('password', text)}
              error={errors.password}
              secureTextEntry
              leftIcon="lock-closed-outline"
              autoFocus
            />

            <Input
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={text => updateField('confirmPassword', text)}
              error={errors.confirmPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
            />

            <View style={formStyles.passwordRequirements}>
              <Text style={formStyles.requirementsTitle}>Password must contain:</Text>
              <Text style={formStyles.requirementItem}>• At least 8 characters</Text>
              <Text style={formStyles.requirementItem}>• At least 1 number</Text>
              <Text style={formStyles.requirementItem}>• Both upper and lowercase letters</Text>
            </View>

            <TouchableOpacity
              style={authFeatureStyles.checkboxContainer}
              onPress={() => updateField('agreedToTerms', !formData.agreedToTerms)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  authFeatureStyles.checkbox,
                  formData.agreedToTerms && authFeatureStyles.checkboxChecked,
                ]}
              >
                {formData.agreedToTerms && (
                  <Icon name="checkmark" size={16} color={COLORS.textWhite} />
                )}
              </View>
              <Text style={authFeatureStyles.checkboxLabel}>
                I agree to the{' '}
                <Text style={typographyStyles.linkText} onPress={() => router.push('/terms')}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={typographyStyles.linkText} onPress={() => router.push('/privacy')}>
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
            {errors.agreedToTerms && (
              <Text style={typographyStyles.errorText}>{errors.agreedToTerms}</Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (!isReady) {
    return <Loading fullScreen message="Setting up authentication..." />;
  }

  return (
    <AuthLayout showLogo={true}>
      <View style={authFeatureStyles.authContent}>
        {/* Progress Indicator */}
        <View style={authFeatureStyles.progressContainer}>
          {[...Array(totalSteps)].map((_, index) => (
            <View
              key={index}
              style={[
                authFeatureStyles.progressDot,
                index + 1 <= currentStep && authFeatureStyles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <View style={authFeatureStyles.navigationButtons}>
          {currentStep > 1 && (
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              style={authFeatureStyles.backButton}
              disabled={loading || googleLoading}
            />
          )}
          <Button
            title={currentStep === totalSteps ? 'Sign Up' : 'Next'}
            onPress={handleNext}
            loading={loading}
            disabled={loading || googleLoading}
            style={authFeatureStyles.nextButton}
          />
        </View>

        {/* Google Sign Up Alternative */}
        {currentStep === 1 && (
          <>
            <View style={layoutStyles.divider}>
              <View style={layoutStyles.dividerLine} />
              <Text style={layoutStyles.dividerText}>OR</Text>
              <View style={layoutStyles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={signInWithGoogle}
              disabled={loading || googleLoading}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../../assets/images/google-icon.png')}
                style={[
                  authFeatureStyles.googleButtonImage,
                  (loading || googleLoading) && { opacity: 0.5 }
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </>
        )}

        {/* Footer */}
        <View style={layoutStyles.footer}>
          <Text style={layoutStyles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={layoutStyles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};