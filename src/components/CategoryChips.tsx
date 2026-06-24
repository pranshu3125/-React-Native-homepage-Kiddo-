import React, { useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Category } from '../types/sdui';
import { useTheme } from '../context/ThemeProvider';

interface CategoryChipsProps {
  categories: Category[];
  selectedId: string;
  onSelect: (category: Category) => void;
  chipColor?: string;
  chipTextColor?: string;
}

const ChipItem: React.FC<{
  category: Category;
  isSelected: boolean;
  onSelect: (category: Category) => void;
  chipColor?: string;
  chipTextColor?: string;
}> = React.memo(({ category, isSelected, onSelect, chipColor, chipTextColor }) => {
  const { theme, glass, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && { backgroundColor: chipColor ?? '#FF6B35' },
        !isSelected && [styles.chipInactive, glass(0.4)],
      ]}
      onPress={() => onSelect(category)}
      activeOpacity={0.7}
    >
      <Text style={styles.chipIcon}>{category.icon}</Text>
      <Text
        style={[
          styles.chipLabel,
          isSelected && { color: chipTextColor ?? '#FFFFFF' },
          !isSelected && { color: theme.textSecondary },
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
});

export const CategoryChips: React.FC<CategoryChipsProps> = React.memo(
  ({ categories, selectedId, onSelect, chipColor, chipTextColor }) => {
    const { theme, glass, isDark } = useTheme();
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
      const idx = categories.findIndex((c) => c.id === selectedId);
      if (idx >= 0) {
        scrollRef.current?.scrollTo({ x: idx * 90 - 16, animated: true });
      }
    }, [selectedId, categories]);

    const handleSelect = useCallback(
      (category: Category) => {
        onSelect(category);
      },
      [onSelect]
    );

    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {categories.map((category) => (
            <ChipItem
              key={category.id}
              category={category}
              isSelected={selectedId === category.id}
              onSelect={handleSelect}
              chipColor={chipColor}
              chipTextColor={chipTextColor}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chipInactive: {
    borderWidth: 1,
    borderColor: '#E8E8F0',
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
