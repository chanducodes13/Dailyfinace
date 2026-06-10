import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout, updateProfile } = useAuth();

  const cardBg = isDark ? '#1e2433' : '#ffffff';
  const cardBorder = isDark ? '#2d3748' : '#e5e7eb';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';

  // 'lender' | 'borrower' → locked; anything else → both open
  const activeRole =
    user?.role === 'lender' || user?.role === 'borrower' ? user.role : null;

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleSelectRole = async (role: 'lender' | 'borrower') => {
    await updateProfile({ role });
    router.push(role === 'lender' ? '/(tabs)/lender' : '/(tabs)/borrower');
  };

  const handleSwitchRole = async () => {
    // Reset — both cards become active again
    await updateProfile({ role: null });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Top Banner */}
      <View style={[styles.banner, { backgroundColor: isDark ? '#0f172a' : '#1a56db' }]}>
        <View style={styles.bannerTop}>
          <View>
            <ThemedText style={styles.bannerGreeting}>Welcome back 👋</ThemedText>
            <ThemedText style={styles.bannerTitle}>{user?.full_name ?? 'LoanConnect'}</ThemedText>
            <ThemedText style={styles.bannerSub}>A trusted peer-to-peer lending platform</ThemedText>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* User strip */}
        <View style={styles.userStrip}>
          <Ionicons name="person-circle-outline" size={14} color="rgba(255,255,255,0.7)" />
          <ThemedText style={styles.userMobile}>{user?.mobile ?? ''}</ThemedText>
          {activeRole && (
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    activeRole === 'lender'
                      ? 'rgba(26,86,219,0.4)'
                      : 'rgba(124,58,237,0.4)',
                },
              ]}
            >
              <ThemedText style={styles.roleText}>
                {activeRole === 'lender' ? '💰 Lender' : '🏦 Borrower'}
              </ThemedText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.body}>
        {/* Section header */}
        <View style={styles.sectionRow}>
          <ThemedText style={[styles.sectionTitle, { color: mutedColor }]}>
            CHOOSE YOUR ROLE
          </ThemedText>
          {activeRole && (
            <TouchableOpacity style={styles.switchBtn} onPress={handleSwitchRole}>
              <Ionicons name="swap-horizontal-outline" size={13} color="#f59e0b" />
              <ThemedText style={styles.switchBtnText}>Switch Role</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Lender Card */}
        {(() => {
          const isDisabled = activeRole === 'borrower';
          const isActive = activeRole === 'lender';
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: isDisabled
                    ? isDark ? '#13161f' : '#f3f4f6'
                    : cardBg,
                  borderColor: isActive
                    ? '#1a56db'
                    : isDisabled
                    ? isDark ? '#1f2332' : '#e5e7eb'
                    : cardBorder,
                  borderWidth: isActive ? 2 : 1,
                },
                isDisabled && styles.cardDisabled,
              ]}
              onPress={() => !isDisabled && handleSelectRole('lender')}
              activeOpacity={isDisabled ? 1 : 0.85}
              disabled={isDisabled}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: isDisabled
                      ? 'rgba(26,86,219,0.05)'
                      : 'rgba(26,86,219,0.12)',
                  },
                ]}
              >
                <Ionicons
                  name="cash-outline"
                  size={36}
                  color={isDisabled ? '#3d5a9a' : '#1a56db'}
                />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                  <ThemedText
                    style={[styles.cardTitle, isDisabled && { color: mutedColor }]}
                  >
                    Lender
                  </ThemedText>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={18} color="#1a56db" />
                  )}
                  {isDisabled && (
                    <Ionicons name="lock-closed-outline" size={15} color={mutedColor} />
                  )}
                </View>
                <ThemedText
                  style={[
                    styles.cardDesc,
                    {
                      color: isDisabled
                        ? isDark ? '#4b5563' : '#c0c4cc'
                        : mutedColor,
                    },
                  ]}
                >
                  Post money offers, set your interest rate & tenure, and manage
                  applicants.
                </ThemedText>
              </View>
              <View
                style={[
                  styles.arrow,
                  {
                    backgroundColor: isDisabled
                      ? 'rgba(26,86,219,0.04)'
                      : 'rgba(26,86,219,0.1)',
                  },
                ]}
              >
                <Ionicons
                  name={isDisabled ? 'lock-closed' : 'chevron-forward'}
                  size={18}
                  color={isDisabled ? '#555' : '#1a56db'}
                />
              </View>
            </TouchableOpacity>
          );
        })()}

        {/* Borrower Card */}
        {(() => {
          const isDisabled = activeRole === 'lender';
          const isActive = activeRole === 'borrower';
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: isDisabled
                    ? isDark ? '#13161f' : '#f3f4f6'
                    : cardBg,
                  borderColor: isActive
                    ? '#7c3aed'
                    : isDisabled
                    ? isDark ? '#1f2332' : '#e5e7eb'
                    : cardBorder,
                  borderWidth: isActive ? 2 : 1,
                },
                isDisabled && styles.cardDisabled,
              ]}
              onPress={() => !isDisabled && handleSelectRole('borrower')}
              activeOpacity={isDisabled ? 1 : 0.85}
              disabled={isDisabled}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: isDisabled
                      ? 'rgba(124,58,237,0.05)'
                      : 'rgba(124,58,237,0.12)',
                  },
                ]}
              >
                <Ionicons
                  name="wallet-outline"
                  size={36}
                  color={isDisabled ? '#5b3a8a' : '#7c3aed'}
                />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                  <ThemedText
                    style={[styles.cardTitle, isDisabled && { color: mutedColor }]}
                  >
                    Borrower
                  </ThemedText>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={18} color="#7c3aed" />
                  )}
                  {isDisabled && (
                    <Ionicons name="lock-closed-outline" size={15} color={mutedColor} />
                  )}
                </View>
                <ThemedText
                  style={[
                    styles.cardDesc,
                    {
                      color: isDisabled
                        ? isDark ? '#4b5563' : '#c0c4cc'
                        : mutedColor,
                    },
                  ]}
                >
                  Browse available loan offers, filter by amount & rate, and request
                  money.
                </ThemedText>
              </View>
              <View
                style={[
                  styles.arrow,
                  {
                    backgroundColor: isDisabled
                      ? 'rgba(124,58,237,0.04)'
                      : 'rgba(124,58,237,0.1)',
                  },
                ]}
              >
                <Ionicons
                  name={isDisabled ? 'lock-closed' : 'chevron-forward'}
                  size={18}
                  color={isDisabled ? '#555' : '#7c3aed'}
                />
              </View>
            </TouchableOpacity>
          );
        })()}

        {/* Hint text when locked */}
        {activeRole && (
          <View style={[styles.hintBox, { borderColor: isDark ? '#2d3748' : '#e5e7eb' }]}>
            <Ionicons name="information-circle-outline" size={14} color="#f59e0b" />
            <ThemedText style={[styles.hintText, { color: mutedColor }]}>
              Locked as{' '}
              <ThemedText
                style={{
                  fontWeight: '700',
                  color: activeRole === 'lender' ? '#1a56db' : '#7c3aed',
                }}
              >
                {activeRole}
              </ThemedText>
              . Tap{' '}
              <ThemedText style={{ fontWeight: '700', color: '#f59e0b' }}>
                Switch Role
              </ThemedText>{' '}
              above to unlock both options.
            </ThemedText>
          </View>
        )}

        {/* Trust badges */}
        <View style={[styles.infoStrip, { borderColor: cardBorder, backgroundColor: cardBg }]}>
          {[
            { icon: 'shield-checkmark-outline', color: '#10b981', label: 'Secure' },
            { icon: 'flash-outline', color: '#f59e0b', label: 'Fast' },
            { icon: 'people-outline', color: '#3b82f6', label: 'Trusted' },
          ].map((item) => (
            <View key={item.label} style={styles.infoItem}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <ThemedText style={[styles.infoLabel, { color: mutedColor }]}>
                {item.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  bannerGreeting: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 4 },
  bannerTitle: { color: '#ffffff', fontSize: 26, fontWeight: '900', marginBottom: 4 },
  bannerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  userStrip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userMobile: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },
  roleBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  roleText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24, gap: 14 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.25)',
  },
  switchBtnText: { color: '#f59e0b', fontSize: 12, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardDisabled: { opacity: 0.4, elevation: 0, shadowOpacity: 0 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 18, fontWeight: '800' },
  cardDesc: { fontSize: 13, lineHeight: 19 },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  hintText: { flex: 1, fontSize: 12, lineHeight: 18 },
  infoStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  infoItem: { alignItems: 'center', gap: 6 },
  infoLabel: { fontSize: 12, fontWeight: '600' },
});
