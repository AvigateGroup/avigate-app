// src/screens/community/CommunityPostDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useCommunityService } from '@/hooks/useCommunityService';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/common/Button';
import { communityStyles } from '@/styles/features';

interface Post {
  id: string;
  postType: 'traffic_update' | 'route_alert' | 'safety_concern' | 'tip' | 'general';
  title: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    reputationScore?: number;
  };
  location?: {
    id: string;
    name: string;
  };
  route?: {
    id: string;
    name: string;
  };
  images: string[];
  upvotes: number;
  downvotes: number;
  commentCount: number;
  isVerified: boolean;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    reputationScore?: number;
  };
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  createdAt: string;
}

export const CommunityPostDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const postId = params.id as string;
  const colors = useThemedColors();
  const { user } = useAuth();
  const { 
    getPostById, 
    votePost, 
    getComments, 
    addComment, 
    voteComment,
    deletePost,
    reportPost,
    isLoading 
  } = useCommunityService();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    const [postResult, commentsResult] = await Promise.all([
      getPostById(postId),
      getComments(postId),
    ]);

    if (postResult.success && postResult.data) {
      setPost(postResult.data.post);
    }

    if (commentsResult.success && commentsResult.data) {
      setComments(commentsResult.data.comments);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPostData();
    setRefreshing(false);
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!post) return;

    const result = await votePost(post.id, voteType);
    
    if (result.success) {
      // Update local state
      setPost(prev => {
        if (!prev) return prev;
        
        const wasUpvoted = prev.userVote === 'up';
        const wasDownvoted = prev.userVote === 'down';
        
        let upvotes = prev.upvotes;
        let downvotes = prev.downvotes;
        
        if (voteType === 'up') {
          if (wasUpvoted) {
            upvotes -= 1;
            return { ...prev, upvotes, userVote: null };
          } else {
            upvotes += 1;
            if (wasDownvoted) downvotes -= 1;
            return { ...prev, upvotes, downvotes, userVote: 'up' };
          }
        } else {
          if (wasDownvoted) {
            downvotes -= 1;
            return { ...prev, downvotes, userVote: null };
          } else {
            downvotes += 1;
            if (wasUpvoted) upvotes -= 1;
            return { ...prev, upvotes, downvotes, userVote: 'down' };
          }
        }
      });
    }
  };

  const handleVoteComment = async (commentId: string, voteType: 'up' | 'down') => {
    const result = await voteComment(commentId, voteType);
    
    if (result.success) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          const wasUpvoted = comment.userVote === 'up';
          const wasDownvoted = comment.userVote === 'down';
          
          let upvotes = comment.upvotes;
          let downvotes = comment.downvotes;
          
          if (voteType === 'up') {
            if (wasUpvoted) {
              upvotes -= 1;
              return { ...comment, upvotes, userVote: null };
            } else {
              upvotes += 1;
              if (wasDownvoted) downvotes -= 1;
              return { ...comment, upvotes, downvotes, userVote: 'up' as const };
            }
          } else {
            if (wasDownvoted) {
              downvotes -= 1;
              return { ...comment, downvotes, userVote: null };
            } else {
              downvotes += 1;
              if (wasUpvoted) upvotes -= 1;
              return { ...comment, upvotes, downvotes, userVote: 'down' as const };
            }
          }
        }
        return comment;
      }));
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const result = await addComment(postId, commentText.trim());
    
    if (result.success && result.data) {
      setComments([result.data.comment, ...comments]);
      setCommentText('');
      
      // Update comment count
      setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev);
    } else {
      Alert.alert('Error', result.error || 'Failed to add comment');
    }
    
    setIsSubmitting(false);
  };

  const handleShare = async () => {
    // Implement share functionality
    Alert.alert('Share', 'Share functionality coming soon');
  };

  const handleReport = async () => {
    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Spam', onPress: () => submitReport('spam') },
        { text: 'Inappropriate', onPress: () => submitReport('inappropriate') },
        { text: 'Misinformation', onPress: () => submitReport('misinformation') },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const submitReport = async (reason: string) => {
    const result = await reportPost(postId, reason);
    
    if (result.success) {
      Alert.alert('Success', 'Post reported. Thank you for helping keep Avigate safe.');
    } else {
      Alert.alert('Error', 'Failed to report post');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePost(postId);
            if (result.success) {
              router.back();
            } else {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
        },
      ],
    );
  };

  const showMoreOptions = () => {
    const isOwner = post?.author.id === user?.id;
    
    const options = isOwner
      ? [
          { text: 'Edit Post', onPress: () => router.push(`/community/edit-post/${postId}`) },
          { text: 'Delete Post', onPress: handleDelete, style: 'destructive' },
          { text: 'Cancel', style: 'cancel' },
        ]
      : [
          { text: 'Report Post', onPress: handleReport },
          { text: 'Cancel', style: 'cancel' },
        ];

    Alert.alert('Post Options', undefined, options as any);
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'traffic_update': return 'car-outline';
      case 'route_alert': return 'warning-outline';
      case 'safety_concern': return 'shield-outline';
      case 'tip': return 'bulb-outline';
      default: return 'chatbubble-outline';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'traffic_update': return colors.warning;
      case 'route_alert': return colors.error;
      case 'safety_concern': return colors.error;
      case 'tip': return colors.info;
      default: return colors.text;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment: Comment) => (
    <View 
      key={comment.id} 
      style={[communityStyles.commentCard, { backgroundColor: colors.white }]}
    >
      <View style={communityStyles.commentHeader}>
        {comment.author.profilePicture ? (
          <Image
            source={{ uri: comment.author.profilePicture }}
            style={communityStyles.commentAvatar}
          />
        ) : (
          <View
            style={[
              communityStyles.commentAvatarPlaceholder,
              { backgroundColor: colors.primaryLight },
            ]}
          >
            <Text style={communityStyles.commentInitials}>
              {comment.author.firstName[0]}{comment.author.lastName[0]}
            </Text>
          </View>
        )}
        
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={[communityStyles.commentAuthor, { color: colors.text }]}>
              {comment.author.firstName} {comment.author.lastName}
            </Text>
            {comment.author.reputationScore && comment.author.reputationScore > 50 && (
              <View style={[communityStyles.reputationBadge, { backgroundColor: colors.warningLight }]}>
                <Icon name="star" size={10} color={colors.warning} />
                <Text style={[communityStyles.reputationText, { color: colors.warning }]}>
                  {comment.author.reputationScore}
                </Text>
              </View>
            )}
          </View>
          <Text style={[communityStyles.commentTime, { color: colors.textMuted }]}>
            {formatTimeAgo(comment.createdAt)}
          </Text>
        </View>
      </View>

      <Text style={[communityStyles.commentContent, { color: colors.text }]}>
        {comment.content}
      </Text>

      <View style={communityStyles.commentActions}>
        <TouchableOpacity 
          style={communityStyles.commentActionButton}
          onPress={() => handleVoteComment(comment.id, 'up')}
        >
          <Icon 
            name={comment.userVote === 'up' ? 'arrow-up' : 'arrow-up-outline'} 
            size={16} 
            color={comment.userVote === 'up' ? colors.success : colors.textMuted} 
          />
          <Text style={[
            communityStyles.commentActionText, 
            { color: comment.userVote === 'up' ? colors.success : colors.textMuted }
          ]}>
            {comment.upvotes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={communityStyles.commentActionButton}
          onPress={() => handleVoteComment(comment.id, 'down')}
        >
          <Icon 
            name={comment.userVote === 'down' ? 'arrow-down' : 'arrow-down-outline'} 
            size={16} 
            color={comment.userVote === 'down' ? colors.error : colors.textMuted} 
          />
          <Text style={[
            communityStyles.commentActionText, 
            { color: comment.userVote === 'down' ? colors.error : colors.textMuted }
          ]}>
            {comment.downvotes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading || !post) {
    return (
      <View style={[communityStyles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[communityStyles.detailHeader, { backgroundColor: colors.white }]}>
        <TouchableOpacity onPress={() => router.back()} style={communityStyles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[communityStyles.headerTitle, { color: colors.text }]}>Post</Text>
        <TouchableOpacity onPress={showMoreOptions} style={communityStyles.moreButton}>
          <Icon name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={communityStyles.detailContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <ActivityIndicator animating={refreshing} color={colors.primary} />
        }
      >
        {/* Post Content */}
        <View style={[communityStyles.postDetailCard, { backgroundColor: colors.white }]}>
          {/* Author Info */}
          <View style={communityStyles.postHeader}>
            <View style={communityStyles.authorInfo}>
              {post.author.profilePicture ? (
                <Image
                  source={{ uri: post.author.profilePicture }}
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
                    {post.author.firstName[0]}{post.author.lastName[0]}
                  </Text>
                </View>
              )}
              <View style={communityStyles.authorDetails}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[communityStyles.authorName, { color: colors.text }]}>
                    {post.author.firstName} {post.author.lastName}
                  </Text>
                  {post.isVerified && (
                    <Icon name="checkmark-circle" size={16} color={colors.success} />
                  )}
                  {post.author.reputationScore && post.author.reputationScore > 50 && (
                    <View style={[communityStyles.reputationBadge, { backgroundColor: colors.warningLight }]}>
                      <Icon name="star" size={12} color={colors.warning} />
                      <Text style={[communityStyles.reputationText, { color: colors.warning }]}>
                        {post.author.reputationScore}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[communityStyles.postTime, { color: colors.textMuted }]}>
                  {formatTimeAgo(post.createdAt)}
                </Text>
              </View>
            </View>
            <View style={[communityStyles.postTypeBadge, { backgroundColor: getPostTypeColor(post.postType) + '20' }]}>
              <Icon name={getPostTypeIcon(post.postType)} size={20} color={getPostTypeColor(post.postType)} />
            </View>
          </View>

          {/* Title & Content */}
          <Text style={[communityStyles.postDetailTitle, { color: colors.text }]}>
            {post.title}
          </Text>
          <Text style={[communityStyles.postDetailContent, { color: colors.text }]}>
            {post.content}
          </Text>

          {/* Location/Route */}
          {post.location && (
            <View style={communityStyles.postLocation}>
              <Icon name="location-outline" size={16} color={colors.primary} />
              <Text style={[communityStyles.locationText, { color: colors.primary }]}>
                {post.location.name}
              </Text>
            </View>
          )}

          {post.route && (
            <View style={communityStyles.postLocation}>
              <Icon name="git-branch-outline" size={16} color={colors.info} />
              <Text style={[communityStyles.locationText, { color: colors.info }]}>
                {post.route.name}
              </Text>
            </View>
          )}

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <View style={communityStyles.imagesContainer}>
              {post.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={communityStyles.postDetailImage}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={[communityStyles.postActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={communityStyles.actionButton}
              onPress={() => handleVote('up')}
            >
              <Icon 
                name={post.userVote === 'up' ? 'arrow-up' : 'arrow-up-outline'} 
                size={22} 
                color={post.userVote === 'up' ? colors.success : colors.textMuted} 
              />
              <Text style={[
                communityStyles.actionText, 
                { color: post.userVote === 'up' ? colors.success : colors.text }
              ]}>
                {post.upvotes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={communityStyles.actionButton}
              onPress={() => handleVote('down')}
            >
              <Icon 
                name={post.userVote === 'down' ? 'arrow-down' : 'arrow-down-outline'} 
                size={22} 
                color={post.userVote === 'down' ? colors.error : colors.textMuted} 
              />
              <Text style={[
                communityStyles.actionText, 
                { color: post.userVote === 'down' ? colors.error : colors.text }
              ]}>
                {post.downvotes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={communityStyles.actionButton}>
              <Icon name="chatbubble" size={20} color={colors.primary} />
              <Text style={[communityStyles.actionText, { color: colors.text }]}>
                {post.commentCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={communityStyles.actionButton} onPress={handleShare}>
              <Icon name="share-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={communityStyles.commentsSection}>
          <Text style={[communityStyles.commentsTitle, { color: colors.text }]}>
            Comments ({comments.length})
          </Text>
          
          {comments.map(renderComment)}

          {comments.length === 0 && (
            <View style={communityStyles.noComments}>
              <Icon name="chatbubbles-outline" size={48} color={colors.textMuted} />
              <Text style={[communityStyles.noCommentsText, { color: colors.textMuted }]}>
                No comments yet
              </Text>
              <Text style={[communityStyles.noCommentsSubtext, { color: colors.textMuted }]}>
                Be the first to comment!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={[communityStyles.commentInputContainer, { backgroundColor: colors.white, borderTopColor: colors.border }]}>
        <TextInput
          style={[communityStyles.commentInput, { color: colors.text, backgroundColor: colors.backgroundLight }]}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textMuted}
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <Button
          title="Post"
          onPress={handleAddComment}
          disabled={!commentText.trim() || isSubmitting}
          loading={isSubmitting}
          style={communityStyles.commentButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};