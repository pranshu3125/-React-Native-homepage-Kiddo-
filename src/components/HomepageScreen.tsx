import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { componentRegistry } from '../registry/ComponentRegistry';
import { actionDispatcher } from '../utils/ActionDispatcher';
import { useTheme } from '../context/ThemeProvider';
import { useCart } from '../context/CartStore';
import { FullScreenOverlay } from './FullScreenOverlay';
import { CategoryChips } from './CategoryChips';
import { SearchBar } from './SearchBar';
import { SearchOverlay } from './SearchOverlay';
import { FloatingCart } from './FloatingCart';
import { GlassContainer } from './GlassContainer';
import { UIComponent, ActionSchema, Category } from '../types/sdui';
import { categories, mockPayload, campaigns } from '../mockData';

interface HomepageScreenProps {
  components: UIComponent[];
  onCategorySelect?: (category: Category) => void;
  onProfilePress?: () => void;
  onCartPress?: () => void;
  onDevTap?: () => void;
}

const GradientHeader: React.FC<{ children: React.ReactNode; insets: { top: number }; isDark: boolean }> = React.memo(
  ({ children, insets, isDark }) => (
    <GlassContainer intensity="heavy" borderRadius={24} style={[styles.headerWrap, { paddingTop: insets.top }]}>
      <View style={[styles.headerGlow, { backgroundColor: isDark ? 'rgba(255,107,53,0.1)' : '#FFF0E8' }]} />
      {children}
    </GlassContainer>
  )
);

