import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductImage } from './ProductImage';
import { GlassContainer } from './GlassContainer';
import { useCart } from '../context/CartStore';
import { useTheme } from '../context/ThemeProvider';
import { productCatalog } from '../mockData';

interface CartScreenProps {
  onBack: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onBack }) => {
  const cart = useCart();
  const { theme, glass, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'done'>('cart');

  const totalAmount = useMemo(() => {
    return Object.entries(cart.items).reduce((sum, [id, qty]) => {
      const product = productCatalog[id];
      return sum + (product?.price ?? 0) * qty;
    }, 0);
  }, [cart.items]);

  const cartItems = useMemo(() => {
    return Object.entries(cart.items).map(([id, qty]) => ({
      id,
      product: productCatalog[id],
      quantity: qty,
    })).filter((item) => item.product != null);
  }, [cart.items]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) return;
    setCheckoutStep('checkout');
    setTimeout(() => {
      setCheckoutStep('done');
      cart.clearCart();
      Alert.alert(
        '🎉 Order Placed!',
        `Your order of ₹${totalAmount} has been placed successfully.\nEstimated delivery: ${Math.floor(Math.random() * 20) + 10} min`,
        [{ text: 'Great!', onPress: onBack }]
      );
    }, 1500);
  }, [cartItems.length, totalAmount, onBack, cart]);

  const handleDecrease = useCallback((id: string) => {
    cart.decrementFromCart(id);
  }, [cart]);

  const handleIncrease = useCallback((id: string) => {
    cart.addToCart(id);
  }, [cart]);

  const renderItem = useCallback(
    ({ item }: { item: typeof cartItems[number] }) => (
      <GlassContainer intensity="medium" borderRadius={16} style={styles.cartItem}>
        <ProductImage uri={item.product!.image} productId={item.id} style={[styles.itemImage, { backgroundColor: theme.border ?? '#E2E8F0' }]} />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: theme.textPrimary }]} numberOfLines={2}>{item.product!.name}</Text>
          <Text style={[styles.itemPrice, { color: theme.textPrimary }]}>₹{item.product!.price}</Text>
        </View>
        <View style={[styles.quantityControl, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F8' }]}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleDecrease(item.id)} activeOpacity={0.6}>
            <Text style={[styles.qtyBtnText, { color: theme.primary }]}>{item.quantity <= 1 ? '🗑' : '−'}</Text>
          </TouchableOpacity>
          <Text style={[styles.qtyValue, { color: theme.textPrimary }]}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => handleIncrease(item.id)} activeOpacity={0.6}>
            <Text style={[styles.qtyBtnText, { color: theme.primary }]}>+</Text>
          </TouchableOpacity>
        </View>
      </GlassContainer>
    ),
    [handleDecrease, handleIncrease, theme, isDark]
  );

  const deliveryFee = totalAmount > 499 ? 0 : 49;
  const finalTotal = totalAmount + deliveryFee;

  if (checkoutStep === 'checkout') {
    return (
      <View style={[styles.screen, styles.centerContainer, { backgroundColor: isDark ? '#0D1117' : '#FFF8F5' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0D1117' : '#FFF8F5'} />
        <Text style={styles.processingEmoji}>🛵</Text>
        <Text style={[styles.processingText, { color: theme.textPrimary }]}>Placing your order...</Text>
        <View style={[styles.processingBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F0F0F0' }]}>
          <View style={[styles.processingFill, { backgroundColor: theme.primary, width: '60%' }]} />
        </View>
      </View>
    );
  }

  if (checkoutStep === 'done') {
    return (
      <View style={[styles.screen, styles.centerContainer, { backgroundColor: isDark ? '#0D1117' : '#FFF8F5' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0D1117' : '#FFF8F5'} />
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={[styles.doneText, { color: theme.textPrimary }]}>Order Confirmed!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#0D1117' : '#FFF5F0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0D1117' : '#FFFFFF'} />
      <GlassContainer intensity="heavy" borderRadius={0} noBorder style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F8' }]} onPress={onBack} activeOpacity={0.7}>
            <Text style={[styles.backArrow, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Your Cart</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={[styles.itemCount, { color: theme.textSecondary }]}>{cart.cartCount} Item{cart.cartCount !== 1 ? 's' : ''}</Text>
      </GlassContainer>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Your cart is empty</Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>Add items to get started</Text>
          <TouchableOpacity style={[styles.shopBtn, { backgroundColor: theme.primary }]} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.shopBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <GlassContainer intensity="heavy" borderRadius={16} noBorder style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.totalValue, { color: theme.textPrimary }]}>₹{totalAmount}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Delivery</Text>
              <Text style={[styles.totalValue, deliveryFee === 0 ? { color: '#2ECC71' } : { color: theme.textPrimary }]}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>
            {deliveryFee > 0 && (
              <Text style={[styles.freeDeliveryHint, { color: theme.primary }]}>Add ₹{499 - totalAmount} more for free delivery</Text>
            )}
            <View style={[styles.divider, { backgroundColor: theme.border ?? '#E2E8F0' }]} />
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabelBold, { color: theme.textPrimary }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: theme.textPrimary }]}>₹{finalTotal}</Text>
            </View>
            <TouchableOpacity style={[styles.checkoutBtn, { backgroundColor: theme.primary }]} onPress={handleCheckout} activeOpacity={0.8}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <Text style={styles.checkoutArrow}>→</Text>
            </TouchableOpacity>
          </GlassContainer>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 20, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSpacer: { width: 40 },
  itemCount: { fontSize: 13, fontWeight: '500', marginTop: 4, marginLeft: 52 },
  listContent: { padding: 16, paddingBottom: 240 },
  cartItem: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 12 },
  itemImage: { width: 64, height: 64, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: '600', lineHeight: 18 },
  itemPrice: { fontSize: 16, fontWeight: '800', marginTop: 4 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', marginLeft: 8, borderRadius: 20, padding: 2 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { fontSize: 18, fontWeight: '700' },
  qtyValue: { fontSize: 15, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 16, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  totalLabel: { fontSize: 14, fontWeight: '500' },
  totalValue: { fontSize: 14, fontWeight: '700' },
  totalLabelBold: { fontSize: 16, fontWeight: '700' },
  totalAmount: { fontSize: 22, fontWeight: '800' },
  divider: { height: 1, marginVertical: 8 },
  freeDeliveryHint: { fontSize: 11, fontWeight: '600', marginTop: -4, marginBottom: 4 },
  checkoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16, gap: 8, marginTop: 8 },
  checkoutText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  checkoutArrow: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, fontWeight: '500', marginBottom: 24 },
  shopBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  shopBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  processingEmoji: { fontSize: 64, marginBottom: 16 },
  processingText: { fontSize: 18, fontWeight: '700', marginBottom: 24 },
  processingBar: { width: '60%', height: 4, borderRadius: 2, overflow: 'hidden' },
  processingFill: { height: '100%', borderRadius: 2 },
  doneEmoji: { fontSize: 72, marginBottom: 16 },
  doneText: { fontSize: 22, fontWeight: '900' },
});
