// src/constants/colors.ts

export const COLORS = {
  // Primary colors - Avigate brand colors
  primary: '#86B300',        // Main Avigate green - used for buttons, links, highlights
  primaryDark: '#6B8E00',    // Darker green - used for hover states, active buttons
  primaryLight: '#A3CC00',   // Lighter green - used for subtle highlights, backgrounds
  
  // Secondary colors
  secondary: '#FFFFFF',       // White - main secondary color
  secondaryDark: '#F5F5F5',  // Light gray - used for subtle backgrounds
  
  // Background colors
  background: '#FFFFFF',      // Main background color
  backgroundLight: '#F9F9F9', // Light background for cards/sections
  backgroundDark: '#F0F0F0',  // Darker background for contrast
  
  // Text colors
  text: '#333333',           // Primary text color - used for main content
  textLight: '#666666',      // Secondary text color - used for less important text
  textMuted: '#999999',      // Muted text - used for placeholders, hints
  textWhite: '#FFFFFF',      // White text - used on dark backgrounds
  
  // Status colors
  success: '#388E3C',        // Success green - used for success messages
  error: '#D32F2F',          // Error red - used for error messages, validation
  warning: '#F57C00',        // Warning orange - used for warnings
  info: '#1976D2',           // Info blue - used for information messages
  
  // Border colors
  border: '#E0E0E0',         // Default border color
  borderLight: '#F0F0F0',    // Light border for subtle separation
  
  // Other colors
  disabled: '#BDBDBD',       // Disabled state color
  overlay: 'rgba(0, 0, 0, 0.5)',  // Dark overlay for modals
  shadow: 'rgba(0, 0, 0, 0.1)',   // Shadow color for depth
};

export const GRADIENTS = {
  primary: ['#86B300', '#6B8E00'],      // Primary gradient for special buttons
  secondary: ['#F5F5F5', '#FFFFFF'],    // Secondary gradient for backgrounds
};