import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const USERS = [
  { id: 'U001', name: 'Ravi Kumar',    mobile: '8888888888', role: 'Borrower', kyc: 'Verified',  loans: 2, joined: '12 Jan 2025' },
  { id: 'U002', name: 'Priya Sharma',  mobile: '9876543210', role: 'Lender',   kyc: 'Pending',   loans: 0, joined: '18 Feb 2025' },
  { id: 'U003', name: 'Arjun Patel',   mobile: '9123456780', role: 'Both',     kyc: 'Verified',  loans: 4, joined: '05 Mar 2025' },
  { id: 'U004', name: 'Sunita Rao',    mobile: '9988776655', role: 'Lender',   kyc: 'Verified',  loans: 6, joined: '22 Mar 2025' },
  { id: 'U005', name: 'Mohan Das',     mobile: '9345612780', role: 'Borrower', kyc: 'Rejected',  loans: 1, joined: '01 Apr 2025' },
  { id: 'U006', name: 'Kavita Singh',  mobile: '9700112233', role: 'Borrower', kyc: 'Verified',  loans: 3, joined: '10 Apr 2025' },
  { id: 'U007', name: 'Deepak Mehra',  mobile: '9456781230', role: 'Lender',   kyc: 'Pending',   loans: 0, joined: '19 Apr 2025' },
  { id: 'U008', name: 'Anita Joshi',   mobile: '9871234560', role: 'Borrower', kyc: 'Verified',  loans: 1, joined: '02 May 2025' },
];

const KYC_COLOR: Record<string, string> = {
  Verified: '#10b981',
  Pending:  '#f59e0b',
  Rejected: '#ef4444',
};

export default function AdminUsersScreen() {
  const [search, setSearch] = useState('');
  const [filterKyc, setFilterKyc] = useState<string>('All');

  const filtered = USERS.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search);
    const matchKyc = filterKyc === 'All' || u.kyc === filterKyc;
    return matchSearch && matchKyc;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Users</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{USERS.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color="#6b7280" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or mobile..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* KYC Filter */}
      <View style={styles.filterRow}>
        {['All', 'Verified', 'Pending', 'Rejected'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filterKyc === f && styles.filterChipActive]}
            onPress={() => setFilterKyc(f)}
          >
            <Text style={[styles.filterText, filterKyc === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((u) => (
          <View key={u.id} style={styles.card}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{u.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.cardTopRow}>
                <Text style={styles.userName}>{u.name}</Text>
                <View style={[styles.kycBadge, { backgroundColor: KYC_COLOR[u.kyc] + '20' }]}>
                  <Text style={[styles.kycText, { color: KYC_COLOR[u.kyc] }]}>{u.kyc}</Text>
                </View>
              </View>
              <Text style={styles.mobile}>{u.mobile}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.metaText}>🏷 {u.role}</Text>
                <Text style={styles.metaText}>📋 {u.loans} loans</Text>
                <Text style={styles.metaText}>📅 {u.joined}</Text>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: 32, paddingBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  countBadge: { backgroundColor: '#6366f1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  countText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a24', borderRadius: 12, borderWidth: 1,
    borderColor: '#2a2a36', marginHorizontal: 20, paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchInput: { flex: 1, paddingVertical: 13, color: '#fff', fontSize: 14 },

  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: '#1a1a24',
    borderWidth: 1, borderColor: '#2a2a36',
  },
  filterChipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#8b8b99' },
  filterTextActive: { color: '#fff' },

  list: { flex: 1, paddingHorizontal: 20 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#1a1a24', borderRadius: 16, borderWidth: 1,
    borderColor: '#2a2a36', padding: 14, marginBottom: 10,
  },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#6366f120', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#6366f1' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  userName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  kycBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  kycText: { fontSize: 11, fontWeight: '700' },
  mobile: { fontSize: 12, color: '#8b8b99', marginBottom: 8 },
  cardMeta: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  metaText: { fontSize: 11, color: '#6b7280' },
});
