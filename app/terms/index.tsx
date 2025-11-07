// app/terms/index.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { useThemedColors } from '@/hooks/useThemedColors';

export default function TermsScreen() {
  const router = useRouter();
  const colors = useThemedColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Button
          title="Back"
          onPress={() => router.back()}
          variant="outline"
          leftIcon="arrow-back"
        />
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Terms of Service</Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>
          Version 1.0 - Last Updated: October 2025
        </Text>

        <Text style={[styles.text, { color: colors.text }]}>
          Welcome to Avigate. By using our service, you agree to these terms...
        </Text>

        {/* Add more sections */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    marginBottom: 24,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
});
