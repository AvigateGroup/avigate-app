// app/about.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';

export default function About() {
  const router = useRouter();
  const colors = useThemedColors();

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <Icon name="navigate" size={48} color={colors.white} />
        </View>

        <Text style={[styles.appName, { color: colors.text }]}>Avigate</Text>
        <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0</Text>

        <View style={[styles.section, { backgroundColor: colors.white }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About Avigate</Text>
          <Text style={[styles.sectionText, { color: colors.textMuted }]}>
            Avigate is a community-driven navigation app that helps you find the best routes,
            share your location, and stay updated with real-time traffic and safety information.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.white }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
          <Text style={[styles.sectionText, { color: colors.textMuted }]}>
            • Smart route finding with turn-by-turn directions{'\n'}
            • Real-time location sharing{'\n'}
            • Community feed for route updates{'\n'}
            • Safety reports and alerts{'\n'}
            • Route contributions and improvements
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() => router.push('/terms')}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkButton, { borderColor: colors.border }]}
          onPress={() => router.push('/privacy')}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>Privacy Policy</Text>
        </TouchableOpacity>

        <Text style={[styles.copyright, { color: colors.textMuted }]}>
          © 2026 Avigate. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    marginBottom: 32,
  },
  section: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  linkButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  copyright: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 40,
  },
});
