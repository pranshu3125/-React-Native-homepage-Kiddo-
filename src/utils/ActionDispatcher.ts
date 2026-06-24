import { Alert } from 'react-native';
import { ActionSchema, ActionType } from '../types/sdui';

type ActionHandler = (payload: Record<string, unknown>) => void;

type NavigateFn = (route: string, params?: Record<string, unknown>) => void;

class ActionDispatcher {
  private handlers: Map<ActionType, ActionHandler> = new Map();
  private cartContext: {
    addToCart: (id: string) => void;
    decrementFromCart: (id: string) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
  } | null = null;
  private navigateFn: NavigateFn | null = null;

  constructor() {
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers() {
    this.handlers.set('ADD_TO_CART', this.handleAddToCart.bind(this));
    this.handlers.set('REMOVE_FROM_CART', this.handleRemoveFromCart.bind(this));
    this.handlers.set('DEEP_LINK', this.handleDeepLink.bind(this));
    this.handlers.set('OPEN_CATEGORY', this.handleOpenCategory.bind(this));
    this.handlers.set('OPEN_CAMPAIGN', this.handleOpenCampaign.bind(this));
    this.handlers.set('APPLY_MYSTERY_GIFT_COUPON', this.handleApplyCoupon.bind(this));
    this.handlers.set('TOGGLE_WISHLIST', this.handleToggleWishlist.bind(this));
    this.handlers.set('NONE', () => {});
  }

  private handleAddToCart(payload: Record<string, unknown>) {
    const productId = payload.id as string;
    if (productId && this.cartContext) {
      this.cartContext.addToCart(productId);
    }
  }

  private handleRemoveFromCart(payload: Record<string, unknown>) {
    const productId = payload.id as string;
    if (productId && this.cartContext) {
      this.cartContext.removeFromCart(productId);
    }
  }

  private handleDeepLink(payload: Record<string, unknown>) {
    const url = payload.url as string;
    if (url && this.navigateFn) {
      this.navigateFn(url, payload);
    }
  }

  private handleOpenCategory(payload: Record<string, unknown>) {
    const categoryId = payload.id as string;
    if (categoryId && this.navigateFn) {
      this.navigateFn(`/category/${categoryId}`, payload);
    }
  }

  private handleOpenCampaign(payload: Record<string, unknown>) {
    const campaignId = payload.id as string;
    if (campaignId && this.navigateFn) {
      this.navigateFn(`/campaign/${campaignId}`, payload);
    }
  }

  private handleApplyCoupon(payload: Record<string, unknown>) {
    const couponCode = payload.code as string;
    if (couponCode) {
      Alert.alert('🎉 Mystery Gift!', `Coupon "${couponCode}" applied! You saved ₹${Math.floor(Math.random() * 100) + 50}!`, [{ text: 'Yay!' }]);
    }
  }

  private handleToggleWishlist(_payload: Record<string, unknown>) {
    Alert.alert('❤️ Wishlist', 'Item added to your wishlist!', [{ text: 'OK' }]);
  }

  setCartContext(context: {
    addToCart: (id: string) => void;
    decrementFromCart: (id: string) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
  }) {
    this.cartContext = context;
  }

  setNavigateFn(fn: NavigateFn) {
    this.navigateFn = fn;
  }

  handleAction(action: ActionSchema) {
    const handler = this.handlers.get(action.type);
    if (handler) {
      try {
        handler(action.payload);
      } catch (error) {
        console.warn('Action handler failed:', error);
      }
    }
  }

  registerHandler(type: ActionType, handler: ActionHandler) {
    this.handlers.set(type, handler);
  }
}

export const actionDispatcher = new ActionDispatcher();
