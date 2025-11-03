// app/(tabs)/trips.tsx
// Trips screen - View ride history and upcoming trips

import { View, Text, StyleSheet } from 'react-native';
import { commonStyles } from '../../src/styles';
import { COLORS } from '../../src/constants/colors';

export default function Trips() {
  return (
    <View style={commonStyles.centeredContainer}>
      <Text style={styles.title}>🚗 My Trips</Text>
      <Text style={commonStyles.bodyTextLight}>View your trips</Text>
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
