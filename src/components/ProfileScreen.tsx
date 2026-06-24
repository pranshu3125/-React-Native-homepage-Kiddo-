import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassContainer } from './GlassContainer';
import { useTheme } from '../context/ThemeProvider';

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const { theme, glass, isDark, toggleDark } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#0D1117' : '#F7F8FA' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0D1117' : '#FFFFFF'} />
      <GlassContainer intensity="heavy" borderRadius={0} noBorder style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F8' }]} onPress={onBack} activeOpacity={0.7}>
            <Text style={[styles.backArrow, { color: theme.textPrimary }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
      </GlassContainer>

      <GlassContainer intensity="medium" borderRadius={0} noBorder style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: isDark ? 'rgba(255,107,53,0.2)' : '#FFF0E8' }]}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={[styles.userName, { color: theme.textPrimary }]}>Pranshu Paruthi</Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>pranshu@kiddo.in</Text>
        <Text style={[styles.userPhone, { color: theme.textSecondary }]}>+91 98765 43210</Text>
      </GlassContainer>

      <GlassContainer intensity="medium" borderRadius={0} noBorder style={styles.menuSection}>
        {[
          { icon: '📦', label: 'My Orders', subtitle: 'View order history' },
          { icon: '❤️', label: 'Wishlist', subtitle: '2 items saved' },
          { icon: '📍', label: 'Saved Addresses', subtitle: '3 addresses' },
          { icon: '🎁', label: 'Gift Cards', subtitle: '₹500 balance' },
          { icon: isDark ? '☀️' : '🌙', label: isDark ? 'Light Mode' : 'Dark Mode', subtitle: 'Toggle appearance', action: toggleDark },
          { icon: '⚙️', label: 'Settings', subtitle: 'Notifications, privacy' },
          { icon: '❓', label: 'Help & Support', subtitle: 'FAQs, contact us' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={[styles.menuItem, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5' }]} activeOpacity={0.6} onPress={item.action}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{item.label}</Text>
              <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
            </View>
            <Text style={[styles.menuChevron, { color: theme.textSecondary }]}>›</Text>
          </TouchableOpacity>
        ))}
      </GlassContainer>

      <TouchableOpacity style={[styles.logoutBtn, { borderColor: '#FF4757' }]} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 20, fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSpacer: { width: 40 },
  profileCard: { alignItems: 'center', paddingVertical: 24, marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32 },
  userName: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 13, fontWeight: '500' },
  userPhone: { fontSize: 13, fontWeight: '500', marginTop: 2 },
  menuSection: { marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuTextWrap: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600' },
  menuSubtitle: { fontSize: 11, fontWeight: '500', marginTop: 1 },
  menuChevron: { fontSize: 22, fontWeight: '300' },
  logoutBtn: { marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', marginTop: 12 },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#FF4757' },
});
