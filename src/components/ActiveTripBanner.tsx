// src/components/ActiveTripBanner.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useDialog } from '@/contexts/DialogContext';

interface ActiveTripBannerProps {
  trip: {
    id: string;
    status: string;
    estimatedArrival: string | Date;
    route: {
      name: string;
      estimatedDuration: number;
      endLocation?: { name?: string };
    };
  };
  onCancelTrip: (tripId: string) => Promise<void>;
}

export const ActiveTripBanner: React.FC<ActiveTripBannerProps> = ({ trip, onCancelTrip }) => {
  const colors = useThemedColors();
  const router = useRouter();
  const dialog = useDialog();

  const destinationName =
    trip.route.endLocation?.name || trip.route.name || 'your destination';

  const formatETA = () => {
    if (!trip.estimatedArrival) return 'Calculating...';
    const now = new Date();
    const arrival = new Date(trip.estimatedArrival);
    if (isNaN(arrival.getTime())) return 'Calculating...';
    const diffMinutes = Math.max(0, Math.floor((arrival.getTime() - now.getTime()) / 60000));
    if (diffMinutes < 1) return 'Arriving now';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleResume = () => {
    router.push('/trips/active');
  };

  const handleCancel = () => {
    dialog.showDestructive(
      'Cancel Trip',
      `Are you sure you want to cancel your trip to ${destinationName}?`,
      async () => {
        await onCancelTrip(trip.id);
      },
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.header}>
        <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
        <Text style={[styles.statusText, { color: colors.success }]}>Trip in Progress</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.destinationRow}>
          <Icon name="location" size={20} color={colors.primary} />
          <Text style={[styles.destinationText, { color: colors.text }]} numberOfLines={1}>
            {destinationName}
          </Text>
        </View>

        <View style={styles.etaRow}>
          <Icon name="time-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.etaText, { color: colors.textMuted }]}>
            ETA: {formatETA()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: colors.error }]}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Icon name="close" size={18} color={colors.error} />
          <Text style={[styles.cancelText, { color: colors.error }]}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resumeButton, { backgroundColor: colors.primary }]}
          onPress={handleResume}
          activeOpacity={0.7}
        >
          <Icon name="navigate" size={18} color="#FFFFFF" />
          <Text style={styles.resumeText}>Resume Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    marginBottom: 12,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 28,
  },
  etaText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resumeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resumeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
