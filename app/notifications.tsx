// app/notifications.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useDialog } from '@/contexts/DialogContext';
import { useNotifications, Notification, NotificationType } from '@/hooks/useNotifications';
import { formatDistanceToNow } from '@/utils/dateUtils';
import { NotificationListSkeleton } from '@/components/skeletons';

export default function Notifications() {
  const router = useRouter();
  const colors = useThemedColors();
  const dialog = useDialog();
  const { getNotifications, markAsRead, markAllAsRead, deleteNotification, isLoading } =
    useNotifications();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async (refresh: boolean = false) => {
    const currentPage = refresh ? 1 : page;
    const result = await getNotifications({ page: currentPage, limit: 20 });

    if (result.success && result.data) {
      const newNotifications = result.data.notifications || [];
      if (refresh) {
        setNotifications(newNotifications);
      } else {
        setNotifications(prev => [...(prev || []), ...newNotifications]);
      }
      setHasMore(result.data.page < result.data.totalPages);
      if (!refresh) {
        setPage(currentPage + 1);
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await loadNotifications(true);
    setRefreshing(false);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (result.success) {
      setNotifications(prev => (prev || []).map(n => ({ ...n, isRead: true })));
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      await markAsRead(notification.id, true);
      setNotifications(prev =>
        (prev || []).map(n => (n.id === notification.id ? { ...n, isRead: true } : n)),
      );
    }

    // Navigate if there's an action URL
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    dialog.showDestructive(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      async () => {
        const result = await deleteNotification(notificationId);
        if (result.success) {
          setNotifications(prev => (prev || []).filter(n => n.id !== notificationId));
        }
      },
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRIP_STARTED:
        return 'play-circle';
      case NotificationType.TRIP_COMPLETED:
        return 'checkmark-circle';
      case NotificationType.TRIP_CANCELLED:
        return 'close-circle';
      case NotificationType.NEXT_STEP:
        return 'footsteps';
      case NotificationType.APPROACHING_STOP:
        return 'location';
      case NotificationType.LOCATION_SHARED:
        return 'share-social';
      case NotificationType.COMMUNITY_POST:
        return 'chatbubbles';
      case NotificationType.CONTRIBUTION_APPROVED:
        return 'thumbs-up';
      case NotificationType.CONTRIBUTION_REJECTED:
        return 'thumbs-down';
      case NotificationType.SYSTEM_ALERT:
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.TRIP_STARTED:
        return '#10B981';
      case NotificationType.TRIP_COMPLETED:
        return '#3B82F6';
      case NotificationType.TRIP_CANCELLED:
        return '#EF4444';
      case NotificationType.APPROACHING_STOP:
        return '#F59E0B';
      case NotificationType.COMMUNITY_POST:
        return '#8B5CF6';
      case NotificationType.CONTRIBUTION_APPROVED:
        return '#10B981';
      case NotificationType.CONTRIBUTION_REJECTED:
        return '#EF4444';
      default:
        return colors.primary;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {isLoading && notifications.length === 0 ? (
          <NotificationListSkeleton />
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="notifications-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              {"We'll notify you about trip updates, route alerts, and community posts"}
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map(notification => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  { backgroundColor: notification.isRead ? colors.white : '#F0F9FF' },
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${getNotificationColor(notification.type)}20` },
                  ]}
                >
                  <Icon
                    name={getNotificationIcon(notification.type)}
                    size={24}
                    color={getNotificationColor(notification.type)}
                  />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        { color: colors.text },
                        !notification.isRead && styles.unreadTitle,
                      ]}
                      numberOfLines={1}
                    >
                      {notification.title}
                    </Text>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text
                    style={[styles.notificationBody, { color: colors.textMuted }]}
                    numberOfLines={2}
                  >
                    {notification.body}
                  </Text>
                  <Text style={[styles.notificationTime, { color: colors.textMuted }]}>
                    {formatDistanceToNow(notification.createdAt)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNotification(notification.id)}
                >
                  <Icon name="trash-outline" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  markAllButton: {
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 16,
  },
  notificationCardSkeleton: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 8,
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  notificationBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
});
