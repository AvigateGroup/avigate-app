// src/hooks/useUserService.ts

import { useState } from 'react';
import { userApi } from '@/api/user.api';
import { UpdateProfileDto } from '@/types/auth.types';
import { handleApiError } from '@/utils/helpers';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/store/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

interface UserDevice {
  id: string;
  deviceInfo: string;
  deviceType: string;
  platform: string;
  lastActiveAt: string;
  isActive: boolean;
}

interface UserStats {
  userId: string;
  email: string;
  isVerified: boolean;
  isTestAccount: boolean;
  memberSince: string;
  lastLogin: string;
  reputationScore: number;
  totalContributions: number;
  totalDevices: number;
  activeDevices: number;
  totalOTPs: number;
  usedOTPs: number;
}

export const useUserService = () => {
  const { updateUser, user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Update user profile
  const updateProfile = async (data: UpdateProfileDto) => {
    setIsLoading(true);
    try {
      const response = await userApi.updateProfile(data);

      if (response.success && response.data?.user) {
        updateUser(response.data.user);
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: response.message || 'Your profile has been updated successfully',
        });
        return response.data.user;
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Launch camera to capture photo
  const takeCameraPhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'We need camera permissions to take photos',
        });
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to take photo',
      });
    }
  };

  // Pick from gallery and upload profile picture
  const pickAndUploadProfilePicture = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'We need camera roll permissions to upload photos',
        });
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick image',
      });
    }
  };

  // Upload profile picture with progress
  const uploadProfilePicture = async (imageUri: string) => {
    setIsUploadingImage(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create form data
      const formData = new FormData();

      // Get file extension
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('file', {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        name: `profile-${Date.now()}.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      const response = await userApi.uploadProfilePicture(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success && response.data?.profilePicture) {
        // Update user with new profile picture
        if (currentUser) {
          updateUser({
            ...currentUser,
            profilePicture: response.data.profilePicture,
          });
        }

        Toast.show({
          type: 'success',
          text1: 'Upload Successful',
          text2: 'Your profile picture has been updated',
        });

        return response.data.profilePicture;
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: errorMessage,
      });
      throw error;
    } finally {
      setTimeout(() => {
        setIsUploadingImage(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Get user devices
  const getUserDevices = async (): Promise<UserDevice[]> => {
    setIsLoading(true);
    try {
      const response = await userApi.getDevices();
      if (response.success && response.data?.devices) {
        return response.data.devices;
      }
      return [];
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Deactivate device
  const deactivateDevice = async (deviceId: string) => {
    setIsLoading(true);
    try {
      const response = await userApi.deactivateDevice(deviceId);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Device Deactivated',
          text2: 'The device has been deactivated successfully',
        });
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user statistics
  const getUserStats = async (): Promise<UserStats | null> => {
    setIsLoading(true);
    try {
      const response = await userApi.getUserStats();
      if (response.success && response.data) {
        return response.data as UserStats;
      }
      return null;
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account (passwordless)
  const deleteAccount = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await userApi.deleteAccount('DELETE_MY_ACCOUNT');
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Account Deleted',
          text2: 'Your account has been deleted successfully',
        });
        return true;
      }
      return false;
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Deletion Failed',
        text2: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email change with OTP
  const verifyEmailChange = async (data: { email: string; otpCode: string }) => {
    setIsLoading(true);
    try {
      const response = await userApi.verifyEmailChange(data);

      // Update user with new email if verification successful
      if (response.success && response.data?.user) {
        updateUser(response.data.user);
      }

      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend email change OTP
  const resendEmailChangeOTP = async (email: string) => {
    try {
      const response = await userApi.resendEmailChangeOTP(email);
      return response;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    isLoading,
    isUploadingImage,
    uploadProgress,
    updateProfile,
    takeCameraPhoto,
    pickAndUploadProfilePicture,
    uploadProfilePicture,
    getUserDevices,
    deactivateDevice,
    getUserStats,
    deleteAccount,
    verifyEmailChange,
    resendEmailChangeOTP,
  };
};