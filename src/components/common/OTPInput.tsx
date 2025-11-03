// src/components/common/OTPInput.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS } from '@/constants/colors';
import { APP_CONFIG } from '@/constants/config';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = APP_CONFIG.OTP_LENGTH,
  value,
  onChange,
  error,
}) => {
  const [otp, setOtp] = useState(value.split(''));
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    setOtp(value.split(''));
  }, [value]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Auto-focus next input
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => {
              inputs.current[index] = ref;
            }}
            style={[styles.input, error && styles.inputError]}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index] || ''}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 8,
    textAlign: 'center',
  },
});
