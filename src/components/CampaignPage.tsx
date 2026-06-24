import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductImage } from './ProductImage';
import { campaigns, productCatalog } from '../mockData';
import { useTheme } from '../context/ThemeProvider';
import { FloatingCart } from './FloatingCart';

const CAMPAIGN_MOOD: Record<string, { emoji: string; tagline: string }> = {
  'back-to-school': { emoji: '📚', tagline: 'Gear up for the school year!' },
  'summer-sale': { emoji: '☀️', tagline: 'Fun in the sun!' },
  'mystery-gift': { emoji: '🎁', tagline: 'Every order has a surprise!' },
};

const CAMPAIGN_FEATURED: Record<string, string[]> = {
  'back-to-school': ['p30', 'p31', 'p34', 'p35', 'p5', 'p33'],
  'summer-sale': ['p1', 'p4', 'p6', 'p3', 'p5', 'p2'],
  'mystery-gift': ['p70', 'p72', 'p40', 'p81', 'p73', 'p71'],
};

interface CampaignPageProps {
  campaignId: string;
  onBack: () => void;
  onAddToCart: (productId: string) => void;
  onViewCart?: () => void;
}

const AnimatedAddBtn: React.FC<{ onAdd: () => void }> = React.memo(({ onAdd }) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.8, tension: 100, friction: 5, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 5, useNativeDriver: true }),
    ]).start();
    onAdd();
  }, [onAdd, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.accent, shadowColor: theme.accent }]} onPress={handlePress} activeOpacity={0.7}>
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const CampaignProductCard: React.FC<{ item: any; onAddToCart: (id: string) => void }> = React.memo(({ item, onAddToCart }) => {
  const { theme, glass } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
      <View style={[styles.productCard, glass(0.5)]}>
        <View style={[styles.productImageContainer, { backgroundColor: theme.border ?? '#E2E8F0' }]}>
          <ProductImage uri={item.image} productId={item.id} style={styles.productImage} />
          {item.discount && (
            <View style={[styles.discountBadge, { backgroundColor: theme.accent }]}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>
          )}
          <AnimatedAddBtn onAdd={() => onAddToCart(item.id)} />
        </View>
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.textPrimary }]} numberOfLines={2}>{item.name}</Text>
          {item.rating && (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{item.rating}</Text>
            </View>
          )}
          <Text style={[styles.price, { color: theme.textPrimary }]}>₹{item.price}</Text>
          {item.mrp && item.mrp > item.price && (
            <Text style={[styles.mrp, { color: theme.textSecondary }]}>₹{item.mrp}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

const CAMPAIGN_FLOATS: Record<string, string[]> = {
  'back-to-school': ['✏️', '📚', '📐', '🎒', '📓', '✂️', '📏', '🖍️', '📖', '🔢', '🌍', '🧮', '🎨', '📝', '🗒️'],
  'summer-sale': ['🌊', '☀️', '🏖️', '🌴', '🐚', '🏄', '⛱️', '🍉', '🏊', '🦀', '🐠', '🩱', '🧴', '🍦', '🏐'],
  'mystery-gift': ['🎉', '🎊', '🎈', '🎁', '✨', '🌟', '🎆', '🎇', '💫', '🎭', '🎪', '🎠', '🎡', '🃏', '🎲'],
};

const FLOAT_ANGLES = [-15, 10, -8, 20, -12, 15, -18, 5, -25, 30, -10, 22, -6, 18, -20];

export const CampaignPage: React.FC<CampaignPageProps> = ({ campaignId, onBack, onAddToCart, onViewCart }) => {
  const insets = useSafeAreaInsets();
  const { campaign, theme, glass, isDark } = useTheme();
  const mood = CAMPAIGN_MOOD[campaignId] ?? { emoji: '🎯', tagline: 'Special offers' };
  const headerFade = useRef(new Animated.Value(0)).current;
  const floatEmojis = useMemo(() => CAMPAIGN_FLOATS[campaignId] ?? ['✨', '🌟', '💫'], [campaignId]);
  const floatAnim = useRef(floatEmojis.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    floatAnim.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: 1, tension: 25 + i * 3, friction: 7, useNativeDriver: true,
      }).start();
    });
  }, [headerFade, floatAnim]);

  const featuredIds = CAMPAIGN_FEATURED[campaignId] ?? Object.keys(productCatalog).slice(0, 6);
  const featuredProducts = useMemo(
    () => featuredIds.map((id) => productCatalog[id]).filter(Boolean),
    [featuredIds]
  );

  const renderProduct = useCallback(
    ({ item }: { item: any }) => (
      <CampaignProductCard item={item} onAddToCart={onAddToCart} />
    ),
    [onAddToCart]
  );

  const campaignName = campaign?.name ?? campaignId.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={campaignId === 'back-to-school' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <Animated.View style={[styles.header, { paddingTop: insets.top, backgroundColor: theme.background, opacity: headerFade }]}>
        <View style={[styles.headerGlow, { backgroundColor: theme.primary }]} />
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.3)' }]} onPress={onBack} activeOpacity={0.7}>
            <Text style={[styles.backArrow, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleArea}>
            <Text style={styles.headerEmoji}>{mood.emoji}</Text>
            <View>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{campaignName}</Text>
              <Text style={[styles.headerTagline, { color: theme.textSecondary }]}>{mood.tagline}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={styles.floatContainer} pointerEvents="none">
        {floatEmojis.slice(0, 8).map((emoji, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.floatEmoji,
              {
                top: 60 + (i % 4) * 80,
                left: i % 2 === 0 ? 8 + (i % 3) * 30 : undefined,
                right: i % 2 === 1 ? 8 + (i % 3) * 30 : undefined,
                opacity: floatAnim[i]?.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] }) ?? 0,
                transform: [{ rotate: `${FLOAT_ANGLES[i]}deg` }],
                fontSize: 24 + (i % 3) * 8,
              },
            ]}
          >
            {emoji}
          </Animated.Text>
        ))}
      </View>

      <View style={[styles.heroBanner, { backgroundColor: theme.primary + '15' }]}>
        <Text style={styles.heroEmoji}>{mood.emoji}</Text>
        <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>{campaignName}</Text>
        <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>{mood.tagline}</Text>
        <View style={[styles.heroBadge, { backgroundColor: theme.primary }]}>
          <Text style={[styles.heroBadgeText, { color: theme.textPrimary ?? '#FFF' }]}>Limited Time Offer</Text>
        </View>
      </View>

      <FlatList
        data={featuredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      <FloatingCart onViewCart={onViewCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.08,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow: { fontSize: 20, fontWeight: '700' },
  headerTitleArea: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 12, gap: 10 },
  headerEmoji: { fontSize: 28 },
  headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  headerTagline: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  heroBanner: {
    margin: 16, padding: 20, borderRadius: 24, alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10,
  },
  heroEmoji: { fontSize: 48, marginBottom: 8 },
  heroTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5, marginBottom: 4 },
  heroSubtitle: { fontSize: 14, fontWeight: '500', marginBottom: 12 },
  heroBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  heroBadgeText: { fontSize: 13, fontWeight: '800' },
  listContent: { padding: 16, paddingBottom: 100 },
  row: { gap: 12, marginBottom: 12 },
  productCard: {
    flex: 1, borderRadius: 20, overflow: 'hidden',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 12,
  },
  productImageContainer: {
    position: 'relative', aspectRatio: 1,
  },
  productImage: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, elevation: 2,
  },
  discountText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  addBtn: {
    position: 'absolute', bottom: 8, right: 8,
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4, shadowRadius: 6,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  productInfo: { padding: 12 },
  productName: { fontSize: 13, fontWeight: '600', lineHeight: 18, minHeight: 36 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  star: { fontSize: 11, color: '#FFB800' },
  ratingText: { fontSize: 10, marginLeft: 2, fontWeight: '600' },
  price: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  mrp: { fontSize: 12, textDecorationLine: 'line-through', fontWeight: '500', marginTop: 1 },
  floatContainer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  floatEmoji: { position: 'absolute' },
});
