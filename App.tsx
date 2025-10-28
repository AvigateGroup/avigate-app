// App.tsx

import React from 'react';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/store/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/colors';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.background} 
      />
      <AppNavigator />
      <Toast />
    </AuthProvider>
  );
};

export default App;