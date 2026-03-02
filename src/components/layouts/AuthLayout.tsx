// src/components/layouts/AuthLayout.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedColors } from '@/hooks/useThemedColors';
import { SPACING, getLogoSize } from '@/utils/responsive';

interface AuthLayoutProps {
  children: ReactNode;
  showLogo?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, showLogo = true }) => {
  const colors = useThemedColors(); // ← Add this
  const logoSize = getLogoSize();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  logo: {
    // Dynamic width and height set via inline style
  },
  formContent: {
    flex: 1,
  },
});
