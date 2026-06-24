import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../context/ThemeProvider';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: 'light' | 'medium' | 'heavy';
  borderRadius?: number;
  noBorder?: boolean;
}

const INTENSITY_MAP = {
  light: { bg: 0.3, blur: '6px' },
  medium: { bg: 0.55, blur: '12px' },
  heavy: { bg: 0.75, blur: '20px' },
};

export const GlassContainer: React.FC<GlassContainerProps> = React.memo(
  ({ children, style, intensity = 'medium', borderRadius = 16, noBorder = false }) => {
    const { isDark } = useTheme();
    const inten = INTENSITY_MAP[intensity];

    const glassStyle = useMemo(
      () => ({
        backgroundColor: isDark
          ? `rgba(22,27,34,${inten.bg})`
          : `rgba(255,255,255,${inten.bg})`,
        ...(Platform.OS === 'web' ? { backdropFilter: `blur(${inten.blur})` as any } : {}),
        ...(noBorder ? {} : {
          borderWidth: 1,
          borderColor: isDark
            ? `rgba(48,54,61,${inten.bg * 0.5})`
            : `rgba(255,255,255,${inten.bg * 0.5})`,
        }),
        borderRadius,
      }),
      [isDark, inten.bg, inten.blur, borderRadius, noBorder]
    );

    return <View style={[glassStyle, style]}>{children}</View>;
  }
);
