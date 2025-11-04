// app/+not-found.tsx
// 404 Not Found screen with dark mode support

import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedColors } from '../src/hooks/useThemedColors';

export default function NotFoundScreen() {
  const colors = useThemedColors();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Page not found' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.primary }]}>404</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>This screen doesn't exist.</Text>
        <Link href="/" style={[styles.link, { backgroundColor: colors.primary }]}>
          <Text style={[styles.linkText, { color: colors.textWhite }]}>Go to home screen</Text>
        </Link>
      </View>
    </>
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
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 32,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});