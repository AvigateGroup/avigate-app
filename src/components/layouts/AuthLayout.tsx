// src/components/layouts/AuthLayout.tsx

import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, getLogoSize } from '@/utils/responsive';

interface AuthLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, showLogo = true }) => {
  const logoSize = getLogoSize();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          {showLogo && (
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/images/avigate-logo.png')}
                style={[styles.logo, { width: logoSize, height: logoSize }]}
                resizeMode="contain"
              />
            </View>
          )}
          <View style={styles.formContent}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg, // Reduced from xxxl (40) to lg (20)
    marginBottom: SPACING.lg, // Reduced from xxl (32) to lg (20)
  },
  logo: {
    // Dynamic width and height set via inline style
  },
  formContent: {
    flex: 1,
  },
});
