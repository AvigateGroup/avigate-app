// app/support.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';

export default function Support() {
  const router = useRouter();
  const colors = useThemedColors();

  const handleBack = () => {
    router.back();
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@avigate.app');
  };

  const supportOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      subtitle: 'support@avigate.app',
      onPress: handleContactSupport,
    },
    {
      icon: 'chatbubbles-outline',
      title: 'FAQ',
      subtitle: 'Frequently asked questions',
      onPress: () => {},
    },
    {
      icon: 'document-text-outline',
      title: 'User Guide',
      subtitle: 'How to use Avigate',
      onPress: () => {},
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Support</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {supportOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionItem, { backgroundColor: colors.white }]}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: colors.background }]}>
              <Icon name={option.icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>
                {option.subtitle}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
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
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
  },
});
