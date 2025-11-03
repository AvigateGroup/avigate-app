//src/components/AnimatedSplashScreen
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';

interface AnimatedSplashScreenProps {
  onComplete: () => void;
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onComplete }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animation sequence
    Animated.sequence([
      // 1. Logo fades in and scales up with smooth spring animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60, // ← Higher = faster/bouncier (try 20-60)
          friction: 1, // ← Higher = less bouncy (try 5-10)
          useNativeDriver: true,
        }),
      ]),

      // 2. Hold the logo on screen
      Animated.delay(1800),

      // 3. Fade out the entire splash screen
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animation complete
      onComplete();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#86B300',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300, // ← Make bigger or smaller
    height: 300, // ← Make bigger or smaller
  },
});

export default AnimatedSplashScreen;
