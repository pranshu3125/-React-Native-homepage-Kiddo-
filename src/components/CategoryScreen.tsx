import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductImage } from './ProductImage';
import { Category, ProductItem } from '../types/sdui';
import { getCategoryProducts } from '../mockData';
import { FloatingCart } from './FloatingCart';
import { useTheme } from '../context/ThemeProvider';

const CATEGORY_MOOD: Record<string, {
  gradientColors: string[];
  description: string;
  accentEmoji: string;
  pageBg: string;
  cardBg: string;
  floatEmojis: string[];
}> = {
  'baby-care': {
    gradientColors: ['#FF9ECD', '#FFF5F9'],
    description: 'Gentle care for delicate skin. Trusted by parents.',
    accentEmoji: '👶',
    pageBg: '#FFF5F8',
    cardBg: '#FFFFFF',
    floatEmojis: ['⭐', '☁️', '🌙', '🌸', '🦋'],
  },
  'toys': {
    gradientColors: ['#FF6B35', '#FFFBEA'],
    description: 'Spark curiosity and imagination through play.',
    accentEmoji: '🧸',
    pageBg: '#FFFBEA',
    cardBg: '#FFFFFF',
    floatEmojis: ['🎈', '🎠', '🌈', '🎪', '🤹'],
  },
  'school': {
    gradientColors: ['#4CAF50', '#F3F8FF'],
    description: 'Everything your child needs for a great school year.',
    accentEmoji: '📚',
    pageBg: '#F3F8FF',
    cardBg: '#FFFFFF',
    floatEmojis: ['✏️', '📐', '🎒', '📏', '📓'],
  },
  'feeding': {
    gradientColors: ['#FF8A65', '#FFF8F0'],
    description: 'Mealtime made easy with our feeding essentials.',
    accentEmoji: '🍼',
    pageBg: '#FFF8F0',
    cardBg: '#FFFFFF',
    floatEmojis: ['🥣', '🍎', '🍼', '🥄', '🍚'],
  },
  'snacks': {
    gradientColors: ['#FFB300', '#FFF8E1'],
    description: 'Healthy treats your little ones will love.',
    accentEmoji: '🍪',
    pageBg: '#FFF8E1',
    cardBg: '#FFFFFF',
    floatEmojis: ['🍪', '🍿', '🧃', '🍇', '🥨'],
  },
  'hygiene': {
    gradientColors: ['#81D4FA', '#E1F5FE'],
    description: 'Keep your baby fresh, clean, and happy.',
    accentEmoji: '🧴',
    pageBg: '#E1F5FE',
    cardBg: '#FFFFFF',
    floatEmojis: ['🧼', '🫧', '🌊', '💧', '🌸'],
  },
  'nursery': {
    gradientColors: ['#CE93D8', '#F3E5F5'],
    description: 'Create the perfect nursery for your little star.',
    accentEmoji: '🛏️',
    pageBg: '#F3E5F5',
    cardBg: '#FFFFFF',
    floatEmojis: ['🌙', '⭐', '🦉', '🌈', '☁️'],
  },
};

