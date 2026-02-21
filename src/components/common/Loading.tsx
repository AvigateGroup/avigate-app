// src/components/common/Loading.tsx

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';

interface LoadingProps {
  message?: string;
  subtitle?: string;
  icon?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  subtitle,
  icon,
  fullScreen = false,
}) => {
  const colors = useThemedColors();

  return (
    <View style={[styles.container, fullScreen && { flex: 1, backgroundColor: colors.background }]}>
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          <Icon name={icon} size={28} color={colors.primary} />
        </View>
      )}
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
      {message && <Text style={[styles.message, { color: colors.text }]}>{message}</Text>}
      {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  spinner: {
    marginBottom: 4,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
  },
});
