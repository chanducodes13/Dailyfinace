import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MONTHLY = [
  { month: 'Jan', disbursed: 38, collected: 31 },
  { month: 'Feb', disbursed: 52, collected: 44 },
  { month: 'Mar', disbursed: 45, collected: 40 },
  { month: 'Apr', disbursed: 67, collected: 58 },
  { month: 'May', disbursed: 73, collected: 62 },
];
const MAX_VAL = 80;

const SUMMARY = [
  { label: 'Total Disbursed',   value: '₹4.2 Cr', icon: 'trending-up',      color: '#10b981' },
  { label: 'Total Collected',   value: '₹3.6 Cr', icon: 'checkmark-circle', color: '#6366f1' },
  { label: 'Default Rate',      value: '3.2%',     icon: 'alert-circle',     color: '#ef4444' },
  { label: 'Avg Interest Rate', value: '12.8%',    icon: 'percent',          color: '#f59e0b' },
  { label: 'Active Lenders',    value: '84',        icon: 'person',           color: '#3b82f6' },
  { label: 'Active Borrowers',  value: '258',       icon: 'people',           color: '#8b5cf6' },
];

const TOP_LENDERS = [
  { name: 'Sunita Rao',    amount: '₹8,20,000', loans: 6, color: '#f59e0b' },
  { name: 'Arjun Patel',   amount: '₹5,60,000', loans: 4, color: '#6366f1' },
  { name: 'Priya Sharma',  amount: '₹3,80,000', loans: 3, color: '#10b981' },
  { name: 'Deepak Mehra',  amount: '₹2,10,000', loans: 2, color: '#ef4444' },
];

export default function AdminReportsScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Reports & Analytics</Text>
        <Text style={s.subtitle}>Platform overview · May 2025</Text>

        {/* Summary Cards */}
        <View style={s.grid}>
          {SUMMARY.map((item) => (
            <View key={item.label} style={[s.summaryCard, { borderColor: item.color + '30' }]}>
              <View style={[s.summaryIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={[s.summaryValue, { color: item.color }]}>{item.value}</Text>
              <Text style={s.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Bar Chart - Monthly */}
        <Text style={s.sectionTitle}>MONTHLY DISBURSEMENT vs COLLECTION (₹ Lakhs)</Text>
        <View style={s.chartCard}>
          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#6366f1' }]} />
              <Text style={s.legendTxt}>Disbursed</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={s.legendTxt}>Collected</Text>
            </View>
          </View>
          <View style={s.barSection}>
            {MONTHLY.map((m) => (
              <View key={m.month} style={s.barGroup}>
                <View style={s.barPair}>
                  <View style={[s.bar, { height: (m.disbursed / MAX_VAL) * 120, backgroundColor: '#6366f1' }]} />
                  <View style={[s.bar, { height: (m.collected / MAX_VAL) * 120, backgroundColor: '#10b981' }]} />
                </View>
                <Text style={s.barLabel}>{m.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Lenders */}
        <Text style={s.sectionTitle}>TOP LENDERS BY VOLUME</Text>
        <View style={s.listCard}>
          {TOP_LENDERS.map((l, idx) => (
            <View key={l.name} style={[s.lenderRow, idx < TOP_LENDERS.length - 1 && s.divider]}>
              <View style={[s.rank, { backgroundColor: l.color + '20' }]}>
                <Text style={[s.rankTxt, { color: l.color }]}>#{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.lenderName}>{l.name}</Text>
                <Text style={s.lenderMeta}>{l.loans} active loans</Text>
              </View>
              <Text style={[s.lenderAmount, { color: l.color }]}>{l.amount}</Text>
            </View>
          ))}
        </View>

        {/* Loan Distribution */}
        <Text style={s.sectionTitle}>LOAN STATUS DISTRIBUTION</Text>
        <View style={s.distCard}>
          {[
            { label: 'Active',   pct: 60, color: '#10b981' },
            { label: 'Closed',   pct: 20, color: '#6b7280' },
            { label: 'Overdue',  pct: 12, color: '#ef4444' },
            { label: 'Pending',  pct: 8,  color: '#f59e0b' },
          ].map((d) => (
            <View key={d.label} style={s.distRow}>
              <Text style={s.distLabel}>{d.label}</Text>
              <View style={s.distBarBg}>
                <View style={[s.distBar, { width: `${d.pct}%` as any, backgroundColor: d.color }]} />
              </View>
              <Text style={[s.distPct, { color: d.color }]}>{d.pct}%</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', paddingTop: 32 },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 24, marginTop: 4 },
  sectionTitle: { fontSize: 11, color: '#6b7280', fontWeight: '700', letterSpacing: 1.1, marginBottom: 12, marginTop: 4 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  summaryCard: {
    width: '47%', backgroundColor: '#1a1a24', borderRadius: 14,
    borderWidth: 1, padding: 14, gap: 6,
  },
  summaryIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 11, color: '#8b8b99', fontWeight: '500' },

  chartCard: { backgroundColor: '#1a1a24', borderRadius: 16, borderWidth: 1, borderColor: '#2a2a36', padding: 16, marginBottom: 24 },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { fontSize: 12, color: '#8b8b99', fontWeight: '500' },
  barSection: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barGroup: { alignItems: 'center', gap: 6 },
  barPair: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bar: { width: 18, borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 12, color: '#6b7280', fontWeight: '600' },

  listCard: { backgroundColor: '#1a1a24', borderRadius: 16, borderWidth: 1, borderColor: '#2a2a36', marginBottom: 24, overflow: 'hidden' },
  lenderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#2a2a36' },
  rank: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rankTxt: { fontSize: 13, fontWeight: '800' },
  lenderName: { fontSize: 14, fontWeight: '700', color: '#fff' },
  lenderMeta: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  lenderAmount: { fontSize: 14, fontWeight: '800' },

  distCard: { backgroundColor: '#1a1a24', borderRadius: 16, borderWidth: 1, borderColor: '#2a2a36', padding: 16, gap: 14 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  distLabel: { width: 58, fontSize: 12, color: '#8b8b99', fontWeight: '600' },
  distBarBg: { flex: 1, height: 8, backgroundColor: '#2a2a36', borderRadius: 4, overflow: 'hidden' },
  distBar: { height: 8, borderRadius: 4 },
  distPct: { width: 36, fontSize: 12, fontWeight: '700', textAlign: 'right' },
});