const FLOAT_POSITIONS: ({ top: number; left: number } | { top: number; right: number })[] = [
  { top: 40, left: 12 }, { top: 80, right: 12 },
  { top: 160, left: 8 }, { top: 260, right: 8 },
  { top: 360, left: 12 },
];

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
      <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.accent, shadowColor: theme.accent }]} onPress={handlePress} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const ProductCard: React.FC<{ product: ProductItem; onAddToCart: (id: string) => void }> =
  React.memo(({ product, onAddToCart }) => {
    const { theme, glass } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, [fadeAnim]);

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
        <View style={[styles.productCard, glass(0.5)]}>
          <View style={[styles.productImageContainer, { backgroundColor: theme.border ?? '#E2E8F0' }]}>
            <ProductImage uri={product.image} productId={product.id} style={styles.productImage} />
            {product.discount && (
              <View style={[styles.discountBadge, { backgroundColor: product.discount.includes('OFF') ? '#FF4757' : '#FF6B35' }]}>
                <Text style={styles.discountText}>{product.discount}</Text>
              </View>
            )}
            <AnimatedAddBtn onAdd={() => onAddToCart(product.id)} />
          </View>
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: theme.textPrimary }]} numberOfLines={2}>{product.name}</Text>
            {product.unit && <Text style={[styles.productUnit, { color: theme.textSecondary }]}>{product.unit}</Text>}
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.textPrimary }]}>₹{product.price}</Text>
              {product.mrp && product.mrp > product.price && (
                <Text style={[styles.mrp, { color: theme.textSecondary }]}>₹{product.mrp}</Text>
              )}
            </View>
            {product.rating && (
              <View style={styles.ratingRow}>
                <Text style={styles.star}>★</Text>
                <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{product.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  });

export const CategoryScreen: React.FC<{
  category: Category;
  onBack: () => void;
  onAddToCart: (productId: string) => void;
  onViewCart?: () => void;
}> = ({ category, onBack, onAddToCart, onViewCart }) => {
  const insets = useSafeAreaInsets();
  const { theme, glass, isDark } = useTheme();
  const mood = CATEGORY_MOOD[category.id] ?? CATEGORY_MOOD['baby-care'];
  const products = useMemo(() => getCategoryProducts(category.id), [category.id]);
  const headerFade = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(FLOAT_POSITIONS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    floatAnim.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: 1, tension: 30 + i * 5, friction: 6, useNativeDriver: true,
      }).start();
    });
  }, [headerFade, floatAnim]);

  const renderProduct = useCallback(
    ({ item }: { item: ProductItem }) => (
      <ProductCard product={item} onAddToCart={onAddToCart} />
    ),
    [onAddToCart]
  );

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#0D1117' : mood.pageBg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={mood.gradientColors[1]} />
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: mood.gradientColors[1] }]}>
        <View style={[styles.headerGlow, { backgroundColor: mood.gradientColors[0] }]} />
        {mood.floatEmojis.map((emoji, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.floatEmoji,
              FLOAT_POSITIONS[i % FLOAT_POSITIONS.length] as any,
              {
                opacity: floatAnim[i] ?? 0,
                transform: [{
                  translateY: (floatAnim[i] ?? new Animated.Value(0)).interpolate({
                    inputRange: [0, 1], outputRange: [-20, 0],
                  }),
                }],
              },
            ]}
          >
            {emoji}
          </Animated.Text>
        ))}
        <Animated.View style={[styles.headerContent, { opacity: headerFade }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.8)' }]} onPress={onBack} activeOpacity={0.7}>
              <Text style={[styles.backArrow, { color: theme.textPrimary }]}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerIcon}>{mood.accentEmoji}</Text>
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{category.name}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>
          <Text style={[styles.headerDescription, { color: theme.textSecondary }]}>{mood.description}</Text>
          {products.length > 0 && (
            <Text style={[styles.productCount, { color: theme.textSecondary }]}>{products.length} products</Text>
          )}
        </Animated.View>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{mood.accentEmoji}</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No products found in {category.name}</Text>
          </View>
        }
      />
      <FloatingCart onViewCart={onViewCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16, paddingBottom: 16,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.12,
  },
  floatEmoji: {
    position: 'absolute', fontSize: 24, opacity: 0.5, zIndex: 0,
  },
  headerContent: { position: 'relative', zIndex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 20, fontWeight: '700' },
  headerTitleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  headerIcon: { fontSize: 24, marginRight: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  headerSpacer: { width: 40 },
  headerDescription: { fontSize: 13, fontWeight: '500', marginTop: 6, marginLeft: 52, lineHeight: 18 },
  productCount: { fontSize: 12, fontWeight: '600', marginTop: 4, marginLeft: 52 },
  listContent: { padding: 16, paddingBottom: 100 },
  row: { gap: 12, marginBottom: 12 },
  productCard: {
    flex: 1, borderRadius: 20, overflow: 'hidden',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 12,
  },
  productImageContainer: { position: 'relative', aspectRatio: 1 },
  productImage: { width: '100%', height: '100%' },
  discountBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, elevation: 2 },
  discountText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  addBtn: {
    position: 'absolute', bottom: 8, right: 8, width: 36, height: 36,
    borderRadius: 18, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4, shadowRadius: 6,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  productInfo: { padding: 12 },
  productName: { fontSize: 13, fontWeight: '600', lineHeight: 18, minHeight: 36 },
  productUnit: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  price: { fontSize: 16, fontWeight: '800' },
  mrp: { fontSize: 12, textDecorationLine: 'line-through', fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  star: { fontSize: 11, color: '#FFB800' },
  ratingText: { fontSize: 10, marginLeft: 2, fontWeight: '600' },
  emptyContainer: { paddingVertical: 60, alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600' },
});
