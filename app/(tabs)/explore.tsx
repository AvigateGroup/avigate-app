// app/(tabs)/explore.tsx
// Explore screen - Browse available rides/locations

import { View, Text, StyleSheet } from 'react-native';
import { commonStyles } from '../../src/styles';
import { COLORS } from '../../src/constants/colors';

export default function Explore() {
  return (
    <View style={commonStyles.centeredContainer}>
      <Text style={styles.title}>🔍 Explore</Text>
      <Text style={commonStyles.bodyTextLight}>Discover new destinations</Text>
      <Text style={styles.comingSoon}>Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  comingSoon: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 24,
  },
});
