import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../context/ThemeProvider';
import { GlassContainer } from './GlassContainer';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(
  ({ placeholder = 'Search diapers, toys, milk powder...', value, onChangeText }) => {
    const { theme, glass, isDark } = useTheme();

    return (
      <View style={styles.wrapper}>
        <GlassContainer intensity="medium" style={[styles.container, { borderColor: theme.primary }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.voiceBtn} activeOpacity={0.7}>
            <Text style={styles.voiceIcon}>🎤</Text>
          </TouchableOpacity>
        </GlassContainer>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
  },
  voiceBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF0E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 16,
  },
});
