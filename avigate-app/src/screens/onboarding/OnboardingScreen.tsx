// src/screens/onboarding/OnboardingScreen.tsx

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ViewToken,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Effortlessly\nnavigate new cities',
    description: 'Get real-time route information, fare\nestimate, and step-by-step directions.',
    image: require('../../../assets/images/onboarding-1.png'),
  },
  {
    id: '2',
    title: 'Precisely give friends\ndirection to places',
    description: 'Create new directions or share existing\nlocations with friends.',
    image: require('../../../assets/images/onboarding-2.png'),
  },
  {
    id: '3',
    title: 'Find reliable\ntransport routes',
    description: 'Get updates such as route delays,\ndetours, safety issues, or fare changes.',
    image: require('../../../assets/images/onboarding-3.png'),
  },
];

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const completedRef = useRef(false);

  // Prevent back button on Android
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  // Prevent navigation loop - if we've completed, don't let the screen re-render
  React.useEffect(() => {
    if (completedRef.current) {
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && !completedRef.current) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (isCompleting || completedRef.current) return;

    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    if (isCompleting || completedRef.current) return;
    handleComplete();
  };

  const handleComplete = async () => {
    if (isCompleting || completedRef.current) {
      return;
    }

    completedRef.current = true;
    setIsCompleting(true);

    try {
      // Save to AsyncStorage with multiple attempts
      let saveSuccess = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await AsyncStorage.setItem('hasSeenOnboarding', 'true');

          // Verify immediately
          const verification = await AsyncStorage.getItem('hasSeenOnboarding');

          if (verification === 'true') {
            saveSuccess = true;
            break;
          } else {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (err) {
          console.error(` Save failed on attempt ${attempt}:`, err);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      }

      if (saveSuccess) {
      } else {
        console.error(' Failed to save onboarding status after 3 attempts');
      }

      // Navigate regardless of save success
      // Use setTimeout to ensure AsyncStorage operations complete
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 300);
    } catch (error) {
      console.error(' Critical error in handleComplete:', error);
      // Navigate anyway
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 300);
    }
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
          fadeDuration={200}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  if (completedRef.current) {
    // Show a blank screen while navigating to prevent flicker
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666666' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/avigate-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        scrollEnabled={!isCompleting}
        style={styles.flatList}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        removeClippedSubviews={false}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, index === currentIndex && styles.paginationDotActive]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {/* Skip Button - Left Side */}
          {!isLastSlide && (
            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              disabled={isCompleting}
            >
              <Text style={[styles.skipText, isCompleting && { opacity: 0.5 }]}>Skip</Text>
            </TouchableOpacity>
          )}

          {/* Next/Complete Button - Right Side */}
          <TouchableOpacity
            style={[styles.nextButton, isCompleting && { opacity: 0.5 }]}
            onPress={handleNext}
            activeOpacity={0.8}
            disabled={isCompleting}
          >
            <View style={styles.nextButtonInner}>
              {isLastSlide ? (
                <Icon name="checkmark" size={32} color="#FFFFFF" />
              ) : (
                <Icon name="chevron-forward" size={32} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 0,
  },
  logo: {
    width: 100,
    height: 32,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_HEIGHT * 0.3,
    maxHeight: 300,
  },
  textContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
    width: '100%',
    maxWidth: 320,
  },
  description: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    width: '100%',
    maxWidth: 300,
  },
  footer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    height: 8,
    backgroundColor: '#86B300',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    paddingHorizontal: 40,
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    left: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#86B300',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
