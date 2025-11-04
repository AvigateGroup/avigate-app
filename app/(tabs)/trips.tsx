// app/(tabs)/trips.tsx
// Trips screen with dark mode support

import { View, Text, StyleSheet } from 'react-native';
import { useThemedColors } from '../../src/hooks/useThemedColors';

export default function Trips() {
  const colors = useThemedColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>🚗 My Trips</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>View your trips</Text>
      <Text style={[styles.comingSoon, { color: colors.primary }]}>Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  comingSoon: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
  },
});