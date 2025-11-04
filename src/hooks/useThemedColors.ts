// src/hooks/useThemedColors.ts

import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/constants/colors';

/**
 * Custom hook to get themed colors
 * Returns colors object based on current theme (light/dark)
 * 
 * Usage:
 * const colors = useThemedColors();
 * <View style={{ backgroundColor: colors.background }} />
 */
export const useThemedColors = () => {
  const { isDark } = useTheme();
  
  return useMemo(() => getColors(isDark), [isDark]);
};