// src/components/SimpleWhereToDrawer.tsx

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks/useThemedColors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SimpleWhereToDrawerProps {
  currentAddress?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export const SimpleWhereToDrawer: React.FC<SimpleWhereToDrawerProps> = ({
  currentAddress = '',
}) => {
  const router = useRouter();
  const colors = useThemedColors();
  const pan = useRef(new Animated.Value(0)).current;

  console.log('✅ SimpleWhereToDrawer rendering');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Collapse
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSearchPress = () => {
    router.push({
      pathname: '/search',
      params: { currentAddress },
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.white,
          transform: [{ translateY: pan }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* Handle Indicator */}
      <View style={styles.handleContainer}>
        <View style={[styles.handle, { backgroundColor: colors.textMuted }]} />
      </View>

      {/* Where to? Search */}
      <TouchableOpacity
        style={[styles.searchContainer, { backgroundColor: '#F3F4F6' }]}
        onPress={handleSearchPress}
        activeOpacity={0.7}
      >
        <Icon name="search" size={24} color="#6B7280" />
        <Text style={styles.searchPlaceholder}>Where to?</Text>
        <View style={styles.laterButton}>
          <Icon name="time-outline" size={20} color="#374151" />
          <Text style={styles.laterButtonText}>Later</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.servicesContainer}>
        <TouchableOpacity style={styles.serviceCard} onPress={handleSearchPress}>
          <View style={[styles.serviceIcon, { backgroundColor: '#86B300' }]}>
            <Icon name="navigate" size={24} color="#FFF" />
          </View>
          <Text style={styles.serviceTitle}>Find Route</Text>
          <Text style={styles.serviceSubtitle}>Navigate now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serviceCard}
          onPress={() => router.push('/community')}
        >
          <View style={[styles.serviceIcon, { backgroundColor: '#3B82F6' }]}>
            <Icon name="people" size={24} color="#FFF" />
          </View>
          <Text style={styles.serviceTitle}>Community</Text>
          <Text style={styles.serviceSubtitle}>Safety updates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.serviceCard}
          onPress={() => router.push('/community/contribute')}
        >
          <View style={[styles.serviceIcon, { backgroundColor: '#10B981' }]}>
            <Icon name="add-circle" size={24} color="#FFF" />
          </View>
          <Text style={styles.serviceTitle}>Contribute</Text>
          <Text style={styles.serviceSubtitle}>Share routes</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 100,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 12,
    fontWeight: '500',
  },
  laterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  laterButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});
