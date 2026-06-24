import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeProvider';
import { useCart } from '../context/CartStore';
import { campaigns, mockPayload, categories } from '../mockData';
import { CampaignConfig } from '../types/sdui';
import { actionDispatcher } from '../utils/ActionDispatcher';

interface DemoHubProps {
  onLaunchHomepage: () => void;
}

const CAMPAIGN_OPTIONS: { label: string; key: string; campaign: CampaignConfig | null; color: string }[] = [
  { label: 'No Campaign', key: 'none', campaign: null, color: '#718096' },
  { label: 'Back to School', key: 'backToSchool', campaign: campaigns.backToSchool, color: '#FFD700' },
  { label: 'Summer Playhouse', key: 'summerPlayhouse', campaign: campaigns.summerPlayhouse, color: '#00BCD4' },
  { label: 'Mystery Gift', key: 'mysteryGift', campaign: campaigns.mysteryGift, color: '#FF4444' },
];

const QuickActionButton: React.FC<{ label: string; color: string; onPress: () => void }> =
  React.memo(({ label, color, onPress }) => (
    <TouchableOpacity
      style={[styles.quickAction, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
  ));

export const DemoHub: React.FC<DemoHubProps> = ({ onLaunchHomepage }) => {
  const insets = useSafeAreaInsets();
  const { theme, setCampaign, campaign } = useTheme();
  const cart = useCart();

  const stats = useMemo(() => {
    const components = mockPayload.components;
    const total = components.length;
    const unknown = components.filter((c) => c.type === 'UNKNOWN').length;
    const banners = components.filter((c) => c.type === 'BANNER_HERO').length;
    const grids = components.filter((c) => c.type === 'PRODUCT_GRID_2X2').length;
    const collections = components.filter((c) => c.type === 'DYNAMIC_COLLECTION').length;
    const totalProducts = components
      .filter((c) => 'products' in c || 'items' in c)
      .reduce((acc: number, c: any) => {
        if (c.products) return acc + c.products.length;
        if (c.items) return acc + c.items.length;
        return acc;
      }, 0);
    return { total, unknown, banners, grids, collections, totalProducts };
  }, []);

  const handleQuickAddToCart = () => {
    actionDispatcher.handleAction({ type: 'ADD_TO_CART', payload: { id: 'p10' } });
  };

  const handleQuickDeepLink = () => {
    actionDispatcher.handleAction({ type: 'DEEP_LINK', payload: { url: '/category/snacks' } });
  };

  const handleQuickCoupon = () => {
    actionDispatcher.handleAction({ type: 'APPLY_MYSTERY_GIFT_COUPON', payload: { code: 'MYSTERY50' } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.brand, { color: theme.primary }]}>Kiddo</Text>
        <Text style={styles.tagline}>SDUI Demo Console</Text>
        <Text style={styles.subtitle}>Premium quick-commerce homepage renderer</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Active Campaign</Text>
          <View style={styles.campaignGrid}>
            {CAMPAIGN_OPTIONS.map((opt) => {
              const isActive = campaign?.id === opt.campaign?.id || (!campaign && opt.key === 'none');
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.campaignCard,
                    {
                      borderColor: isActive ? opt.color : '#E2E8F0',
                      backgroundColor: isActive ? (opt.campaign?.theme.background ?? '#FFF') : '#FFFFFF',
                    },
                  ]}
                  onPress={() => setCampaign(opt.campaign)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.campaignDot, { backgroundColor: opt.color }]} />
                  <Text style={[styles.campaignLabel, isActive && { fontWeight: '800' }]}>
                    {opt.label}
                  </Text>
                  {isActive && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Payload Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Total Blocks" value={stats.total} color="#4ECDC4" />
            <StatCard label="Hero Banners" value={stats.banners} color="#FF6B6B" />
            <StatCard label="Product Grids" value={stats.grids} color="#FFB800" />
            <StatCard label="Collections" value={stats.collections} color="#A78BFA" />
            <StatCard label="Products" value={stats.totalProducts} color="#60A5FA" />
            <StatCard label="Categories" value={categories.length} color="#F472B6" />
            <StatCard label="Unknown Dropped" value={stats.unknown} color="#FF4444" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Cart State</Text>
          <View style={styles.cartCard}>
            <Text style={styles.cartCount}>
              {cart.cartCount > 0
                ? `${cart.cartCount} item${cart.cartCount !== 1 ? 's' : ''} in cart`
                : 'Cart is empty'}
            </Text>
            <Text style={styles.cartDetail}>
              {Object.entries(cart.items)
                .slice(0, 5)
                .map(([id, qty]) => `${id}×${qty}`)
                .join(', ')}
              {Object.keys(cart.items).length > 5 ? '...' : ''}
            </Text>
            {cart.cartCount > 0 && (
              <Text style={styles.cartTotalItems}>
                Floating cart is active — visible on homepage
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton label="ADD_TO_CART (p10)" color="#4ECDC4" onPress={handleQuickAddToCart} />
            <QuickActionButton label="DEEP_LINK" color="#60A5FA" onPress={handleQuickDeepLink} />
            <QuickActionButton label="APPLY_COUPON" color="#A78BFA" onPress={handleQuickCoupon} />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.launchButton, { backgroundColor: theme.primary }]}
          onPress={onLaunchHomepage}
          activeOpacity={0.8}
        >
          <Text style={styles.launchText}>🚀 Launch Homepage</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          {campaign
            ? `Active: ${campaign.name} · Theme: ${theme.primary}`
            : 'Default theme (no campaign)'}
        </Text>
      </ScrollView>
    </View>
  );
};

const StatCard: React.FC<{ label: string; value: number; color: string }> = React.memo(
  ({ label, value, color }) => (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  brand: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  campaignGrid: {
    gap: 8,
  },
  campaignCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  campaignDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  campaignLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  checkmark: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    color: '#718096',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cartCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  cartDetail: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  cartTotalItems: {
    fontSize: 11,
    color: '#4ECDC4',
    fontWeight: '600',
    marginTop: 6,
    fontStyle: 'italic',
  },
  quickActionsRow: {
    gap: 8,
  },
  quickAction: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  launchButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  launchText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  footerText: {
    fontSize: 11,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 16,
  },
});
