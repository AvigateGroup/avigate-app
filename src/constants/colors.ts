// src/constants/colors.ts

export const LIGHT_COLORS = {
  // Primary Brand Colors
  primary: '#86B300',
  primaryDark: '#6B8F00',
  primaryLight: '#E8F3D0',

  // Secondary Colors
  secondary: '#4A5568',
  secondaryLight: '#E2E8F0',

  // Text Colors
  text: '#1A202C',
  textMuted: '#718096',
  textLight: '#A0AEC0',
  textWhite: '#FFFFFF',

  // Background Colors
  background: '#F7FAFC',
  backgroundDark: '#EDF2F7',
  backgroundLight: '#F9F9F9',
  white: '#FFFFFF',
  black: '#000000',

  // Status Colors
  success: '#48BB78',
  successLight: '#C6F6D5',
  error: '#F56565',
  errorLight: '#FED7D7',
  warning: '#ED8936',
  warningLight: '#FEEBC8',
  info: '#4299E1',
  infoLight: '#BEE3F8',

  // Border & Divider
  border: '#E2E8F0',
  divider: '#CBD5E0',
  borderLight: '#F0F0F0',

  // Social Media Colors
  google: '#4285F4',
  apple: '#000000',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  disabled: '#BDBDBD',
};

export const DARK_COLORS = {
  // Primary Brand Colors (keep brand colors consistent)
  primary: '#86B300',
  primaryDark: '#9DC91F',
  primaryLight: '#3D4D00',

  // Secondary Colors
  secondary: '#CBD5E0',
  secondaryLight: '#2D3748',

  // Text Colors
  text: '#F7FAFC',
  textMuted: '#A0AEC0',
  textLight: '#718096',
  textWhite: '#FFFFFF',

  // Background Colors
  background: '#1A202C',
  backgroundDark: '#171923',
  backgroundLight: '#2D3748',
  white: '#2D3748',
  black: '#000000',

  // Status Colors
  success: '#48BB78',
  successLight: '#22543D',
  error: '#FC8181',
  errorLight: '#742A2A',
  warning: '#F6AD55',
  warningLight: '#7C2D12',
  info: '#63B3ED',
  infoLight: '#2C5282',

  // Border & Divider
  border: '#2D3748',
  divider: '#4A5568',
  borderLight: '#374151',

  // Social Media Colors
  google: '#4285F4',
  apple: '#FFFFFF',

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',
  disabled: '#4A5568',
};

// Default export for backward compatibility
export const COLORS = LIGHT_COLORS;

/**
 * Get colors based on theme
 */
export const getColors = (isDark: boolean) => {
  return isDark ? DARK_COLORS : LIGHT_COLORS;
};
