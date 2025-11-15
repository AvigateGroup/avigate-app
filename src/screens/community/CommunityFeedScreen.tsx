// src/screens/community/CommunityFeedScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useCommunityService } from '@/hooks/useCommunityService';
import { useAuth } from '@/store/AuthContext';
import { communityStyles } from '@/styles/features';

interface FeedPost {
  id: string;
  postType: 'traffic_update' | 'route_alert' | 'safety_concern' | 'tip' | 'general';
  title: string;
  content: string;
  author: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  location?: {
    name: string;
  };
  images: string[];
  upvotes: number;
  downvotes: number;
  isVerified: boolean;
  createdAt: string;
}

export const CommunityFeedScreen = () => {
  const router = useRouter();
  const colors = useThemedColors();
  const { user } = useAuth();
  const { getFeed, toggleRealTimeUpdates, isLoading } = useCommunityService();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadPosts();
  }, [filterType]);

  const loadPosts = async (isRefresh = false) => {
    if (isLoading) return;

    const currentPage = isRefresh ? 1 : page;
    const result = await getFeed({
      page: currentPage,
      limit: 20,
      postType: filterType === 'all' ? undefined : filterType,
    });

    if (result.success) {
      if (isRefresh) {
        setPosts(result.data.posts);
        setPage(1);
      } else {
        setPosts([...posts, ...result.data.posts]);
      }
      setHasMore(result.data.pagination.page < result.data.pagination.pages);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(page + 1);
      loadPosts();
    }
  };

  const handleToggleRealTime = async (enabled: boolean) => {
    setRealTimeEnabled(enabled);
    await toggleRealTimeUpdates(enabled);
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic_update':
        return 'car-outline';
      case 'route_alert':
        return 'warning-outline';
      case 'safety_concern':
        return 'shield-outline';
      case 'tip':
        return 'bulb-outline';
      default:
        return 'chatbubble-outline';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'traffic_update':
        return colors.warning;
      case 'route_alert':
        return colors.error;
      case 'safety_concern':
        return colors.error;
      case 'tip':
        return colors.info;
      default:
        return colors.text;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const renderPost = ({ item }: { item: FeedPost }) => (
    <TouchableOpacity
      style={[communityStyles.postCard, { backgroundColor: colors.white }]}
      onPress={() => router.push(`/community/post/${item.id}`)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={communityStyles.postHeader}>
        <View style={communityStyles.authorInfo}>
          {item.author.profilePicture ? (
            <Image
              source={{ uri: item.author.profilePicture }}
              style={communityStyles.authorAvatar}
            />
          ) : (
            <View
              style={[
                communityStyles.authorAvatarPlaceholder,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Text style={communityStyles.authorInitials}>
                {item.author.firstName[0]}
                {item.author.lastName[0]}
              </Text>
            </View>
          )}
          <View style={communityStyles.authorDetails}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[communityStyles.authorName, { color: colors.text }]}>
                {item.author.firstName} {item.author.lastName}
              </Text>
              {item.isVerified && (
                <Icon
                  name="checkmark-circle"
                  size={16}
                  color={colors.success}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text style={[communityStyles.postTime, { color: colors.textMuted }]}>
              {formatTimeAgo(item.createdAt)}
            </Text>
          </View>
        </View>
        <Icon
          name={getPostTypeIcon(item.postType)}
          size={24}
          color={getPostTypeColor(item.postType)}
        />
      </View>

      {/* Content */}
      <Text style={[communityStyles.postTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[communityStyles.postContent, { color: colors.textMuted }]} numberOfLines={3}>
        {item.content}
      </Text>

      {/* Location */}
      {item.location && (
        <View style={communityStyles.postLocation}>
          <Icon name="location-outline" size={16} color={colors.primary} />
          <Text style={[communityStyles.locationText, { color: colors.primary }]}>
            {item.location.name}
          </Text>
        </View>
      )}

      {/* Images */}
      {item.images && item.images.length > 0 && (
        <Image
          source={{ uri: item.images[0] }}
          style={communityStyles.postImage}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View style={[communityStyles.postActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={communityStyles.actionButton}>
          <Icon name="arrow-up-outline" size={20} color={colors.success} />
          <Text style={[communityStyles.actionText, { color: colors.text }]}>{item.upvotes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={communityStyles.actionButton}>
          <Icon name="arrow-down-outline" size={20} color={colors.error} />
          <Text style={[communityStyles.actionText, { color: colors.text }]}>{item.downvotes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={communityStyles.actionButton}>
          <Icon name="chatbubble-outline" size={20} color={colors.textMuted} />
          <Text style={[communityStyles.actionText, { color: colors.text }]}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={communityStyles.actionButton}>
          <Icon name="share-outline" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={[communityStyles.feedHeader, { backgroundColor: colors.white }]}>
      {/* Real-time toggle */}
      <View style={communityStyles.settingRow}>
        <View style={communityStyles.settingInfo}>
          <Icon name="notifications-outline" size={24} color={colors.primary} />
          <Text style={[communityStyles.settingText, { color: colors.text }]}>
            Real-time Updates
          </Text>
        </View>
        <Switch
          value={realTimeEnabled}
          onValueChange={handleToggleRealTime}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={realTimeEnabled ? colors.primary : colors.disabled}
        />
      </View>

      {/* Filter buttons */}
      <View style={communityStyles.filterContainer}>
        {['all', 'traffic_update', 'route_alert', 'safety_concern', 'tip'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              communityStyles.filterButton,
              {
                backgroundColor: filterType === type ? colors.primary : colors.backgroundLight,
                borderColor: filterType === type ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilterType(type)}
          >
            <Text
              style={[
                communityStyles.filterButtonText,
                { color: filterType === type ? colors.textWhite : colors.text },
              ]}
            >
              {type.replace('_', ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[communityStyles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ padding: 20 }} />
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={communityStyles.emptyState}>
              <Icon name="chatbubbles-outline" size={64} color={colors.textMuted} />
              <Text style={[communityStyles.emptyText, { color: colors.text }]}>No posts yet</Text>
              <Text style={[communityStyles.emptySubtext, { color: colors.textMuted }]}>
                Be the first to share an update!
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB for creating post */}
      <TouchableOpacity
        style={[communityStyles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/community/create-post')}
        activeOpacity={0.8}
      >
        <Icon name="add" size={28} color={colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
};