export const HomepageScreen: React.FC<HomepageScreenProps> = React.memo(
  ({ components, onCategorySelect, onProfilePress, onCartPress, onDevTap }) => {
    const insets = useSafeAreaInsets();
    const { theme, campaign, setCampaign, toggleDark, isDark } = useTheme();
    const cart = useCart();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchVisible, setSearchVisible] = useState(false);

    const handleAction = useCallback((action: ActionSchema) => {
      actionDispatcher.handleAction(action);
    }, []);

    const renderItem = useCallback(
      ({ item }: { item: UIComponent }) => {
        return componentRegistry.render(item.type, item, handleAction);
      },
      [handleAction]
    );

    const keyExtractor = useCallback((item: UIComponent) => item.id, []);

    const displayComponents = useMemo(() => {
      const base = components.filter((c) => c.type !== 'FULL_SCREEN_OVERLAY');
      if (campaign?.injectedComponents) {
        const injectAfter = base.findIndex((c) => c.id === 'hero-1');
        const insertAt = injectAfter >= 0 ? injectAfter + 1 : base.length;
        const result = [...base] as UIComponent[];
        result.splice(insertAt, 0, ...campaign.injectedComponents);
        return result;
      }
      return base;
    }, [components, campaign]);

    const handleCategorySelect = useCallback(
      (category: Category) => {
        setSelectedCategory(category.id);
        if (category.id !== 'all') {
          onCategorySelect?.(category);
          setSelectedCategory('all');
        }
      },
      [onCategorySelect]
    );

    const handleCampaignSelect = useCallback(
      (campaignKey: string) => {
        const camp = campaigns[campaignKey];
        if (camp) {
          setCampaign(camp);
          actionDispatcher.handleAction({
            type: 'DEEP_LINK',
            payload: { url: `/campaign/${camp.id}` },
          });
        }
      },
      [setCampaign]
    );

    const listHeader = useMemo(
      () => (
        <View>
          <GradientHeader insets={insets} isDark={isDark}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={campaign?.theme.background ?? (isDark ? '#0D1117' : '#FFF5F0')} />
            <View style={styles.topRow}>
              <View style={styles.deliveryInfo}>
                <View style={styles.deliveryBadge}>
                  <View style={styles.etaDot} />
                  <Text style={[styles.deliveryEta, { color: theme.textSecondary }]}>
                    Delivery in <Text style={[styles.deliveryEtaBold, { color: '#2ECC71' }]}>{mockPayload.deliveryEta ?? '12'} min</Text>
                  </Text>
                </View>
                <TouchableOpacity style={styles.locationRow} activeOpacity={0.7} onPress={onProfilePress}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={[styles.locationText, { color: theme.textPrimary }]} numberOfLines={1}>
                    {mockPayload.deliveryLocation ?? 'Home'}
                  </Text>
                  <Text style={[styles.locationChevron, { color: theme.textSecondary }]}>▾</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F8' }]} onPress={toggleDark} activeOpacity={0.7}>
                  <Text style={styles.iconEmoji}>{isDark ? '🌙' : '☀️'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F8' }]} onPress={onProfilePress} activeOpacity={0.7}>
                  <Text style={styles.iconEmoji}>👤</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F8' }]} onPress={onCartPress} activeOpacity={0.7}>
                  <Text style={styles.iconEmoji}>🛒</Text>
                  {cart.cartCount > 0 && (
                    <View style={[styles.cartBadge, { backgroundColor: theme.accent }]}>
                      <Text style={styles.cartBadgeText}>{cart.cartCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity activeOpacity={1} onPress={() => setSearchVisible(true)}>
              <View pointerEvents="none">
                <SearchBar placeholder="Search diapers, toys, milk powder..." />
              </View>
            </TouchableOpacity>

            <CategoryChips
              categories={categories}
              selectedId={selectedCategory}
              onSelect={handleCategorySelect}
              chipColor={theme.primary}
              chipTextColor={campaign || theme.background !== '#F7F8FA' ? '#FFFFFF' : undefined}
            />

            {campaign && (
              <TouchableOpacity
                style={[styles.campaignStrip, { backgroundColor: theme.primary }]}
                activeOpacity={0.9}
                onPress={() => actionDispatcher.handleAction({
                  type: 'DEEP_LINK',
                  payload: { url: `/campaign/${campaign.id}` },
                })}
              >
                <Text style={[styles.campaignTagline, { color: '#FFF' }]}>
                  {campaign.tagline ?? campaign.name}
                </Text>
              </TouchableOpacity>
            )}
          </GradientHeader>
        </View>
      ),
      [insets, theme, cart.cartCount, campaign, selectedCategory, handleCategorySelect, onProfilePress, onCartPress, toggleDark, isDark]
    );

    return (
      <View style={[styles.screen, { backgroundColor: isDark ? '#0D1117' : (campaign?.theme.background ?? '#FFF8F5') }]}>
        <TouchableOpacity
          style={styles.devTapArea}
          onPress={onDevTap}
          activeOpacity={1}
        />
        <FlashList
          data={displayComponents}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          ListFooterComponent={<View style={{ height: 100 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        {campaign?.overlayAnimationUrl && (
          <FullScreenOverlay animationUrl={campaign.overlayAnimationUrl} />
        )}
        <FloatingCart onViewCart={onCartPress} />
        <SearchOverlay
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onCategorySelect={handleCategorySelect}
          onCampaignSelect={handleCampaignSelect}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  listContainer: { paddingBottom: 20 },
  headerWrap: {
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 120,
    opacity: 0.4,
  },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 8,
  },
  deliveryInfo: { flex: 1 },
  deliveryBadge: { flexDirection: 'row', alignItems: 'center' },
  etaDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ECC71', marginRight: 6 },
  deliveryEta: { fontSize: 13, fontWeight: '500' },
  deliveryEtaBold: { fontWeight: '800' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationIcon: { fontSize: 13, marginRight: 4 },
  locationText: { fontSize: 14, fontWeight: '700', maxWidth: 200 },
  locationChevron: { fontSize: 10, marginLeft: 4 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  iconBtn: {
    position: 'relative', width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginLeft: 8,
  },
  iconEmoji: { fontSize: 18 },
  cartBadge: {
    position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9,
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4,
    borderWidth: 2, borderColor: '#FFFFFF',
  },
  cartBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },
  campaignStrip: { paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center', marginTop: 4 },
  campaignTagline: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  devTapArea: {
    position: 'absolute', top: 0, left: 0, width: 120, height: 80, zIndex: 50,
  },
});
