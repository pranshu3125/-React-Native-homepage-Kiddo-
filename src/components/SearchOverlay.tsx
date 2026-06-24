import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassContainer } from './GlassContainer';
import { useTheme } from '../context/ThemeProvider';
import { categories, campaigns } from '../mockData';
import { Category } from '../types/sdui';

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect: (category: Category) => void;
  onCampaignSelect: (campaignId: string) => void;
}

const RECENT_SEARCHES = ['diapers', 'baby lotion', 'school bag', 'toys', 'snacks'];
const POPULAR_SEARCHES = ['sunscreen', 'backpack', 'building blocks', 'teddy bear'];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  visible, onClose, onCategorySelect, onCampaignSelect,
}) => {
  const { theme, glass, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const matches: { type: 'category' | 'campaign'; label: string; icon: string; key: string }[] = [];

    categories.forEach((cat) => {
      if (cat.name.toLowerCase().includes(q) || cat.id.includes(q)) {
        matches.push({ type: 'category', label: cat.name, icon: cat.icon, key: cat.id });
      }
    });

    Object.entries(campaigns).forEach(([key, camp]) => {
      if (camp.name.toLowerCase().includes(q) || key.includes(q)) {
        matches.push({ type: 'campaign', label: camp.name, icon: '🎯', key });
      }
    });

    return matches.slice(0, 5);
  }, [query]);

  const handleSuggestion = useCallback((item: typeof suggestions[number]) => {
    if (item.type === 'category') {
      const cat = categories.find((c) => c.id === item.key);
      if (cat) {
        onCategorySelect(cat);
        onClose();
      }
    } else {
      onCampaignSelect(item.key);
      onClose();
    }
    setQuery('');
  }, [onCategorySelect, onCampaignSelect, onClose]);

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: isDark ? '#0D1117' : '#F7F8FA' }]}>
      <GlassContainer intensity="heavy" borderRadius={20} style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.inputWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F8' }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            placeholder="What are you looking for?"
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#E8E8F0' }]}>
            <Text style={[styles.closeText, { color: theme.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </GlassContainer>

      {!query.trim() && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Recent Searches</Text>
            <View style={styles.chipRow}>
              {RECENT_SEARCHES.map((s) => (
                <TouchableOpacity key={s} style={[styles.chip, glass(0.5)]} onPress={() => setQuery(s)}>
                  <Text style={[styles.chipText, { color: theme.textPrimary }]}>🕐 {s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Popular Searches</Text>
            <View style={styles.chipRow}>
              {POPULAR_SEARCHES.map((s) => (
                <TouchableOpacity key={s} style={[styles.chip, glass(0.5)]} onPress={() => setQuery(s)}>
                  <Text style={[styles.chipText, { color: theme.textPrimary }]}>🔥 {s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Browse Categories</Text>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.catRow, { borderBottomColor: theme.border ?? '#F0F0F0' }]} onPress={() => { onCategorySelect(cat); onClose(); }}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catName, { color: theme.textPrimary }]}>{cat.name}</Text>
                <Text style={[styles.catChevron, { color: theme.textSecondary }]}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {query.trim() && suggestions.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Suggestions</Text>
          {suggestions.map((s) => (
            <TouchableOpacity key={s.key + s.type} style={[styles.catRow, { borderBottomColor: theme.border ?? '#F0F0F0' }]} onPress={() => handleSuggestion(s)}>
              <Text style={styles.catIcon}>{s.icon}</Text>
              <Text style={[styles.catName, { color: theme.textPrimary }]}>{s.label}</Text>
              <Text style={[styles.catType, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F8', color: theme.textSecondary }]}>{s.type === 'category' ? 'Category' : 'Campaign'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {query.trim() && suggestions.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyText, { color: theme.textPrimary }]}>No results for "{query}"</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Try searching diapers, toys, or school supplies</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000 },
  header: { paddingHorizontal: 16, paddingBottom: 12, marginHorizontal: 0, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 14, height: 48 },
  searchIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontWeight: '500', padding: 0 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  closeText: { fontSize: 14, fontWeight: '700' },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  chipText: { fontSize: 13, fontWeight: '500' },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  catIcon: { fontSize: 20, marginRight: 12 },
  catName: { flex: 1, fontSize: 15, fontWeight: '600' },
  catChevron: { fontSize: 20, fontWeight: '300' },
  catType: { fontSize: 11, fontWeight: '500', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  emptyContainer: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  emptySubtext: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
