import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ProductImage } from './ProductImage';
import { actionDispatcher } from '../utils/ActionDispatcher';
import { useTheme } from '../context/ThemeProvider';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  discount?: string;
  mrp?: number;
  unit?: string;
  categoryId?: string;
}

interface ProductGrid2x2Props {
  title?: string;
  subtitle?: string;
  products: ProductItem[];
  onAddToCart: (productId: string) => void;
  onSeeAll?: () => void;
}

const AnimatedAddButton: React.FC<{
  onAdd: () => void;
}> = React.memo(({ onAdd }) => {
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
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: theme.accent, shadowColor: theme.accent }]}
        onPress={handlePress}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const WishlistButton: React.FC<{ productId: string }> = React.memo(({ productId }) => {
  const [wished, setWished] = useState(false);
  const { glass } = useTheme();
  const handleWishlist = useCallback(() => {
    setWished((prev) => !prev);
    actionDispatcher.handleAction({ type: 'TOGGLE_WISHLIST', payload: { id: productId } });
  }, [productId]);
  return (
    <TouchableOpacity style={[styles.wishlistBtn, glass(0.9)]} onPress={handleWishlist} activeOpacity={0.7}>
      <Text style={[styles.wishlistIcon, wished && { color: '#FF4757' }]}>{wished ? '❤️' : '♡'}</Text>
    </TouchableOpacity>
  );
});

const ProductCard: React.FC<{
  product: ProductItem;
  onAddToCart: (productId: string) => void;
}> = React.memo(
  ({ product, onAddToCart }) => {
    const { theme, glass } = useTheme();
    return (
      <View style={[styles.card, glass(0.5)]}>
        <View style={[styles.imageWrap, { backgroundColor: theme.border ?? '#E2E8F0' }]}>
          <ProductImage uri={product.image} productId={product.id} style={styles.productImage} />
          {product.discount && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.discount}</Text>
            </View>
          )}
          <WishlistButton productId={product.id} />
          <View style={styles.addBtnOuter}>
            <AnimatedAddButton onAdd={() => onAddToCart(product.id)} />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={[styles.productName, { color: theme.textPrimary }]} numberOfLines={2}>{product.name}</Text>
          {product.unit && <Text style={[styles.productUnit, { color: theme.textSecondary }]}>{product.unit}</Text>}
          {product.rating && (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{product.rating}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.textPrimary }]}>₹{product.price}</Text>
            {product.mrp && product.mrp > product.price && (
              <Text style={[styles.mrp, { color: theme.textSecondary }]}>₹{product.mrp}</Text>
            )}
          </View>
        </View>
      </View>
    );
  },
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.product.price === next.product.price &&
    prev.product.discount === next.product.discount
);

export const ProductGrid2x2: React.FC<ProductGrid2x2Props> = React.memo(
  ({ title, subtitle, products, onAddToCart, onSeeAll }) => {
    const { theme } = useTheme();
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            {title && <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>}
            {subtitle && <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
          </View>
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {products.map((product) => (
            <View key={product.id} style={styles.gridItem}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </View>
          ))}
        </View>
      </View>
    );
  },
  (prev, next) =>
    prev.title === next.title &&
    prev.products === next.products
);

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 14 },
  headerTextWrap: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  seeAll: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  gridItem: { width: '50%', paddingHorizontal: 6, marginBottom: 12 },
  card: { borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12 },
  imageWrap: { position: 'relative', aspectRatio: 1 },
  productImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#FF4757', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, elevation: 2 },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  wishlistBtn: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  wishlistIcon: { fontSize: 14, color: '#FF6B6B' },
  addBtnOuter: { position: 'absolute', bottom: 8, right: 8 },
  addBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.4, shadowRadius: 6 },
  addBtnText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', lineHeight: 24 },
  content: { padding: 12 },
  productName: { fontSize: 13, fontWeight: '600', lineHeight: 18, minHeight: 36 },
  productUnit: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  star: { fontSize: 11, color: '#FFB800' },
  ratingText: { fontSize: 10, marginLeft: 2, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  price: { fontSize: 17, fontWeight: '800' },
  mrp: { fontSize: 12, textDecorationLine: 'line-through', fontWeight: '500' },
});
