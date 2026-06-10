import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LOANS = [
  { id: 'L001', borrower: 'Ravi Kumar',   lender: 'Sunita Rao',   amount: '₹50,000',   rate: '12%', tenure: '12M', status: 'Active',   emi: '₹4,442', due: '05 Jun 2025' },
  { id: 'L002', borrower: 'Kavita Singh', lender: 'Arjun Patel',  amount: '₹1,20,000', rate: '14%', tenure: '24M', status: 'Active',   emi: '₹5,780', due: '08 Jun 2025' },
  { id: 'L003', borrower: 'Mohan Das',    lender: 'Sunita Rao',   amount: '₹30,000',   rate: '15%', tenure: '6M',  status: 'Overdue',  emi: '₹5,200', due: '01 Jun 2025' },
  { id: 'L004', borrower: 'Anita Joshi',  lender: 'Priya Sharma', amount: '₹75,000',   rate: '11%', tenure: '18M', status: 'Closed',   emi: '₹4,590', due: '—' },
  { id: 'L005', borrower: 'Ravi Kumar',   lender: 'Deepak Mehra', amount: '₹20,000',   rate: '13%', tenure: '3M',  status: 'Pending',  emi: '₹6,950', due: '—' },
  { id: 'L006', borrower: 'Arjun Patel',  lender: 'Sunita Rao',   amount: '₹2,00,000', rate: '10%', tenure: '36M', status: 'Active',   emi: '₹6,450', due: '12 Jun 2025' },
  { id: 'L007', borrower: 'Kavita Singh', lender: 'Arjun Patel',  amount: '₹40,000',   rate: '16%', tenure: '9M',  status: 'Rejected', emi: '—',      due: '—' },
];

const STATUS_COLOR: Record<string, string> = {
  Active: '#10b981', Overdue: '#ef4444', Closed: '#6b7280', Pending: '#f59e0b', Rejected: '#ef4444',
};
const FILTERS = ['All', 'Active', 'Overdue', 'Pending', 'Closed', 'Rejected'];

export default function AdminLoansScreen() {
  const [filter, setFilter] = useState('All');
  const filtered = LOANS.filter((l) => filter === 'All' || l.status === filter);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>All Loans</Text>
          <View style={s.badge}><Text style={s.badgeText}>{LOANS.length}</Text></View>
        </View>

        {/* Mini stats */}
        <View style={s.miniRow}>
          {[['Active','#10b981'],['Overdue','#ef4444'],['Pending','#f59e0b']].map(([lbl, clr]) => (
            <View key={lbl} style={[s.miniCard, { borderColor: clr + '40' }]}>
              <Text style={[s.miniVal, { color: clr }]}>{LOANS.filter(l => l.status === lbl).length}</Text>
              <Text style={s.miniLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow} style={{ marginBottom: 14 }}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.chip, filter === f && { backgroundColor: STATUS_COLOR[f] ?? '#6366f1', borderColor: 'transparent' }]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.chipTxt, filter === f && { color: '#fff' }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map((loan) => (
          <View key={loan.id} style={s.card}>
            <View style={s.cardTop}>
              <Text style={s.loanId}>{loan.id}</Text>
              <View style={[s.statusBadge, { backgroundColor: STATUS_COLOR[loan.status] + '20' }]}>
                <View style={[s.dot, { backgroundColor: STATUS_COLOR[loan.status] }]} />
                <Text style={[s.statusTxt, { color: STATUS_COLOR[loan.status] }]}>{loan.status}</Text>
              </View>
            </View>
            <View style={s.parties}>
              <View style={s.party}>
                <Text style={s.partyLbl}>Borrower</Text>
                <Text style={s.partyName}>{loan.borrower}</Text>
              </View>
              <Ionicons name="swap-horizontal-outline" size={20} color="#3a3a4a" />
              <View style={s.party}>
                <Text style={s.partyLbl}>Lender</Text>
                <Text style={s.partyName}>{loan.lender}</Text>
              </View>
            </View>
            <View style={s.detailRow}>
              {[['Amount', loan.amount], ['Rate', loan.rate], ['Tenure', loan.tenure], ['EMI', loan.emi]].map(([k, v]) => (
                <View key={k} style={s.detail}>
                  <Text style={s.detailLbl}>{k}</Text>
                  <Text style={s.detailVal}>{v}</Text>
                </View>
              ))}
            </View>
            {loan.due !== '—' && (
              <View style={s.dueRow}>
                <Ionicons name="calendar-outline" size={13} color="#f59e0b" />
                <Text style={s.dueTxt}>Next EMI: {loan.due}</Text>
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 32, paddingBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  badge: { backgroundColor: '#10b981', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  miniRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  miniCard: { flex: 1, backgroundColor: '#1a1a24', borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center', gap: 4 },
  miniVal: { fontSize: 20, fontWeight: '800' },
  miniLbl: { fontSize: 11, color: '#8b8b99', fontWeight: '600' },
  filterRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#1a1a24', borderWidth: 1, borderColor: '#2a2a36' },
  chipTxt: { fontSize: 12, fontWeight: '600', color: '#8b8b99' },
  card: { backgroundColor: '#1a1a24', borderRadius: 16, borderWidth: 1, borderColor: '#2a2a36', padding: 16, marginBottom: 12, gap: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loanId: { fontSize: 13, fontWeight: '700', color: '#6b7280' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusTxt: { fontSize: 12, fontWeight: '700' },
  parties: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#12121e', borderRadius: 10, padding: 12 },
  party: { alignItems: 'center', gap: 3 },
  partyLbl: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  partyName: { fontSize: 13, color: '#fff', fontWeight: '700' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detail: { alignItems: 'center', gap: 3 },
  detailLbl: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  detailVal: { fontSize: 14, color: '#fff', fontWeight: '700' },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dueTxt: { fontSize: 12, color: '#f59e0b', fontWeight: '500' },
});
