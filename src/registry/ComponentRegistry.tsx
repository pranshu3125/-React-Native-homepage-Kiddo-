import React from 'react';
import { UIComponent, ActionSchema, UnknownComponent } from '../types/sdui';
import { BannerHero } from '../components/BannerHero';
import { ProductGrid2x2 } from '../components/ProductGrid2x2';
import { DynamicCollection } from '../components/DynamicCollection';
import { FullScreenOverlay } from '../components/FullScreenOverlay';

type ComponentFactory = (
  component: UIComponent,
  onAction: (action: ActionSchema) => void
) => React.ReactElement | null;

const BannerHeroRenderer: React.FC<{ component: UIComponent; onAction: (action: ActionSchema) => void }> =
  React.memo(({ component, onAction }) => {
    const banner = component as Extract<UIComponent, { type: 'BANNER_HERO' }>;
    const handlePress = React.useCallback(() => {
      if (banner.action) {
        onAction(banner.action);
      }
    }, [banner.action, onAction]);
    return (
      <BannerHero
        imageUrl={banner.imageUrl}
        title={banner.title}
        subtitle={banner.subtitle}
        height={banner.height}
        onPress={handlePress}
        campaignTheme={banner.campaignTheme as any}
        discountBadge={banner.discountBadge}
        emoji={banner.emoji}
      />
    );
  });

const ProductGridRenderer: React.FC<{ component: UIComponent; onAction: (action: ActionSchema) => void }> =
  React.memo(({ component, onAction }) => {
    const grid = component as Extract<UIComponent, { type: 'PRODUCT_GRID_2X2' }>;
    const handleAddToCart = React.useCallback(
      (productId: string) => {
        onAction({ type: 'ADD_TO_CART', payload: { id: productId } });
      },
      [onAction]
    );
    const handleSeeAll = React.useCallback(() => {
      if (grid.products.length > 0) {
        onAction({ type: 'OPEN_CATEGORY', payload: { id: grid.products[0].categoryId ?? 'all' } });
      }
    }, [grid.products, onAction]);
    return (
      <ProductGrid2x2
        title={grid.title}
        subtitle={grid.subtitle}
        products={grid.products}
        onAddToCart={handleAddToCart}
        onSeeAll={handleSeeAll}
      />
    );
  });

const DynamicCollectionRenderer: React.FC<{ component: UIComponent; onAction: (action: ActionSchema) => void }> =
  React.memo(({ component, onAction }) => {
    const collection = component as Extract<UIComponent, { type: 'DYNAMIC_COLLECTION' }>;
    const handleItemPress = React.useCallback(
      (item: { id: string; name: string; price: number; image: string; action?: ActionSchema }) => {
        if (item.action) {
          onAction(item.action);
        } else {
          onAction({ type: 'OPEN_CATEGORY', payload: { id: item.id } });
        }
      },
      [onAction]
    );
    const handleAddToCart = React.useCallback(
      (productId: string) => {
        onAction({ type: 'ADD_TO_CART', payload: { id: productId } });
      },
      [onAction]
    );
    const handleSeeAll = React.useCallback(() => {
      if (collection.items.length > 0) {
        onAction({ type: 'OPEN_CATEGORY', payload: { id: collection.items[0].id } });
      }
    }, [collection.items, onAction]);
    return (
      <DynamicCollection
        title={collection.title}
        subtitle={collection.subtitle}
        items={collection.items}
        onItemPress={handleItemPress}
        onAddToCart={handleAddToCart}
        onSeeAll={handleSeeAll}
      />
    );
  });

const FullScreenOverlayRenderer: React.FC<{ component: UIComponent; onAction: (action: ActionSchema) => void }> =
  React.memo(({ component }) => {
    const overlay = component as Extract<UIComponent, { type: 'FULL_SCREEN_OVERLAY' }>;
    return <FullScreenOverlay animationUrl={overlay.animationUrl} />;
  });

class ComponentRegistry {
  private registry: Map<string, ComponentFactory> = new Map();

  constructor() {
    this.register('BANNER_HERO', (comp, onAction) => (
      <BannerHeroRenderer key={comp.id} component={comp} onAction={onAction} />
    ));
    this.register('PRODUCT_GRID_2X2', (comp, onAction) => (
      <ProductGridRenderer key={comp.id} component={comp} onAction={onAction} />
    ));
    this.register('DYNAMIC_COLLECTION', (comp, onAction) => (
      <DynamicCollectionRenderer key={comp.id} component={comp} onAction={onAction} />
    ));
    this.register('FULL_SCREEN_OVERLAY', (comp, onAction) => (
      <FullScreenOverlayRenderer key={comp.id} component={comp} onAction={onAction} />
    ));
  }

  register(type: string, factory: ComponentFactory) {
    this.registry.set(type, factory);
  }

  render(type: string, component: UIComponent, onAction: (action: ActionSchema) => void): React.ReactElement | null {
    if (type === 'UNKNOWN') {
      const unknown = component as UnknownComponent;
      if (__DEV__) {
        console.warn(
          `ComponentRegistry: Silently dropping unknown component "${unknown.originalType ?? 'UNKNOWN'}" (id: ${unknown.id})`
        );
      }
      return null;
    }

    const factory = this.registry.get(type);
    if (!factory) {
      if (__DEV__) {
        console.warn(`ComponentRegistry: No factory for type "${type}" - silently dropping`);
      }
      return null;
    }
    return factory(component, onAction);
  }
}

export const componentRegistry = new ComponentRegistry();
