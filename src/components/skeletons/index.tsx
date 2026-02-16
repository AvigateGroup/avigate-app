// src/components/skeletons/index.tsx

import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useThemedColors } from '@/hooks/useThemedColors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Home Screen Skeleton ────────────────────────────────────────────────────

export const HomeScreenSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={[skeletonStyles.fullScreen, { backgroundColor: colors.background }]}>
      {/* Map placeholder */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.border, opacity: 0.3 }]} />

      {/* Menu button placeholder */}
      <View
        style={[
          skeletonStyles.floatingCircle,
          { top: Platform.OS === 'ios' ? 60 : 45, left: 16, backgroundColor: colors.white },
        ]}
      >
        <LoadingSkeleton width={28} height={28} borderRadius={4} />
      </View>

      {/* Notification button placeholder */}
      <View
        style={[
          skeletonStyles.floatingCircle,
          { top: Platform.OS === 'ios' ? 60 : 45, right: 16, backgroundColor: colors.white },
        ]}
      >
        <LoadingSkeleton width={24} height={24} borderRadius={12} />
      </View>

      {/* Navigate button placeholder */}
      <View
        style={[
          skeletonStyles.floatingCircle,
          { bottom: 200, right: 16, backgroundColor: colors.white },
        ]}
      >
        <LoadingSkeleton width={24} height={24} borderRadius={12} />
      </View>

      {/* Bottom drawer placeholder — matches WhereToDrawer layout */}
      <View style={[skeletonStyles.bottomDrawer, { backgroundColor: colors.white }]}>
        <View style={[skeletonStyles.handle, { backgroundColor: colors.border }]} />

        {/* Search bar */}
        <View
          style={[
            skeletonStyles.searchBar,
            { backgroundColor: '#F3F4F6', borderWidth: 0 },
          ]}
        >
          <LoadingSkeleton width={24} height={24} borderRadius={12} style={{ marginRight: 12 }} />
          <LoadingSkeleton width="40%" height={18} borderRadius={6} />
        </View>

        {/* Quick action cards */}
        <View style={skeletonStyles.quickActions}>
          {[1, 2].map((i) => (
            <View key={i} style={[skeletonStyles.quickActionCard, { backgroundColor: '#F9FAFB' }]}>
              <LoadingSkeleton width={40} height={40} borderRadius={8} style={{ marginBottom: 8 }} />
              <LoadingSkeleton width="60%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
              <LoadingSkeleton width="80%" height={12} borderRadius={4} />
            </View>
          ))}
        </View>

        {/* Popular destinations */}
        <LoadingSkeleton width="50%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
        {[1, 2, 3].map((i) => (
          <View key={i} style={skeletonStyles.recentRow}>
            <LoadingSkeleton width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <LoadingSkeleton width="50%" height={15} borderRadius={4} style={{ marginBottom: 4 }} />
              <LoadingSkeleton width="70%" height={13} borderRadius={4} />
            </View>
            <LoadingSkeleton width={40} height={13} borderRadius={4} />
          </View>
        ))}

        {/* Community updates header */}
        <View style={[skeletonStyles.statsRow, { marginTop: 20, marginBottom: 12 }]}>
          <LoadingSkeleton width="50%" height={16} borderRadius={4} />
          <LoadingSkeleton width={50} height={14} borderRadius={4} />
        </View>

        {/* Post cards */}
        {[1, 2].map((i) => (
          <View key={i} style={[skeletonStyles.drawerPostCard, { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <LoadingSkeleton width={36} height={36} borderRadius={18} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <LoadingSkeleton width="55%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
                <LoadingSkeleton width="35%" height={12} borderRadius={4} />
              </View>
            </View>
            <LoadingSkeleton width="90%" height={13} borderRadius={4} style={{ marginBottom: 4 }} />
            <LoadingSkeleton width="60%" height={13} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Route Details Skeleton ──────────────────────────────────────────────────

export const RouteDetailsSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={[skeletonStyles.fullScreen, { backgroundColor: colors.background }]}>
      {/* Map placeholder */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.border, opacity: 0.3 }]} />

      {/* Back button */}
      <View
        style={[
          skeletonStyles.floatingCircle,
          { top: Platform.OS === 'ios' ? 50 : 40, left: 16, backgroundColor: colors.white },
        ]}
      >
        <LoadingSkeleton width={24} height={24} borderRadius={4} />
      </View>

      {/* Bottom sheet */}
      <View style={[skeletonStyles.routeBottomSheet, { backgroundColor: colors.white }]}>
        <View style={[skeletonStyles.handle, { backgroundColor: colors.border }]} />

        {/* Destination name */}
        <LoadingSkeleton width="65%" height={22} borderRadius={6} style={{ marginBottom: 16 }} />

        {/* Stats row */}
        <View style={skeletonStyles.statsRow}>
          <View style={skeletonStyles.statItem}>
            <LoadingSkeleton width={20} height={20} borderRadius={10} style={{ marginRight: 8 }} />
            <LoadingSkeleton width={60} height={16} borderRadius={4} />
          </View>
          <View style={skeletonStyles.statItem}>
            <LoadingSkeleton width={20} height={20} borderRadius={10} style={{ marginRight: 8 }} />
            <LoadingSkeleton width={50} height={16} borderRadius={4} />
          </View>
          <View style={skeletonStyles.statItem}>
            <LoadingSkeleton width={20} height={20} borderRadius={10} style={{ marginRight: 8 }} />
            <LoadingSkeleton width={70} height={16} borderRadius={4} />
          </View>
        </View>

        {/* Start button placeholder */}
        <LoadingSkeleton width="100%" height={52} borderRadius={12} style={{ marginTop: 20, marginBottom: 20 }} />

        {/* Steps header */}
        <View style={[skeletonStyles.statsRow, { marginBottom: 16 }]}>
          <LoadingSkeleton width="30%" height={18} borderRadius={4} />
          <LoadingSkeleton width={60} height={24} borderRadius={12} />
        </View>

        {/* Step items */}
        {[1, 2, 3].map((i) => (
          <View key={i} style={skeletonStyles.stepRow}>
            <LoadingSkeleton width={32} height={32} borderRadius={16} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <LoadingSkeleton width="80%" height={15} borderRadius={4} style={{ marginBottom: 8 }} />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <LoadingSkeleton width={60} height={24} borderRadius={8} />
                <LoadingSkeleton width={40} height={14} borderRadius={4} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Community Feed Skeleton ─────────────────────────────────────────────────

export const CommunityFeedSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={[skeletonStyles.listContainer, { backgroundColor: colors.background }]}>
      {/* Settings row */}
      <View style={[skeletonStyles.feedHeaderCard, { backgroundColor: colors.white }]}>
        <View style={skeletonStyles.statsRow}>
          <View style={skeletonStyles.statItem}>
            <LoadingSkeleton width={24} height={24} borderRadius={12} style={{ marginRight: 8 }} />
            <LoadingSkeleton width={120} height={16} borderRadius={4} />
          </View>
          <LoadingSkeleton width={44} height={24} borderRadius={12} />
        </View>

        {/* Contribute CTA */}
        <LoadingSkeleton width="100%" height={64} borderRadius={12} style={{ marginTop: 12 }} />

        {/* Filter pills */}
        <View style={[skeletonStyles.filterRow, { marginTop: 12 }]}>
          {[40, 90, 80, 95, 35].map((w, i) => (
            <LoadingSkeleton key={i} width={w} height={30} borderRadius={15} />
          ))}
        </View>
      </View>

      {/* Post card skeletons */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={[skeletonStyles.postCard, { backgroundColor: colors.white }]}>
          {/* Author header */}
          <View style={skeletonStyles.postHeader}>
            <LoadingSkeleton width={40} height={40} borderRadius={20} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <LoadingSkeleton width="45%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
              <LoadingSkeleton width="25%" height={12} borderRadius={4} />
            </View>
            <LoadingSkeleton width={24} height={24} borderRadius={4} />
          </View>

          {/* Title + content */}
          <LoadingSkeleton width="85%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
          <LoadingSkeleton width="100%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
          <LoadingSkeleton width="65%" height={14} borderRadius={4} style={{ marginBottom: 12 }} />

          {/* Actions row */}
          <View style={[skeletonStyles.actionsRow, { borderTopColor: colors.border }]}>
            {[1, 2, 3, 4].map((j) => (
              <LoadingSkeleton key={j} width={36} height={20} borderRadius={4} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

// ─── Active Trip Skeleton ────────────────────────────────────────────────────

export const ActiveTripSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={[skeletonStyles.fullScreen, { backgroundColor: colors.background }]}>
      {/* Map placeholder */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.border, opacity: 0.3 }]} />

      {/* Trip info bar at top */}
      <View
        style={[
          skeletonStyles.tripInfoBar,
          { backgroundColor: colors.white, top: Platform.OS === 'ios' ? 50 : 35 },
        ]}
      >
        <LoadingSkeleton width={24} height={24} borderRadius={4} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <LoadingSkeleton width="60%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
          <LoadingSkeleton width="40%" height={12} borderRadius={4} />
        </View>
      </View>

      {/* Bottom sheet with steps */}
      <View style={[skeletonStyles.tripBottomSheet, { backgroundColor: colors.white }]}>
        <View style={[skeletonStyles.handle, { backgroundColor: colors.border }]} />

        {/* Current step highlight */}
        <View style={[skeletonStyles.currentStepCard, { backgroundColor: colors.background }]}>
          <LoadingSkeleton width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <LoadingSkeleton width="35%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
            <LoadingSkeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <LoadingSkeleton width={60} height={12} borderRadius={4} />
              <LoadingSkeleton width={50} height={12} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* Trip progress */}
        <LoadingSkeleton width="100%" height={4} borderRadius={2} style={{ marginVertical: 16 }} />

        {/* Upcoming steps */}
        {[1, 2].map((i) => (
          <View key={i} style={skeletonStyles.upcomingStep}>
            <LoadingSkeleton width={28} height={28} borderRadius={14} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <LoadingSkeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
              <LoadingSkeleton width="45%" height={12} borderRadius={4} />
            </View>
          </View>
        ))}

        {/* Action buttons */}
        <View style={[skeletonStyles.statsRow, { marginTop: 16 }]}>
          <LoadingSkeleton width="48%" height={44} borderRadius={10} />
          <LoadingSkeleton width="48%" height={44} borderRadius={10} />
        </View>
      </View>
    </View>
  );
};

// ─── Device Card Skeleton ────────────────────────────────────────────────────

export const DeviceCardSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={{ padding: 16 }}>
      <LoadingSkeleton width="30%" height={18} borderRadius={4} style={{ marginBottom: 4 }} />
      <LoadingSkeleton width="70%" height={14} borderRadius={4} style={{ marginBottom: 16 }} />

      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[skeletonStyles.deviceCard, { backgroundColor: colors.white }]}
        >
          <View
            style={[skeletonStyles.deviceIconBox, { backgroundColor: colors.background }]}
          >
            <LoadingSkeleton width={24} height={24} borderRadius={4} />
          </View>
          <View style={{ flex: 1 }}>
            <LoadingSkeleton width="55%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
            <LoadingSkeleton width="40%" height={12} borderRadius={4} style={{ marginBottom: 4 }} />
            <LoadingSkeleton width="50%" height={11} borderRadius={4} />
          </View>
          <LoadingSkeleton width={24} height={24} borderRadius={12} />
        </View>
      ))}
    </View>
  );
};

// ─── Notification Card Skeleton ──────────────────────────────────────────────

export const NotificationCardSkeleton: React.FC = () => {
  const colors = useThemedColors();

  return (
    <View style={[skeletonStyles.notificationCard, { backgroundColor: colors.white }]}>
      <LoadingSkeleton width={48} height={48} borderRadius={24} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <LoadingSkeleton width="70%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
        <LoadingSkeleton width="90%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
        <LoadingSkeleton width="40%" height={12} borderRadius={4} />
      </View>
    </View>
  );
};

export const NotificationListSkeleton: React.FC = () => (
  <View style={{ padding: 16 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <NotificationCardSkeleton key={i} />
    ))}
  </View>
);

// ─── Styles ──────────────────────────────────────────────────────────────────

const skeletonStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  floatingCircle: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerPostCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  routeBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  feedHeaderCard: {
    padding: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  postCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  tripInfoBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  tripBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  currentStepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  upcomingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  deviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
});
