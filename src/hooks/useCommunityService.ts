// src/hooks/useCommunityService.ts

import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
  id: string;
  postType: string;
  title: string;
  content: string;
  author: any;
  location?: any;
  route?: any;
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
  author: any;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  createdAt: string;
}

interface FeedParams {
  page?: number;
  limit?: number;
  postType?: string;
  locationId?: string;
}

interface CreatePostParams {
  postType: string;
  title: string;
  content: string;
  locationId?: string;
  routeId?: string;
  images?: string[];
}

interface ContributionParams {
  contributionType: 'new_route' | 'route_update' | 'fare_correction' | 'new_intermediate_stop' | 'instructions_update';
  description: string;
  routeId?: string;
  startLocationId?: string;
  endLocationId?: string;
  proposedData: Record<string, any>;
}

export const useCommunityService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get authentication token
   */
  const getAuthToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  /**
   * Get community feed
   */
  const getFeed = async (params: FeedParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/community/posts`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          postType: params.postType,
          locationId: params.locationId,
        },
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to load feed',
      };
    } catch (error: any) {
      console.error('Get feed error:', error);
      setError(error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to load feed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get post by ID
   */
  const getPostById = async (postId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/community/posts/${postId}`);

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Post not found',
      };
    } catch (error: any) {
      console.error('Get post error:', error);
      setError(error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to load post',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new post
   */
  const createPost = async (postData: CreatePostParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/community/posts`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to create post',
      };
    } catch (error: any) {
      console.error('Create post error:', error);
      setError(error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create post',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Vote on a post
   */
  const votePost = async (postId: string, voteType: 'up' | 'down') => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/community/posts/${postId}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to vote',
      };
    } catch (error: any) {
      console.error('Vote post error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to vote',
      };
    }
  };

  /**
   * Get comments for a post
   */
  const getComments = async (postId: string, page: number = 1, limit: number = 50) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/community/posts/${postId}/comments`,
        {
          params: { page, limit },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to load comments',
      };
    } catch (error: any) {
      console.error('Get comments error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to load comments',
      };
    }
  };

  /**
   * Add a comment to a post
   */
  const addComment = async (postId: string, content: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/community/posts/${postId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to add comment',
      };
    } catch (error: any) {
      console.error('Add comment error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to add comment',
      };
    }
  };

  /**
   * Vote on a comment
   */
  const voteComment = async (commentId: string, voteType: 'up' | 'down') => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/community/comments/${commentId}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to vote',
      };
    } catch (error: any) {
      console.error('Vote comment error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to vote',
      };
    }
  };

  /**
   * Delete a post
   */
  const deletePost = async (postId: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.delete(
        `${API_BASE_URL}/community/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to delete post',
      };
    } catch (error: any) {
      console.error('Delete post error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete post',
      };
    }
  };

  /**
   * Report a post
   */
  const reportPost = async (postId: string, reason: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/community/posts/${postId}/report`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to report post',
      };
    } catch (error: any) {
      console.error('Report post error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to report post',
      };
    }
  };

  /**
   * Submit a contribution
   */
  const submitContribution = async (contributionData: ContributionParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/community/contributions`,
        contributionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      return {
        success: false,
        error: 'Failed to submit contribution',
      };
    } catch (error: any) {
      console.error('Submit contribution error:', error);
      setError(error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to submit contribution',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get user's contributions
   */
  const getMyContributions = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const response = await axios.get(
        `${API_BASE_URL}/community/contributions/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: 'Failed to load contributions',
      };
    } catch (error: any) {
      console.error('Get contributions error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to load contributions',
      };
    }
  };

  /**
   * Toggle real-time updates
   */
  const toggleRealTimeUpdates = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('real_time_updates', enabled ? 'true' : 'false');
      return { success: true };
    } catch (error) {
      console.error('Toggle real-time updates error:', error);
      return { success: false };
    }
  };

  /**
   * Check if real-time updates are enabled
   */
  const getRealTimeUpdatesStatus = async (): Promise<boolean> => {
    try {
      const status = await AsyncStorage.getItem('real_time_updates');
      return status === 'true';
    } catch (error) {
      console.error('Get real-time updates status error:', error);
      return false;
    }
  };

  return {
    // Feed
    getFeed,
    getPostById,
    
    // Post actions
    createPost,
    votePost,
    deletePost,
    reportPost,
    
    // Comments
    getComments,
    addComment,
    voteComment,
    
    // Contributions
    submitContribution,
    getMyContributions,
    
    // Settings
    toggleRealTimeUpdates,
    getRealTimeUpdatesStatus,
    
    // State
    isLoading,
    error,
  };
};