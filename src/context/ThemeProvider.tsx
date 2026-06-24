import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { ViewStyle, Platform } from 'react-native';
import { ThemeConfig, CampaignConfig } from '../types/sdui';
import { categoryThemes } from '../mockData';

export const lightPalette: ThemeConfig = {
  primary: '#FF6B35',
  background: '#F7F8FA',
  accent: '#4ECDC4',
  textPrimary: '#1A1A2E',
  textSecondary: '#718096',
  cardBackground: '#FFFFFF',
  chipBackground: '#FF6B35',
  chipText: '#FFFFFF',
  border: '#E2E8F0',
  glassBg: 'rgba(255,255,255,0.6)',
  glassBorder: 'rgba(255,255,255,0.3)',
};

export const darkPalette: ThemeConfig = {
  primary: '#FF8A50',
  background: '#0D1117',
  accent: '#5EEAD4',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  cardBackground: '#161B22',
  chipBackground: '#FF8A50',
  chipText: '#FFFFFF',
  border: '#30363D',
  glassBg: 'rgba(22,27,34,0.6)',
  glassBorder: 'rgba(48,54,61,0.3)',
};

interface ThemeContextValue {
  theme: ThemeConfig;
  campaign?: CampaignConfig | null;
  setCampaign: (campaign: CampaignConfig | null) => void;
  categoryTheme: string | null;
  setCategoryTheme: (themeId: string | null) => void;
  isDark: boolean;
  toggleDark: () => void;
  glass: (opacity?: number) => ViewStyle;
  activeTheme: ThemeConfig;
}

const defaultTheme: ThemeConfig = { ...lightPalette };

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  campaign: null,
  setCampaign: () => {},
  categoryTheme: null,
  setCategoryTheme: () => {},
  isDark: false,
  toggleDark: () => {},
  glass: () => ({}),
  activeTheme: defaultTheme,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [campaign, setCampaignState] = useState<CampaignConfig | null>(null);
  const [categoryThemeId, setCategoryThemeId] = useState<string | null>(null);

  const baseTheme = isDark ? darkPalette : lightPalette;

  const theme = useMemo(() => {
    if (campaign?.theme) {
      return {
        ...baseTheme,
        ...campaign.theme,
        glassBg: isDark ? 'rgba(22,27,34,0.6)' : 'rgba(255,255,255,0.6)',
        glassBorder: isDark ? 'rgba(48,54,61,0.3)' : 'rgba(255,255,255,0.3)',
      };
    }
    if (categoryThemeId && categoryThemes[categoryThemeId]) {
      const catTheme = categoryThemes[categoryThemeId] as ThemeConfig;
      return {
        ...baseTheme,
        ...catTheme,
        glassBg: isDark ? 'rgba(22,27,34,0.6)' : 'rgba(255,255,255,0.6)',
        glassBorder: isDark ? 'rgba(48,54,61,0.3)' : 'rgba(255,255,255,0.3)',
      };
    }
    return baseTheme;
  }, [campaign, categoryThemeId, baseTheme, isDark]);

  const setCampaign = useCallback((newCampaign: CampaignConfig | null) => {
    setCampaignState(newCampaign);
    setCategoryThemeId(null);
  }, []);

  const setCategoryTheme = useCallback((themeId: string | null) => {
    setCategoryThemeId(themeId);
    setCampaignState(null);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const glass = useCallback(
    (opacity = 0.6): ViewStyle => ({
      backgroundColor: isDark ? `rgba(22,27,34,${opacity})` : `rgba(255,255,255,${opacity})`,
      ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' as any } : {}),
      borderWidth: 1,
      borderColor: isDark ? 'rgba(48,54,61,0.3)' : 'rgba(255,255,255,0.3)',
    }),
    [isDark]
  );

  const value = useMemo(
    () => ({
      theme,
      campaign,
      setCampaign,
      categoryTheme: categoryThemeId,
      setCategoryTheme,
      isDark,
      toggleDark,
      glass,
      activeTheme: baseTheme,
    }),
    [theme, campaign, setCampaign, categoryThemeId, setCategoryTheme, isDark, toggleDark, glass, baseTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
