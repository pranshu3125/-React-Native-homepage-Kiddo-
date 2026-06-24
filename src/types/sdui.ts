export type ComponentType =
  | 'BANNER_HERO'
  | 'PRODUCT_GRID_2X2'
  | 'DYNAMIC_COLLECTION'
  | 'FULL_SCREEN_OVERLAY'
  | 'UNKNOWN';

export type ActionType =
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'DEEP_LINK'
  | 'OPEN_CATEGORY'
  | 'OPEN_CAMPAIGN'
  | 'APPLY_MYSTERY_GIFT_COUPON'
  | 'TOGGLE_WISHLIST'
  | 'NONE';

export interface ThemeConfig {
  primary: string;
  background: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  cardBackground?: string;
  chipBackground?: string;
  chipText?: string;
  border?: string;
  glassBg?: string;
  glassBorder?: string;
}

export interface DarkModeConfig {
  isDark: boolean;
  dark: ThemeConfig;
  light: ThemeConfig;
}

export interface ActionSchema {
  type: ActionType;
  payload: Record<string, unknown>;
}

export interface BaseComponent {
  id: string;
  type: ComponentType;
  action?: ActionSchema;
}

export interface BannerHeroComponent extends BaseComponent {
  type: 'BANNER_HERO';
  imageUrl: string;
  title?: string;
  subtitle?: string;
  height?: number;
  campaignTheme?: string;
  discountBadge?: string;
  emoji?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  discount?: string;
  categoryId?: string;
  mrp?: number;
  unit?: string;
  action?: ActionSchema;
}

export interface ProductGrid2x2Component extends BaseComponent {
  type: 'PRODUCT_GRID_2X2';
  title?: string;
  subtitle?: string;
  products: ProductItem[];
}

export interface DynamicCollectionItem {
  id: string;
  name: string;
  price: number;
  image: string;
  action?: ActionSchema;
  rating?: number;
  discount?: string;
}

export interface DynamicCollectionComponent extends BaseComponent {
  type: 'DYNAMIC_COLLECTION';
  title?: string;
  subtitle?: string;
  collectionId: string;
  items: DynamicCollectionItem[];
}

export interface FullScreenOverlayComponent extends BaseComponent {
  type: 'FULL_SCREEN_OVERLAY';
  animationUrl: string;
}

export interface UnknownComponent extends BaseComponent {
  type: 'UNKNOWN';
  originalType?: string;
  title?: string;
}

export type UIComponent =
  | BannerHeroComponent
  | ProductGrid2x2Component
  | DynamicCollectionComponent
  | FullScreenOverlayComponent
  | UnknownComponent;

export interface Category {
  id: string;
  name: string;
  icon: string;
  themeId: string;
}

export interface CampaignConfig {
  id: string;
  name: string;
  theme: ThemeConfig;
  overlayAnimationUrl?: string;
  bannerSuffix?: string;
  tagline?: string;
  injectedComponents?: UIComponent[];
}

export interface HomepagePayload {
  components: UIComponent[];
  campaign?: CampaignConfig;
  deliveryEta?: string;
  deliveryLocation?: string;
}
