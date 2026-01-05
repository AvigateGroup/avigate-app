// src/components/LoadingSkeleton.tsx

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PlaceCardSkeleton: React.FC = () => (
  <View style={styles.placeCardSkeleton}>
    <LoadingSkeleton width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <LoadingSkeleton width="60%" height={16} style={{ marginBottom: 6 }} />
      <LoadingSkeleton width="80%" height={14} />
    </View>
    <LoadingSkeleton width={50} height={14} />
  </View>
);

export const PostCardSkeleton: React.FC = () => (
  <View style={styles.postCardSkeleton}>
    <View style={styles.postHeaderSkeleton}>
      <LoadingSkeleton width={36} height={36} borderRadius={18} style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <LoadingSkeleton width="50%" height={14} style={{ marginBottom: 4 }} />
        <LoadingSkeleton width="30%" height={12} />
      </View>
    </View>
    <LoadingSkeleton width="100%" height={14} style={{ marginBottom: 4 }} />
    <LoadingSkeleton width="80%" height={14} style={{ marginBottom: 8 }} />
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <LoadingSkeleton width={40} height={12} />
      <LoadingSkeleton width={40} height={12} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  placeCardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  postCardSkeleton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
