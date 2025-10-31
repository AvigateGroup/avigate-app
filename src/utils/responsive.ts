// src/utils/responsive.ts

import { Dimensions, PixelRatio, Platform } from 'react-native';

/**
 * Responsive utility functions following industry standards
 * Based on a standard design reference of 375x812 (iPhone X/11/12/13 Pro)
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design reference dimensions (iPhone X/11/12/13 Pro)
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

/**
 * Scales a value based on screen width
 * Use for horizontal spacing, margins, paddings, and widths
 */
export const scaleWidth = (size: number): number => {
  return (SCREEN_WIDTH / DESIGN_WIDTH) * size;
};

/**
 * Scales a value based on screen height
 * Use for vertical spacing, margins, and heights
 */
export const scaleHeight = (size: number): number => {
  return (SCREEN_HEIGHT / DESIGN_HEIGHT) * size;
};

/**
 * Scales font sizes with a moderate scale factor
 * Prevents text from becoming too large on bigger screens
 */
export const scaleFontSize = (size: number): number => {
  const scale = SCREEN_WIDTH / DESIGN_WIDTH;
  const newSize = size * scale;
  
  // Limit scaling on very large devices (tablets)
  if (SCREEN_WIDTH > 768) {
    return size * 1.2; // Max 20% increase on tablets
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Moderate scale - best for sizing that shouldn't scale too much
 * Good for buttons, icons, and component heights
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scaleWidth(size) - size) * factor;
};

/**
 * Device detection utilities
 */
export const isSmallDevice = (): boolean => SCREEN_WIDTH < 375;
export const isMediumDevice = (): boolean => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = (): boolean => SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768;
export const isTablet = (): boolean => SCREEN_WIDTH >= 768;

/**
 * Safe responsive values based on device size
 */
export const getResponsiveValue = (
  small: number,
  medium: number,
  large: number,
  tablet: number
): number => {
  if (isTablet()) return tablet;
  if (isLargeDevice()) return large;
  if (isMediumDevice()) return medium;
  return small;
};

/**
 * Get screen dimensions
 */
export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
});

/**
 * Responsive spacing values (Industry Standard)
 * Based on 8pt grid system
 */
export const SPACING = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  base: moderateScale(16),
  lg: moderateScale(20),
  xl: moderateScale(24),
  xxl: moderateScale(32),
  xxxl: moderateScale(40),
};

/**
 * Responsive font sizes (Industry Standard)
 * Following iOS Human Interface Guidelines and Material Design
 */
export const FONT_SIZES = {
  xs: scaleFontSize(10),    // Caption, fine print
  sm: scaleFontSize(12),    // Small labels, secondary text
  base: scaleFontSize(14),  // Body text, default
  md: scaleFontSize(16),    // Buttons, inputs, prominent body
  lg: scaleFontSize(18),    // Subheadings
  xl: scaleFontSize(20),    // Section titles
  xxl: scaleFontSize(24),   // Screen titles
  xxxl: scaleFontSize(28),  // Hero titles
  huge: scaleFontSize(32),  // Display text
};

/**
 * Responsive line heights (Industry Standard)
 * 1.5x font size is optimal for readability
 */
export const LINE_HEIGHTS = {
  xs: FONT_SIZES.xs * 1.4,
  sm: FONT_SIZES.sm * 1.4,
  base: FONT_SIZES.base * 1.5,
  md: FONT_SIZES.md * 1.5,
  lg: FONT_SIZES.lg * 1.4,
  xl: FONT_SIZES.xl * 1.4,
  xxl: FONT_SIZES.xxl * 1.3,
  xxxl: FONT_SIZES.xxxl * 1.3,
  huge: FONT_SIZES.huge * 1.2,
};

/**
 * Responsive icon sizes
 */
export const ICON_SIZES = {
  xs: moderateScale(12),
  sm: moderateScale(16),
  base: moderateScale(20),
  md: moderateScale(24),
  lg: moderateScale(32),
  xl: moderateScale(40),
  xxl: moderateScale(48),
};

/**
 * Responsive button heights (Industry Standard)
 * Minimum touch target: 44pt (Apple) / 48dp (Google)
 */
export const BUTTON_HEIGHTS = {
  small: moderateScale(40),
  medium: moderateScale(48),  // Default, meets accessibility standards
  large: moderateScale(56),
};

/**
 * Responsive border radius
 */
export const BORDER_RADIUS = {
  xs: moderateScale(4),
  sm: moderateScale(6),
  base: moderateScale(8),
  md: moderateScale(10),
  lg: moderateScale(12),
  xl: moderateScale(16),
  xxl: moderateScale(20),
  round: 9999, // Fully rounded
};

/**
 * Platform-specific adjustments
 */
export const platformValue = <T,>(ios: T, android: T): T => {
  return Platform.OS === 'ios' ? ios : android;
};

/**
 * Calculate percentage of screen dimension
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Get safe logo size based on screen
 */
export const getLogoSize = (): number => {
  return getResponsiveValue(120, 140, 160, 200);
};

/**
 * Get safe input height
 */
export const getInputHeight = (): number => {
  return getResponsiveValue(48, 52, 56, 60);
};