import React, { useMemo } from 'react';
import { View, StyleSheet, Text, DimensionValue } from 'react-native';
import { useTheme } from '../context/ThemeProvider';

interface FullScreenOverlayProps {
  animationUrl: string;
}

interface ConfettiPos {
  left: DimensionValue;
  top: DimensionValue;
  rotate: string;
  scale: number;
}

const CONFETTI_POSITIONS: ConfettiPos[] = [
  { left: '5%', top: '10%', rotate: '15deg', scale: 1.0 },
  { left: '25%', top: '5%', rotate: '-20deg', scale: 0.8 },
  { left: '45%', top: '12%', rotate: '10deg', scale: 1.1 },
  { left: '65%', top: '3%', rotate: '-5deg', scale: 0.9 },
  { left: '85%', top: '8%', rotate: '25deg', scale: 1.0 },
  { left: '15%', top: '40%', rotate: '-30deg', scale: 0.7 },
  { left: '35%', top: '35%', rotate: '5deg', scale: 1.2 },
  { left: '55%', top: '45%', rotate: '-15deg', scale: 0.8 },
  { left: '75%', top: '38%', rotate: '20deg', scale: 1.0 },
  { left: '10%', top: '70%', rotate: '-10deg', scale: 0.9 },
  { left: '40%', top: '75%', rotate: '15deg', scale: 0.7 },
  { left: '70%', top: '68%', rotate: '-25deg', scale: 1.1 },
  { left: '50%', top: '88%', rotate: '8deg', scale: 0.8 },
  { left: '30%', top: '92%', rotate: '-12deg', scale: 1.0 },
  { left: '90%', top: '82%', rotate: '22deg', scale: 0.7 },
];

const getCampaignEmojis = (url: string): string[] => {
  if (url.includes('paper_airplane')) {
    return ['📚', '✏️', '✈️', '📝', '🎒', '📏', '📐', '🖍️', '📖', '📓', '✂️', '📌', '🗒️', '🧮', '🎨'];
  }
  if (url.includes('water_splash')) {
    return ['🌊', '☀️', '🏖️', '🌴', '🩱', '🐚', '🏄', '⛱️', '🍉', '🏊', '🦀', '🐠', '🏐', '🧴', '🍦'];
  }
  if (url.includes('confetti')) {
    return ['🎉', '🎊', '🎈', '🎁', '✨', '🌟', '🎆', '🎇', '💫', '🎭', '🎪', '🎠', '🎡', '🎢', '🃏'];
  }
  return ['✨', '🌟', '💫', '⭐', '🎯', '🎪'];
};

export const FullScreenOverlay: React.FC<FullScreenOverlayProps> = React.memo(
  ({ animationUrl }) => {
    const { theme, campaign } = useTheme();

    const emojis = useMemo(() => getCampaignEmojis(animationUrl), [animationUrl]);

    return (
      <View style={styles.overlay} pointerEvents="none">
        <View style={[styles.bgTint, { backgroundColor: theme.primary }]} pointerEvents="none" />
        <View style={styles.elements} pointerEvents="none">
          {CONFETTI_POSITIONS.map((pos, i) => (
            <Text
              key={i}
              style={[
                styles.emoji,
                {
                  left: pos.left,
                  top: pos.top,
                  opacity: 0.08 + (i % 5) * 0.04,
                  fontSize: 20 + (i % 4) * 8,
                  transform: [{ rotate: pos.rotate }, { scale: pos.scale }],
                },
              ]}
            >
              {emojis[i % emojis.length]}
            </Text>
          ))}
        </View>
        {campaign && (
          <View style={styles.campaignLabelContainer} pointerEvents="none">
            <Text style={styles.campaignLabel}>{campaign.name}</Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  bgTint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  elements: {
    ...StyleSheet.absoluteFillObject,
  },
  emoji: {
    position: 'absolute',
  },
  campaignLabelContainer: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  campaignLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
