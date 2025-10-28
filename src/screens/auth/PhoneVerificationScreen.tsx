// src/screens/auth/PhoneVerificationScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validatePhoneNumber } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { UserSex } from '@/types/auth.types';

type PhoneVerificationScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { fromGoogleAuth?: boolean } }, 'params'>;
};

export const PhoneVerificationScreen: React.FC<PhoneVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { fromGoogleAuth } = route.params || {};
  const { user, updateUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sex, setSex] = useState<UserSex | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.capturePhone({
        phoneNumber,
        sex,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Phone number updated successfully',
        });

        // Update user in context
        if (response.data.user) {
          updateUser(response.data.user);
        }

        // Navigate to main app
        // The navigation will be handled by AuthContext
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (fromGoogleAuth) {
      // Navigate to main app
      // The navigation will be handled by AuthContext
      Toast.show({
        type: 'info',
        text1: 'Skipped',
        text2: 'You can add your phone number later in settings',
      });
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Icon name="call-outline" size={40} color={COLORS.primary} />
            </View>
          </View>

          <Text style={styles.title}>Add Phone Number</Text>
          <Text style={styles.subtitle}>
            Help us secure your account by adding your phone number
          </Text>

          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Icon name="shield-checkmark-outline" size={20} color={COLORS.primary} />
              <Text style={styles.benefitText}>Enhanced account security</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="notifications-outline" size={20} color={COLORS.primary} />
              <Text style={styles.benefitText}>Receive important notifications</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="person-outline" size={20} color={COLORS.primary} />
              <Text style={styles.benefitText}>Complete your profile</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Input
              label="Phone Number"
              placeholder="+234 800 000 0000"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setError('');
              }}
              error={error}
              keyboardType="phone-pad"
              leftIcon="call-outline"
            />

            <Text style={styles.genderLabel}>Gender (Optional)</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  sex === UserSex.MALE && styles.genderButtonActive,
                ]}
                onPress={() => setSex(UserSex.MALE)}
              >
                <Icon
                  name="male"
                  size={24}
                  color={sex === UserSex.MALE ? COLORS.textWhite : COLORS.text}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    sex === UserSex.MALE && styles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  sex === UserSex.FEMALE && styles.genderButtonActive,
                ]}
                onPress={() => setSex(UserSex.FEMALE)}
              >
                <Icon
                  name="female"
                  size={24}
                  color={sex === UserSex.FEMALE ? COLORS.textWhite : COLORS.text}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    sex === UserSex.FEMALE && styles.genderButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Continue"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />

            {fromGoogleAuth && (
              <TouchableOpacity
                onPress={handleSkip}
                style={styles.skipButton}
              >
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.footer}>
            <Icon name="lock-closed-outline" size={16} color={COLORS.textMuted} />
            <Text style={styles.footerText}>
              Your phone number is kept private and secure
            </Text>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },
  form: {
    marginBottom: 24,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  genderButtonTextActive: {
    color: COLORS.textWhite,
  },
  submitButton: {
    marginTop: 8,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});