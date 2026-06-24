import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ProductImage } from './ProductImage';
import { actionDispatcher } from '../utils/ActionDispatcher';
import { useTheme } from '../context/ThemeProvider';

interface DynamicCollectionItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  discount?: string;
}

interface DynamicCollectionProps {
  title?: string;
  subtitle?: string;
  items: DynamicCollectionItem[];
  onItemPress?: (item: DynamicCollectionItem) => void;
  onAddToCart?: (productId: string) => void;
  onSeeAll?: () => void;
}

const ITEM_WIDTH = 150;
const ITEM_MARGIN = 12;

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
      <TouchableOpacity
        style={[styles.collectionAddBtn, { backgroundColor: theme.accent, shadowColor: theme.accent }]}
        onPress={handlePress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.collectionAddText}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const FavButton: React.FC<{ productId: string }> = React.memo(({ productId }) => {
  const [wished, setWished] = useState(false);
  const { glass } = useTheme();
  const handleFav = useCallback(() => {
    setWished((prev) => !prev);
    actionDispatcher.handleAction({ type: 'TOGGLE_WISHLIST', payload: { id: productId } });
  }, [productId]);
  return (
    <TouchableOpacity style={[styles.favBtn, glass(0.9)]} onPress={handleFav} activeOpacity={0.7}>
      <Text style={[styles.favIcon, wished && { color: '#FF4757' }]}>{wished ? '❤️' : '♡'}</Text>
    </TouchableOpacity>
  );
});

const CollectionItem: React.FC<{
  item: DynamicCollectionItem;
  onPress?: (item: DynamicCollectionItem) => void;
  onAddToCart?: (productId: string) => void;
}> = React.memo(
  ({ item, onPress, onAddToCart }) => {
    const { theme, glass } = useTheme();
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress?.(item)}
        style={[styles.itemContainer, glass(0.5)]}
      >
        <View style={[styles.itemImageWrap, { backgroundColor: theme.border ?? '#E2E8F0' }]}>
          <ProductImage uri={item.image} productId={item.id} style={styles.itemImage} />
          {item.discount && (
            <View style={styles.itemBadge}>
              <Text style={styles.itemBadgeText}>{item.discount}</Text>
            </View>
          )}
          <FavButton productId={item.id} />
          <AnimatedAddBtn onAdd={() => onAddToCart?.(item.id)} />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemName, { color: theme.textPrimary }]} numberOfLines={2}>{item.name}</Text>
          {item.rating && (
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{item.rating}</Text>
            </View>
          )}
          <Text style={[styles.itemPrice, { color: theme.textPrimary }]}>₹{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.price === next.item.price
);

const ListSeparator: React.FC = React.memo(() => <View style={styles.separator} />);

export const DynamicCollection: React.FC<DynamicCollectionProps> = React.memo(
  ({ title, subtitle, items, onItemPress, onAddToCart, onSeeAll }) => {
    const { theme } = useTheme();
    const renderItem = useCallback(
      ({ item }: { item: DynamicCollectionItem }) => (
        <CollectionItem item={item} onPress={onItemPress} onAddToCart={onAddToCart} />
      ),
      [onItemPress, onAddToCart]
    );

    const keyExtractor = useCallback((item: DynamicCollectionItem) => item.id, []);

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
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ListSeparator}
          snapToInterval={ITEM_WIDTH + ITEM_MARGIN}
          decelerationRate="fast"
          removeClippedSubviews={true}
          scrollEventThrottle={16}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
          windowSize={3}
        />
      </View>
    );
  },
  (prev, next) =>
    prev.title === next.title &&
    prev.items === next.items &&
    prev.onItemPress === next.onItemPress
);

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, marginBottom: 12 },
  headerTextWrap: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  seeAll: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  listContent: { paddingLeft: 16, paddingRight: 16 - ITEM_MARGIN },
  separator: { width: ITEM_MARGIN },
  itemContainer: { width: ITEM_WIDTH, borderRadius: 20, overflow: 'hidden', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10 },
  itemImageWrap: { width: ITEM_WIDTH, height: ITEM_WIDTH, position: 'relative' },
  itemImage: { width: '100%', height: '100%' },
  itemBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#FF4757', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, elevation: 2 },
  itemBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  favBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  favIcon: { fontSize: 14, color: '#FF6B6B' },
  collectionAddBtn: { position: 'absolute', bottom: 6, right: 6, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4 },
  collectionAddText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', lineHeight: 22 },
  itemContent: { padding: 10 },
  itemName: { fontSize: 12, fontWeight: '600', lineHeight: 16, minHeight: 32 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  star: { fontSize: 10, color: '#FFB800' },
  ratingText: { fontSize: 9, marginLeft: 2, fontWeight: '600' },
  itemPrice: { fontSize: 16, fontWeight: '800', marginTop: 4 },
});
