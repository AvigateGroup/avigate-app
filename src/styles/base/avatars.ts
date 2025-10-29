// src/styles/base/avatars.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Avatar component styles
 */
export const avatarStyles = StyleSheet.create({
  // ========== AVATAR SIZES ==========
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  avatarMedium: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  // ========== AVATAR PLACEHOLDERS ==========
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  // ========== AVATAR CONTAINER ==========
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  // ========== CAMERA BUTTON ==========
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textWhite,
  },
});
