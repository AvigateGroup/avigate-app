// app/trips/_layout.tsx

import { Stack } from 'expo-router';

export default function TripsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="active" />
    </Stack>
  );
}
