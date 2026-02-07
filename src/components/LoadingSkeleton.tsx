// src/components/LoadingSkeleton.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemedColors } from '@/hooks/useThemedColors';

interface LoadingSkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const colors = useThemedColors();
  const translateX = useSharedValue(-1);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 200 }],
  }));

  const baseColor = colors.border;
  const highlightColor = colors.background;

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { width: '150%', left: '-25%' },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[baseColor, highlightColor, baseColor]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const PlaceCardSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={[styles.placeCardSkeleton, { borderBottomColor: colors.border }]}>
      <LoadingSkeleton width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <LoadingSkeleton width="60%" height={16} style={{ marginBottom: 6 }} />
        <LoadingSkeleton width="80%" height={14} />
      </View>
      <LoadingSkeleton width={50} height={14} />
    </View>
  );
};

export const PostCardSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={[styles.postCardSkeleton, { backgroundColor: colors.white, borderColor: colors.border }]}>
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
};

const styles = StyleSheet.create({
  placeCardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  postCardSkeleton: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  postHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
