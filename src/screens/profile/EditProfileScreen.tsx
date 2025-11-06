// src/screens/profile/EditProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useUserService } from '@/hooks/useUserService';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { UserSex } from '@/types/auth.types';
import { profileStyles } from '@/styles';
import { formStyles, spacingStyles } from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';
import { COLORS } from '@/constants/colors';

export const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const colors = useThemedColors();
  const { updateProfile, isLoading } = useUserService();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    country: user?.country || 'Nigeria',
    language: user?.language || 'English',
    sex: user?.sex || '',
  });

  const handleUpdate = async () => {
    try {
      // Only send changed fields
      const changedFields: any = {};
      
      if (formData.firstName !== user?.firstName) changedFields.firstName = formData.firstName;
      if (formData.lastName !== user?.lastName) changedFields.lastName = formData.lastName;
      if (formData.email !== user?.email) changedFields.email = formData.email;
      if (formData.phoneNumber !== user?.phoneNumber) changedFields.phoneNumber = formData.phoneNumber;
      if (formData.country !== user?.country) changedFields.country = formData.country;
      if (formData.language !== user?.language) changedFields.language = formData.language;
      if (formData.sex !== user?.sex) changedFields.sex = formData.sex;

      if (Object.keys(changedFields).length === 0) {
        router.back();
        return;
      }

      await updateProfile(changedFields);
      router.back();
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[profileStyles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[profileStyles.section, { marginTop: 0 }]}>
          <Text style={[profileStyles.sectionTitle, { color: colors.text }]}>
            Personal Information
          </Text>

          {/* First Name */}
          <Input
            placeholder="First name"
            value={formData.firstName}
            onChangeText={text => setFormData({ ...formData, firstName: text })}
            leftIcon="person-outline"
          />

          {/* Last Name */}
          <Input
            placeholder="Last name"
            value={formData.lastName}
            onChangeText={text => setFormData({ ...formData, lastName: text })}
            leftIcon="person-outline"
          />

          {/* Email */}
          <Input
            placeholder="Email"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {formData.email !== user?.email && (
            <Text style={[authFeatureStyles.instructionText, { color: colors.warning, marginTop: -12 }]}>
              Changing your email will require re-verification
            </Text>
          )}

          {/* Phone Number */}
          <Input
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChangeText={text => setFormData({ ...formData, phoneNumber: text })}
            leftIcon="call-outline"
            keyboardType="phone-pad"
          />

          {/* Gender */}
          <View style={spacingStyles.marginBottom20}>
            <Text style={formStyles.genderLabel}>Sex</Text>
            <View style={formStyles.genderContainer}>
              <TouchableOpacity
                style={[
                  formStyles.genderButton,
                  formData.sex === UserSex.MALE && formStyles.genderButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, sex: UserSex.MALE })}
              >
                <Icon
                  name="male"
                  size={24}
                  color={formData.sex === UserSex.MALE ? COLORS.textWhite : COLORS.textMuted}
                />
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
                onPress={() => setFormData({ ...formData, sex: UserSex.FEMALE })}
              >
                <Icon
                  name="female"
                  size={24}
                  color={formData.sex === UserSex.FEMALE ? COLORS.textWhite : COLORS.textMuted}
                />
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
          </View>

          {/* Country */}
          <Input
            placeholder="Country"
            value={formData.country}
            onChangeText={text => setFormData({ ...formData, country: text })}
            leftIcon="globe-outline"
          />

          {/* Language */}
          <Input
            placeholder="Language"
            value={formData.language}
            onChangeText={text => setFormData({ ...formData, language: text })}
            leftIcon="language-outline"
          />
        </View>

        {/* Update Button */}
        <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 32 }}>
          <Button
            title="Update Profile"
            onPress={handleUpdate}
            loading={isLoading}
            disabled={isLoading}
          />

          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            disabled={isLoading}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};