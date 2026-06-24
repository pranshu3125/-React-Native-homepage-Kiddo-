import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartStore';
import { productCatalog } from '../mockData';
import { useTheme } from '../context/ThemeProvider';
import { GlassContainer } from './GlassContainer';

const THUMBNAIL_SIZE = 32;

interface FloatingCartProps {
  onViewCart?: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = React.memo(({ onViewCart }) => {
  const cart = useCart();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const { theme, glass, isDark } = useTheme();

  const totalAmount = useMemo(() => {
    return Object.entries(cart.items).reduce((sum, [id, qty]) => {
      const product = productCatalog[id];
      return sum + (product?.price ?? 0) * qty;
    }, 0);
  }, [cart.items]);

  const previewItems = useMemo(() => {
    return Object.keys(cart.items).slice(0, 3);
  }, [cart.items]);

  useEffect(() => {
    if (cart.cartCount > 0) {
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 10,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [cart.cartCount, anim]);

  if (cart.cartCount === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 8,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onViewCart}>
        <GlassContainer style={[styles.pill, glass(0.85)]}>
          <View style={styles.thumbnails}>
            {previewItems.map((id, i) => {
              const product = productCatalog[id];
              if (!product) return null;
              return (
                <Image
                  key={id}
                  source={{ uri: product.image }}
                  style={[
                    styles.thumbnail,
                    { marginLeft: i > 0 ? -12 : 0, zIndex: 10 - i, borderColor: theme.cardBackground },
                  ]}
                />
              );
            })}
          </View>

          <View style={styles.divider} />

          <View style={styles.info}>
            <Text style={[styles.count, { color: theme.textSecondary }]}>
              {cart.cartCount} Item{cart.cartCount !== 1 ? 's' : ''}
            </Text>
            <Text style={[styles.total, { color: theme.textPrimary }]}>₹{totalAmount}</Text>
          </View>

          <View style={[styles.ctaSection, { backgroundColor: theme.accent }]}>
            <Text style={styles.ctaText}>View Cart</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </View>
        </GlassContainer>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    zIndex: 1000,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  thumbnails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: THUMBNAIL_SIZE / 2,
    borderWidth: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
  },
  total: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },
  ctaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 4,
  },
  ctaArrow: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
