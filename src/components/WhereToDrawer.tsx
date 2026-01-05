// src/components/WhereToDrawer.tsx

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useCommunityService } from '@/hooks/useCommunityService';
import { useRouteService } from '@/hooks/useRouteService';
import { formatDistanceToNow } from '@/utils/dateUtils';

const { width } = Dimensions.get('window');

interface WhereToDrawerProps {
  currentAddress?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface Post {
  id: string;
  postType: string;
  title: string;
  content: string;
  author: any;
  createdAt: string;
  upvotes: number;
  commentCount: number;
}

interface SuggestedPlace {
  id: string;
  name: string;
  address: string;
  distance?: string;
  latitude: number;
  longitude: number;
  type?: string;
}

export const WhereToDrawer: React.FC<WhereToDrawerProps> = ({
  currentAddress = '',
  currentLocation,
}) => {
  const router = useRouter();
  const colors = useThemedColors();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { getFeed } = useCommunityService();
  const { getPopularRoutes } = useRouteService();

  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [suggestedPlaces, setSuggestedPlaces] = useState<SuggestedPlace[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%', '85%'], []);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />
    ),
    [],
  );

  // Load trending posts
  useEffect(() => {
    loadTrendingPosts();
  }, []);

  // Load suggested places
  useEffect(() => {
    loadSuggestedPlaces();
  }, []);

  const loadTrendingPosts = async () => {
    try {
      setLoadingPosts(true);
      const result = await getFeed({ page: 1, limit: 5 });
      if (result.success && result.data) {
        setTrendingPosts(result.data.posts || result.data);
      }
    } catch (error) {
      console.error('Error loading trending posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadSuggestedPlaces = async () => {
    try {
      setLoadingPlaces(true);
      const result = await getPopularRoutes('Port Harcourt', 6);
      if (result.success && result.data) {
        const places = result.data.map((route: any) => ({
          id: route.id,
          name: route.endLocationName || route.name,
          address: route.endAddress || route.description,
          distance: route.distance ? `${(route.distance / 1000).toFixed(1)} km` : undefined,
          latitude: route.endLat,
          longitude: route.endLng,
          type: 'landmark',
        }));
        setSuggestedPlaces(places);
      }
    } catch (error) {
      console.error('Error loading suggested places:', error);
    } finally {
      setLoadingPlaces(false);
    }
  };

  const handleSearchPress = () => {
    router.push({
      pathname: '/search',
      params: { currentAddress },
    });
  };

  const handlePlacePress = (place: SuggestedPlace) => {
    router.push({
      pathname: '/search/route-details',
      params: {
        destName: place.name,
        destAddress: place.address,
        destLat: place.latitude.toString(),
        destLng: place.longitude.toString(),
        startLat: currentLocation?.latitude?.toString(),
        startLng: currentLocation?.longitude?.toString(),
      },
    });
  };

  const handlePostPress = (postId: string) => {
    router.push(`/community/post/${postId}`);
  };

  const getPostIcon = (postType: string) => {
    switch (postType) {
      case 'traffic_update':
        return 'car-outline';
      case 'route_alert':
        return 'alert-circle-outline';
      case 'safety_concern':
        return 'shield-outline';
      case 'tip':
        return 'bulb-outline';
      default:
        return 'chatbubble-outline';
    }
  };

  const getPostColor = (postType: string) => {
    switch (postType) {
      case 'traffic_update':
        return '#F59E0B';
      case 'route_alert':
        return '#EF4444';
      case 'safety_concern':
        return '#DC2626';
      case 'tip':
        return '#10B981';
      default:
        return colors.primary;
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      backgroundStyle={{ backgroundColor: colors.white }}
    >
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Where to? Search */}
        <TouchableOpacity
          style={[styles.searchContainer, { backgroundColor: '#F3F4F6' }]}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Icon name="search" size={24} color="#6B7280" />
          <Text style={styles.searchPlaceholder}>Where to?</Text>
        </TouchableOpacity>

        {/* Service Options */}
        <View style={styles.servicesContainer}>
          <TouchableOpacity style={styles.serviceCard} onPress={handleSearchPress}>
            <View style={[styles.serviceIcon, { backgroundColor: '#000' }]}>
              <Icon name="car" size={24} color="#FFF" />
            </View>
            <Text style={styles.serviceTitle}>Rides</Text>
            <Text style={styles.serviceSubtitle}>Let's get moving</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => router.push('/trips/schedule')}
          >
            <View style={[styles.serviceIcon, { backgroundColor: '#10B981' }]}>
              <Icon name="time" size={24} color="#FFF" />
            </View>
            <Text style={styles.serviceTitle}>Schedule</Text>
            <Text style={styles.serviceSubtitle}>Book ahead</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceCard} onPress={() => router.push('/share')}>
            <View style={[styles.serviceIcon, { backgroundColor: '#F59E0B' }]}>
              <Icon name="cube" size={24} color="#FFF" />
            </View>
            <Text style={styles.serviceTitle}>Bolt Send</Text>
            <Text style={styles.serviceSubtitle}>Package deliv...</Text>
          </TouchableOpacity>
        </View>

        {/* Suggested Places */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested places</Text>
          {loadingPlaces ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.placesContainer}>
              {suggestedPlaces.slice(0, 6).map((place) => (
                <TouchableOpacity
                  key={place.id}
                  style={styles.placeCard}
                  onPress={() => handlePlacePress(place)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.placeIcon, { backgroundColor: '#F3F4F6' }]}>
                    <Icon name="location" size={20} color="#6B7280" />
                  </View>
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeName} numberOfLines={1}>
                      {place.name}
                    </Text>
                    <Text style={styles.placeAddress} numberOfLines={1}>
                      {place.address}
                    </Text>
                  </View>
                  {place.distance && (
                    <Text style={styles.placeDistance}>{place.distance}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Trending Community Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community updates</Text>
            <TouchableOpacity onPress={() => router.push('/community')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          {loadingPosts ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <View style={styles.postsContainer}>
              {trendingPosts.slice(0, 3).map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postCard}
                  onPress={() => handlePostPress(post.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.postHeader}>
                    <View
                      style={[
                        styles.postIcon,
                        { backgroundColor: `${getPostColor(post.postType)}20` },
                      ]}
                    >
                      <Icon
                        name={getPostIcon(post.postType)}
                        size={18}
                        color={getPostColor(post.postType)}
                      />
                    </View>
                    <View style={styles.postInfo}>
                      <Text style={styles.postTitle} numberOfLines={1}>
                        {post.title}
                      </Text>
                      <Text style={styles.postMeta}>
                        {post.author?.firstName || 'Anonymous'} •{' '}
                        {formatDistanceToNow(post.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.postContent} numberOfLines={2}>
                    {post.content}
                  </Text>
                  <View style={styles.postFooter}>
                    <View style={styles.postStat}>
                      <Icon name="arrow-up" size={14} color="#6B7280" />
                      <Text style={styles.postStatText}>{post.upvotes || 0}</Text>
                    </View>
                    <View style={styles.postStat}>
                      <Icon name="chatbubble-outline" size={14} color="#6B7280" />
                      <Text style={styles.postStatText}>{post.commentCount || 0}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
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
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 12,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  placesContainer: {
    gap: 12,
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  placeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  placeDistance: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  postsContainer: {
    gap: 12,
  },
  postCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  postIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postInfo: {
    flex: 1,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  postMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  postContent: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
