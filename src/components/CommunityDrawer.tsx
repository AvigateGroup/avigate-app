// src/components/CommunityDrawer.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useAuth } from '@/store/AuthContext';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

interface CommunityDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export const CommunityDrawer: React.FC<CommunityDrawerProps> = ({ visible, onClose }) => {
  const colors = useThemedColors();
  const { user } = useAuth();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleMenuItemPress = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const menuItems = [
    {
      icon: 'newspaper-outline',
      label: 'Community Feed',
      subtitle: 'View route updates and tips',
      route: '/community',
    },
    {
      icon: 'create-outline',
      label: 'Create Post',
      subtitle: 'Share route information',
      route: '/community/create',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Safety Reports',
      subtitle: 'Report safety concerns',
      route: '/community/contribute',
    },
    {
      icon: 'git-network-outline',
      label: 'Route Contributions',
      subtitle: 'Suggest route improvements',
      route: '/community/contribute',
    },
    {
      icon: 'help-circle-outline',
      label: 'Support',
      subtitle: 'Get help and assistance',
      route: '/support',
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      subtitle: 'About Avigate',
      route: '/about',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.backdropOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
      </TouchableOpacity>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor: colors.white,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Icon name="close" size={28} color={colors.text} />
            </TouchableOpacity>

            {/* User Info */}
            <View style={styles.userSection}>
              {user?.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Icon name="person" size={32} color={colors.white} />
                </View>
              )}
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <TouchableOpacity onPress={() => handleMenuItemPress('/(tabs)/profile')}>
                  <Text style={[styles.myAccount, { color: colors.primary }]}>My account</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Reputation */}
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#10B981" />
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {user?.reputationScore || 100} Reputation
              </Text>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: colors.border }]}
                onPress={() => handleMenuItemPress(item.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>
                  <Icon name={item.icon} size={24} color={colors.text} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  {item.subtitle && (
                    <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>
                      {item.subtitle}
                    </Text>
                  )}
                </View>
                <Icon name="chevron-forward" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdropOverlay: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  myAccount: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  menuSection: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
  },
});
