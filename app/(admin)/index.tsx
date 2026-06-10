import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';

const STATS = [
  { label: 'Total Users',    value: '1,284',  icon: 'people',          color: '#6366f1', bg: '#6366f120' },
  { label: 'Active Loans',   value: '342',    icon: 'cash',            color: '#10b981', bg: '#10b98120' },
  { label: 'Total Disbursed',value: '₹4.2Cr', icon: 'trending-up',     color: '#f59e0b', bg: '#f59e0b20' },
  { label: 'Pending KYC',    value: '57',     icon: 'alert-circle',    color: '#ef4444', bg: '#ef444420' },
];

const RECENT_ACTIVITY = [
  { id: 'A001', user: 'Ravi Kumar',   action: 'Loan Applied',    amount: '₹50,000', time: '2 min ago',  status: 'pending' },
  { id: 'A002', user: 'Priya Sharma', action: 'KYC Submitted',   amount: '—',       time: '15 min ago', status: 'review'  },
  { id: 'A003', user: 'Arjun Patel',  action: 'EMI Paid',        amount: '₹8,200',  time: '1 hr ago',   status: 'success' },
  { id: 'A004', user: 'Sunita Rao',   action: 'Loan Approved',   amount: '₹1,20,000',time: '3 hr ago',  status: 'success' },
  { id: 'A005', user: 'Mohan Das',    action: 'EMI Overdue',     amount: '₹5,500',  time: '5 hr ago',   status: 'danger'  },
];

const STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b',
  review:  '#6366f1',
  success: '#10b981',
  danger:  '#ef4444',
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.adminName}>{user?.name ?? 'Admin'}</Text>
            <View style={styles.badgeRow}>
              <Ionicons name="shield-checkmark" size={13} color="#f59e0b" />
              <Text style={styles.badgeText}>Administrator</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, { borderColor: s.color + '30' }]}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickRow}>
          {[
            { label: 'All Users',   icon: 'people-outline',    route: '/(admin)/users',   color: '#6366f1' },
            { label: 'All Loans',   icon: 'cash-outline',      route: '/(admin)/loans',   color: '#10b981' },
            { label: 'Reports',     icon: 'bar-chart-outline', route: '/(admin)/reports', color: '#f59e0b' },
          ].map((q) => (
            <TouchableOpacity
              key={q.label}
              style={styles.quickCard}
              onPress={() => router.push(q.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickIcon, { backgroundColor: q.color + '20' }]}>
                <Ionicons name={q.icon as any} size={24} color={q.color} />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        <View style={styles.activityCard}>
          {RECENT_ACTIVITY.map((item, idx) => (
            <View key={item.id} style={[styles.activityRow, idx < RECENT_ACTIVITY.length - 1 && styles.activityDivider]}>
              <View style={[styles.activityDot, { backgroundColor: STATUS_COLOR[item.status] }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityUser}>{item.user}</Text>
                <Text style={styles.activityAction}>{item.action}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.activityAmount, { color: STATUS_COLOR[item.status] }]}>
                  {item.amount}
                </Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 32,
    paddingBottom: 24,
  },
  greeting: { fontSize: 14, color: '#8b8b99', marginBottom: 4 },
  adminName: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  badgeText: { fontSize: 12, color: '#f59e0b', fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#1a1a24',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a36',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  statIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 12, color: '#8b8b99', fontWeight: '500' },

  sectionTitle: { fontSize: 11, color: '#6b7280', fontWeight: '700', letterSpacing: 1.2, marginBottom: 12 },

  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  quickCard: {
    flex: 1,
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a36',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: 12, color: '#d1d1d6', fontWeight: '600' },

  activityCard: {
    backgroundColor: '#1a1a24',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a36',
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: '#2a2a36' },
  activityDot: { width: 10, height: 10, borderRadius: 5 },
  activityUser: { fontSize: 14, fontWeight: '700', color: '#fff' },
  activityAction: { fontSize: 12, color: '#8b8b99', marginTop: 2 },
  activityAmount: { fontSize: 13, fontWeight: '700' },
  activityTime: { fontSize: 11, color: '#6b7280', marginTop: 2 },
});
