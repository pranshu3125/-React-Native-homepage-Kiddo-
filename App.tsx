import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeProvider';
import { CartProvider, useCart } from './src/context/CartStore';
import { HomepageScreen } from './src/components/HomepageScreen';
import { DemoHub } from './src/components/DemoHub';
import { CampaignPage } from './src/components/CampaignPage';
import { CategoryScreen } from './src/components/CategoryScreen';
import { IntroScreen } from './src/components/IntroScreen';
import { CartScreen } from './src/components/CartScreen';
import { ProfileScreen } from './src/components/ProfileScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ScreenTransition } from './src/components/ScreenTransition';
import { mockPayload, categories, campaigns } from './src/mockData';
import { actionDispatcher } from './src/utils/ActionDispatcher';
import { Category } from './src/types/sdui';
import { useState } from 'react';

const CartInitializer: React.FC = () => {
  const cart = useCart();
  useEffect(() => {
    actionDispatcher.setCartContext({
      addToCart: cart.addToCart,
      decrementFromCart: cart.decrementFromCart,
      removeFromCart: cart.removeFromCart,
      clearCart: cart.clearCart,
    });
  }, [cart.addToCart, cart.decrementFromCart, cart.removeFromCart, cart.clearCart]);
  return null;
};

type AppScreen =
  | { name: 'intro' }
  | { name: 'homepage' }
  | { name: 'category'; category: Category }
  | { name: 'campaign'; campaignId: string }
  | { name: 'demo' }
  | { name: 'cart' }
  | { name: 'profile' };

const DevFab: React.FC<{ onOpen: () => void }> = React.memo(({ onOpen }) => (
  <TouchableOpacity style={styles.devFab} onPress={onOpen} activeOpacity={0.8}>
    <Text style={styles.devFabText}>⚙️</Text>
  </TouchableOpacity>
));

const AppNavigation: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>({ name: 'intro' });
  const [devMode, setDevMode] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setCategoryTheme, setCampaign, campaign } = useTheme();

  const handleNavigate = useCallback((url: string, _params?: Record<string, unknown>) => {
    if (url.startsWith('/category/')) {
      const id = url.replace('/category/', '');
      const cat = categories.find((c) => c.id === id);
      if (cat) {
        setCategoryTheme(cat.themeId);
        setScreen({ name: 'category', category: cat });
      }
    } else if (url.startsWith('/campaign/')) {
      const campaignSlug = url.replace('/campaign/', '');
      const found = Object.entries(campaigns).find(([, config]) => config.id === campaignSlug);
      if (found) {
        setCampaign(found[1]);
        setScreen({ name: 'campaign', campaignId: found[1].id });
      } else {
        Alert.alert('Campaign', `Explore our ${campaignSlug.replace(/-/g, ' ')} offers!`, [{ text: 'OK' }]);
      }
    } else if (url.startsWith('/events/')) {
      const eventName = url.replace('/events/', '').replace(/-/g, ' ');
      Alert.alert('🎉 Event', `Book your ${eventName} experience now!`, [{ text: 'OK' }]);
    }
  }, [setCampaign, setCategoryTheme]);

  useEffect(() => {
    actionDispatcher.setNavigateFn(handleNavigate);
  }, [handleNavigate]);

  const handleIntroFinish = useCallback(() => {
    setScreen({ name: 'homepage' });
  }, []);

  const handleLaunchHomepage = useCallback(() => {
    setScreen({ name: 'homepage' });
  }, []);

  const handleCategorySelect = useCallback(
    (category: Category) => {
      setCategoryTheme(category.themeId);
      setScreen({ name: 'category', category });
    },
    [setCategoryTheme]
  );

  const handleCategoryBack = useCallback(() => {
    setScreen({ name: 'homepage' });
  }, []);

  const handleCampaignBack = useCallback(() => {
    setCampaign(null);
    setScreen({ name: 'homepage' });
  }, [setCampaign]);

  const handleAddToCart = useCallback(
    (productId: string) => {
      actionDispatcher.handleAction({ type: 'ADD_TO_CART', payload: { id: productId } });
    },
    []
  );

  const handleProfile = useCallback(() => {
    setScreen({ name: 'profile' });
  }, []);

  const handleCartView = useCallback(() => {
    setScreen({ name: 'cart' });
  }, []);

  const handleBackToHome = useCallback(() => {
    setScreen({ name: 'homepage' });
  }, []);

  const openDevConsole = useCallback(() => {
    setScreen({ name: 'demo' });
  }, []);

  const handleDevTap = useCallback(() => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      setDevMode((prev) => !prev);
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 2000);
    }
  }, []);

  let content: React.ReactNode = null;

  switch (screen.name) {
    case 'homepage':
      content = (
        <View style={styles.wrapper}>
          <HomepageScreen
            components={mockPayload.components}
            onCategorySelect={handleCategorySelect}
            onProfilePress={handleProfile}
            onCartPress={handleCartView}
            onDevTap={handleDevTap}
          />
          {devMode && <DevFab onOpen={openDevConsole} />}
        </View>
      );
      break;

    case 'category':
      content = (
        <CategoryScreen
          category={screen.category}
          onBack={handleCategoryBack}
          onAddToCart={handleAddToCart}
          onViewCart={handleCartView}
        />
      );
      break;

    case 'campaign':
      content = (
        <CampaignPage
          campaignId={screen.campaignId}
          onBack={handleCampaignBack}
          onAddToCart={handleAddToCart}
          onViewCart={handleCartView}
        />
      );
      break;

    case 'cart':
      content = <CartScreen onBack={handleBackToHome} />;
      break;

    case 'profile':
      content = <ProfileScreen onBack={handleBackToHome} />;
      break;

    case 'demo':
      content = <DemoHub onLaunchHomepage={handleLaunchHomepage} />;
      break;

    case 'intro':
    default:
      content = <IntroScreen onFinish={handleIntroFinish} />;
      break;
  }

  return (
    <ScreenTransition screenKey={screen.name + (screen.name === 'category' ? '-' + (screen as any).category?.id : '') + (screen.name === 'campaign' ? '-' + (screen as any).campaignId : '')}>
      {content}
    </ScreenTransition>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <CartProvider>
            <CartInitializer />
            <AppNavigation />
          </CartProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  devFab: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    zIndex: 9999,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  devFabText: {
    fontSize: 20,
  },
});
