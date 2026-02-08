// src/components/OfflineBanner.tsx

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNetwork } from '@/contexts/NetworkContext';

export const OfflineBanner: React.FC = () => {
  const { isConnected } = useNetwork();
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isConnected ? -60 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
      pointerEvents={isConnected ? 'none' : 'auto'}
    >
      <View style={styles.content}>
        <Icon name="cloud-offline-outline" size={18} color="#FFFFFF" />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EF4444',
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: 8,
    zIndex: 9999,
    elevation: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
