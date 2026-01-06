// src/components/common/Input.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZES, LINE_HEIGHTS, BORDER_RADIUS } from '@/utils/responsive';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  // Shake animation
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  // Trigger shake animation when error appears
  useEffect(() => {
    if (error && error.trim()) {
      // Shake animation sequence
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          { transform: [{ translateX: shakeAnimation }] }, // Apply shake animation
        ]}
      >
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? COLORS.primary : COLORS.textMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
          placeholderTextColor={COLORS.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.rightIcon}>
            <Icon
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isFocused ? COLORS.primary : COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Icon
              name={rightIcon}
              size={20}
              color={isFocused ? COLORS.primary : COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && error.trim() && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: BORDER_RADIUS.base,
    backgroundColor: COLORS.backgroundLight,
    minHeight: 48,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    fontSize: FONT_SIZES.md,
    lineHeight: LINE_HEIGHTS.md,
    color: COLORS.text,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.sm,
  },
  leftIcon: {
    marginLeft: SPACING.md,
  },
  rightIcon: {
    padding: SPACING.md,
  },
  error: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
    lineHeight: LINE_HEIGHTS.xs,
  },
});
