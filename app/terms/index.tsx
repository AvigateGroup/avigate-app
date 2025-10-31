import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Back"
          onPress={() => router.back()}
          variant="outline"
          leftIcon="arrow-back"
        />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.version}>Version 1.0 - Last Updated: October 2025</Text>
        
        <Text style={styles.text}>
          {/* Add your actual terms content here */}
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
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  text: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 16,
  },
});