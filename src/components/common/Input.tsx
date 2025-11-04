// src/components/common/OTPInput.tsx

import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS, moderateScale } from '@/utils/responsive';

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  error?: string;
  length?: number;
  containerStyle?: ViewStyle;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  error,
  length = 6,
  containerStyle,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const digits = value.split('');

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Handle paste (when multiple characters are entered at once)
    if (numericText.length > 1) {
      const pastedDigits = numericText.slice(0, length);
      onChange(pastedDigits);
      
      // Focus last filled input or first empty
      const targetIndex = Math.min(pastedDigits.length, length - 1);
      inputRefs.current[targetIndex]?.focus();
      return;
    }
    
    if (numericText.length === 0) {
      // Handle backspace
      const newDigits = [...digits];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      
      // Focus previous input
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    } else {
      // Handle single digit input
      const newDigits = [...digits];
      newDigits[index] = numericText[0];
      onChange(newDigits.join(''));
      
      // Auto-focus next input
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.input,
            digits[index] && styles.inputFilled,
            error && styles.inputError,
          ]}
          value={digits[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          maxLength={1}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          returnKeyType={index === length - 1 ? 'done' : 'next'}
          selectTextOnFocus
          blurOnSubmit={index === length - 1}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.base,
  },
  input: {
    width: moderateScale(48), // Slightly larger
    height: moderateScale(56), // Taller for better visibility
    borderRadius: BORDER_RADIUS.base,
    backgroundColor: COLORS.backgroundLight, // Light background by default
    borderWidth: 2, 
    borderColor: COLORS.border,
    fontSize: FONT_SIZES.xxl, 
    fontWeight: '700', 
    color: COLORS.text,
    textAlign: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFilled: {
    backgroundColor: COLORS.white, 
    borderColor: COLORS.primary, 
  
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
    shadowColor: COLORS.error,
  },
});