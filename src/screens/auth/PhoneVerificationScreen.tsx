// src/screens/auth/PhoneVerificationScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { authStyles } from '@/styles';

export const PhoneVerificationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fromGoogleAuth = params.fromGoogleAuth === 'true';
  
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
        <View style={authStyles.centeredContainer}>
          <View style={authStyles.iconContainer}>
            <View style={authStyles.iconCircle}>
              <Icon name="call-outline" size={40} color={COLORS.primary} />
            </View>
          </View>

          <Text style={authStyles.titleCentered}>Add Phone Number</Text>
          <Text style={authStyles.subtitleCentered}>
            Help us secure your account by adding your phone number
          </Text>

          <View style={authStyles.benefitsContainer}>
            <View style={authStyles.benefitItem}>
              <Icon name="shield-checkmark-outline" size={20} color={COLORS.primary} />
              <Text style={authStyles.benefitText}>Enhanced account security</Text>
            </View>
            <View style={authStyles.benefitItem}>
              <Icon name="notifications-outline" size={20} color={COLORS.primary} />
              <Text style={authStyles.benefitText}>Receive important notifications</Text>
            </View>
            <View style={authStyles.benefitItem}>
              <Icon name="person-outline" size={20} color={COLORS.primary} />
              <Text style={authStyles.benefitText}>Complete your profile</Text>
            </View>
          </View>

          <View style={authStyles.form}>
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

            <Text style={authStyles.genderLabel}>Gender (Optional)</Text>
            <View style={authStyles.genderContainer}>
              <TouchableOpacity
                style={[
                  authStyles.genderButton,
                  sex === UserSex.MALE && authStyles.genderButtonActive,
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
                    authStyles.genderButtonText,
                    sex === UserSex.MALE && authStyles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  authStyles.genderButton,
                  sex === UserSex.FEMALE && authStyles.genderButtonActive,
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
                    authStyles.genderButtonText,
                    sex === UserSex.FEMALE && authStyles.genderButtonTextActive,
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
              style={authStyles.submitButton}
            />

            {fromGoogleAuth && (
              <TouchableOpacity
                onPress={handleSkip}
                style={authStyles.skipButton}
              >
                <Text style={authStyles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={authStyles.footerWithIcon}>
            <Icon name="lock-closed-outline" size={16} color={COLORS.textMuted} />
            <Text style={authStyles.footerTextWithIcon}>
              Your phone number is kept private and secure
            </Text>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
};
