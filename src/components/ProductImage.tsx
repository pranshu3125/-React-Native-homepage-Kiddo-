import React, { useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

const PRODUCT_FALLBACKS: Record<string, string> = {
  p1: '🧴', p2: '🧢', p3: '🧸', p4: '🩱', p5: '🍶',
  p6: '🕶️', p10: '🧴', p11: '🧻', p12: '🧴', p13: '🧴',
  p20: '🍪', p21: '🥣', p22: '🍪', p23: '🍘', p24: '🍿',
  p25: '🍦', p30: '🍱', p31: '🎒', p32: '🍶', p33: '✏️',
  p34: '📓', p35: '🖍️', p40: '🛞', p41: '🚲', p42: '📹',
  p43: '👶', p50: '🧼', p51: '🧴', p52: '🧴', p53: '🧴',
  p54: '🧴', p55: '🌡️', p60: '🍳', p61: '🥤', p62: '🥣',
  p63: '👕', p70: '🧱', p71: '🧩', p72: '🧸', p73: '💻',
  p80: '🛏️', p81: '🎵', p82: '🛏️',
};

const DEFAULT_FALLBACK = '📦';

interface ProductImageProps {
  uri: string;
  productId?: string;
  style?: any;
}

export const ProductImage: React.FC<ProductImageProps> = ({ uri, productId, style }) => {
  const [failed, setFailed] = useState(false);

  if (failed || !uri) {
    const fallback = productId ? PRODUCT_FALLBACKS[productId] ?? DEFAULT_FALLBACK : DEFAULT_FALLBACK;
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.fallbackEmoji}>{fallback}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackEmoji: {
    fontSize: 28,
  },
});
