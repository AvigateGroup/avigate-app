// src/screens/community/CreatePostScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useCommunityService } from '@/hooks/useCommunityService';
import { Button } from '@/components/common/Button';
import { communityStyles } from '@/styles/features';
import * as ImagePicker from 'expo-image-picker';

type PostType = 'traffic_update' | 'route_alert' | 'safety_concern' | 'tip' | 'general';

export const CreatePostScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemedColors();
  const { createPost, isLoading } = useCommunityService();

  const [postType, setPostType] = useState<PostType>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [locationId, setLocationId] = useState<string | undefined>();
  const [routeId, setRouteId] = useState<string | undefined>();
  const [images, setImages] = useState<string[]>([]);

  const postTypes = [
    {
      type: 'traffic_update' as const,
      label: 'Traffic Update',
      icon: 'car-outline',
      color: colors.warning,
      description: 'Report traffic conditions',
    },
    {
      type: 'route_alert' as const,
      label: 'Route Alert',
      icon: 'warning-outline',
      color: colors.error,
      description: 'Alert about route issues',
    },
    {
      type: 'safety_concern' as const,
      label: 'Safety Concern',
      icon: 'shield-outline',
      color: colors.error,
      description: 'Report safety issues',
    },
    {
      type: 'tip' as const,
      label: 'Travel Tip',
      icon: 'bulb-outline',
      color: colors.info,
      description: 'Share helpful tips',
    },
    {
      type: 'general' as const,
      label: 'General',
      icon: 'chatbubble-outline',
      color: colors.text,
      description: 'General discussion',
    },
  ];

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access photos');
        return;
      }

      const remainingSlots = 3 - images.length;

      if (remainingSlots === 0) {
        Alert.alert('Maximum Images', 'You can only add up to 3 images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        const imagesToAdd = newImages.slice(0, remainingSlots);

        setImages([...images, ...imagesToAdd]);

        if (newImages.length > remainingSlots) {
          Alert.alert(
            'Image Limit',
            `Only ${remainingSlots} more image(s) added. Maximum is 3 images total.`,
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your post');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please enter some content');
      return;
    }

    try {
      const result = await createPost({
        postType,
        title: title.trim(),
        content: content.trim(),
        locationId,
        routeId,
        images,
      });

      if (result.success) {
        Alert.alert('Success', 'Your post has been published!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const selectedType = postTypes.find(t => t.type === postType);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[communityStyles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View
          style={[
            communityStyles.detailHeader,
            { backgroundColor: colors.white, borderBottomColor: colors.border },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[communityStyles.headerTitle, { color: colors.text }]}>Create Post</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Post Type Selector */}
          <View style={{ padding: 16 }}>
            <Text style={[communityStyles.commentsTitle, { color: colors.text, marginBottom: 12 }]}>
              Post Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {postTypes.map(type => (
                  <TouchableOpacity
                    key={type.type}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 12,
                        borderWidth: 2,
                        minWidth: 120,
                        alignItems: 'center',
                      },
                      {
                        backgroundColor: postType === type.type ? type.color + '20' : colors.white,
                        borderColor: postType === type.type ? type.color : colors.border,
                      },
                    ]}
                    onPress={() => setPostType(type.type)}
                  >
                    <Icon
                      name={type.icon}
                      size={28}
                      color={postType === type.type ? type.color : colors.textMuted}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        marginTop: 8,
                        color: postType === type.type ? type.color : colors.text,
                      }}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Title Input */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={[communityStyles.commentsTitle, { color: colors.text, marginBottom: 8 }]}>
              Title <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View
              style={[
                {
                  backgroundColor: colors.white,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                },
              ]}
            >
              <TextInput
                style={[{ fontSize: 16, color: colors.text }]}
                placeholder="Enter a clear, descriptive title..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
              {title.length}/100
            </Text>
          </View>

          {/* Content Input */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={[communityStyles.commentsTitle, { color: colors.text, marginBottom: 8 }]}>
              Content <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View
              style={[
                {
                  backgroundColor: colors.white,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  minHeight: 150,
                },
              ]}
            >
              <TextInput
                style={[{ fontSize: 15, color: colors.text, minHeight: 130 }]}
                placeholder="Share your update, tip, or concern..."
                placeholderTextColor={colors.textMuted}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
              {content.length}/1000
            </Text>
          </View>

          {/* Images */}
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={[communityStyles.commentsTitle, { color: colors.text, marginBottom: 8 }]}>
              Images (Optional)
            </Text>

            {images.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                {images.map((image, index) => (
                  <View key={index} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: image }}
                      style={{ width: 100, height: 100, borderRadius: 8 }}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: colors.error,
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Icon name="close" size={16} color={colors.textWhite} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {images.length < 3 && (
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                  },
                ]}
                onPress={handlePickImage}
              >
                <Icon name="image-outline" size={24} color={colors.primary} />
                <Text style={{ fontSize: 15, color: colors.text }}>
                  Add Images ({images.length}/3)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Guidelines */}
          <View
            style={[
              {
                margin: 16,
                padding: 16,
                backgroundColor: colors.infoLight,
                borderRadius: 12,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <Icon name="information-circle" size={20} color={colors.info} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 }}
                >
                  Posting Guidelines
                </Text>
                <Text style={{ fontSize: 13, color: colors.textMuted, lineHeight: 20 }}>
                  • Be respectful and helpful{'\n'}• Provide accurate information{'\n'}• Avoid spam
                  or self-promotion{'\n'}• Report issues, don't create them
                </Text>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View style={{ padding: 16, paddingBottom: 32 }}>
            <Button
              title="Publish Post"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading || !title.trim() || !content.trim()}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};
