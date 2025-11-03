// App.tsx
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { Slot } from 'expo-router';

export default function App() {
  return <Slot />;
}

registerRootComponent(App);
