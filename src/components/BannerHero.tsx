import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';

interface BannerHeroProps {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  height?: number;
  onPress?: () => void;
  campaignTheme?: 'summer' | 'snacks' | 'school' | 'mystery' | 'default';
  discountBadge?: string;
  emoji?: string;
}

const CAMPAIGN_STYLES: Record<string, { gradientColors: string[]; badgeColor: string; accentColor: string }> = {
  summer: { gradientColors: ['rgba(255,107,53,0.9)', 'rgba(255,184,0,0.6)'], badgeColor: '#FF6B35', accentColor: '#FFD700' },
  snacks: { gradientColors: ['rgba(255,184,0,0.85)', 'rgba(255,138,101,0.5)'], badgeColor: '#FFB300', accentColor: '#FF8A65' },
  school: { gradientColors: ['rgba(0,51,102,0.85)', 'rgba(76,175,80,0.5)'], badgeColor: '#4CAF50', accentColor: '#FFD700' },
  mystery: { gradientColors: ['rgba(255,68,68,0.85)', 'rgba(171,71,188,0.5)'], badgeColor: '#FF4444', accentColor: '#FFD700' },
  default: { gradientColors: ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)'], badgeColor: '#FF6B35', accentColor: '#FFFFFF' },
};

export const BannerHero: React.FC<BannerHeroProps> = React.memo(
  ({ imageUrl, title, subtitle, height = 200, onPress, campaignTheme = 'default', discountBadge, emoji }) => {
    const screenWidth = Dimensions.get('window').width;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const style = CAMPAIGN_STYLES[campaignTheme] ?? CAMPAIGN_STYLES.default;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      ]).start();
    }, [fadeAnim, scaleAnim]);

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <Animated.View style={[styles.container, { height, width: screenWidth - 32, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          <View style={[styles.gradientOverlay, { backgroundColor: style.gradientColors[0] }]} />
          <View style={[styles.gradientBottom, { backgroundColor: style.gradientColors[1] }]} />
          <View style={styles.content}>
            {emoji && <Text style={styles.emoji}>{emoji}</Text>}
            <View style={styles.textWrap}>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.bottomRow}>
              {discountBadge && (
                <View style={[styles.discountPill, { backgroundColor: style.badgeColor }]}>
                  <Text style={styles.discountText}>{discountBadge}</Text>
                </View>
              )}
              <View style={[styles.cta, { backgroundColor: style.badgeColor }]}>
                <Text style={styles.ctaText}>Shop Now →</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  },
  (prev, next) =>
    prev.imageUrl === next.imageUrl &&
    prev.title === next.title &&
    prev.campaignTheme === next.campaignTheme &&
    prev.discountBadge === next.discountBadge
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  gradientBottom: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
    top: '40%',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: 20,
  },
  emoji: {
    fontSize: 36,
    alignSelf: 'flex-start',
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discountPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  cta: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
