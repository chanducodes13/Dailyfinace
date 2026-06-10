import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useLoans } from '@/context/loan-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


const AMOUNT_FILTERS = [
  { label: 'All', min: 0, max: Infinity },
  { label: '< ₹50K', min: 0, max: 50000 },
  { label: '₹50K–1L', min: 50000, max: 100000 },
  { label: '₹1L–2L', min: 100000, max: 200000 },
  { label: '> ₹2L', min: 200000, max: Infinity },
];

export default function BorrowerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { offers, requests, requestLoan } = useLoans();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'browse' | 'requests'>('browse');
  const [amountFilter, setAmountFilter] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [requestAmount, setRequestAmount] = useState('');
  const [requestNote, setRequestNote] = useState('');

  const filter = AMOUNT_FILTERS[amountFilter];
  const currentBorrowerName = user?.full_name || 'Ravi Kumar';

  // Filter available offers (only status: 'active')
  const totalActiveOffers = offers.filter((p) => p.status === 'active');
  const availableOffers = totalActiveOffers.filter((p) => {
    const inAmount = p.amount >= filter.min && p.amount <= filter.max;
    const inSearch =
      p.lenderName.toLowerCase().includes(searchText.toLowerCase()) ||
      p.location.toLowerCase().includes(searchText.toLowerCase());
    const inRate = maxRate ? p.interestRate <= parseFloat(maxRate) : true;
    return inAmount && inSearch && inRate;
  });

  // Filter my requests
  const mySentRequests = requests.filter((r) => r.borrowerName === currentBorrowerName);

  const handleRequest = () => {
    if (!selectedPost) return;
    const amt = parseFloat(requestAmount);
    if (!requestAmount || isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (amt > selectedPost.amount) {
      Alert.alert('Exceeds Limit', `Max available is ₹${selectedPost.amount.toLocaleString('en-IN')}`);
      return;
    }

    requestLoan({
      offerId: selectedPost.id,
      lenderName: selectedPost.lenderName,
      borrowerName: currentBorrowerName,
      amount: amt,
      tenure: selectedPost.tenure,
      interestRate: selectedPost.interestRate,
      note: requestNote || 'Need urgent funds.',
    });

    setSelectedPost(null);
    setRequestAmount('');
    setRequestNote('');
    Alert.alert('Request Sent! ✅', `Your loan request of ₹${amt.toLocaleString('en-IN')} has been sent to ${selectedPost.lenderName}.`);
  };

  const renderStars = (rating: number) => {
    const cleanRating = rating || 4.5;
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < Math.floor(cleanRating) ? 'star' : i < cleanRating ? 'star-half' : 'star-outline'}
        size={12}
        color="#f59e0b"
      />
    ));
  };

  const getStatusColor = (status: string) => {
    if (status === 'approved') return '#10b981';
    if (status === 'rejected') return '#ef4444';
    return '#f59e0b';
  };

  const getStatusBg = (status: string) => {
    if (status === 'approved') return 'rgba(16,185,129,0.12)';
    if (status === 'rejected') return 'rgba(239,68,68,0.12)';
    return 'rgba(245,158,11,0.12)';
  };

  const cardBg = isDark ? '#1e2433' : '#ffffff';
  const cardBorder = isDark ? '#2d3748' : '#e5e7eb';
  const inputBg = isDark ? '#111827' : '#f9fafb';
  const inputBorder = isDark ? '#374151' : '#e5e7eb';
  const textColor = isDark ? '#f9fafb' : '#111827';
  const mutedColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#0f172a' : '#7c3aed' }]}>
        <View>
          <ThemedText style={styles.headerLabel}>Borrower Portal</ThemedText>
          <ThemedText style={styles.headerTitle}>Apply For Loans</ThemedText>
        </View>
        <View style={styles.headerBadge}>
          <ThemedText style={styles.headerBadgeText}>
            {activeTab === 'browse' ? `${totalActiveOffers.length} Live Offers` : `${mySentRequests.length} Requests`}
          </ThemedText>
        </View>
      </View>

      {/* Tab Selectors */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'browse' && styles.tabButtonActive]}
          onPress={() => setActiveTab('browse')}
        >
          <Ionicons name="search-outline" size={16} color={activeTab === 'browse' ? '#fff' : mutedColor} />
          <ThemedText style={[styles.tabButtonText, { color: activeTab === 'browse' ? '#fff' : mutedColor }]}>
            Browse Offers ({totalActiveOffers.length})
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'requests' && styles.tabButtonActive2]}
          onPress={() => setActiveTab('requests')}
        >
          <Ionicons name="document-text-outline" size={16} color={activeTab === 'requests' ? '#fff' : mutedColor} />
          <ThemedText style={[styles.tabButtonText, { color: activeTab === 'requests' ? '#fff' : mutedColor }]}>
            My Requests ({mySentRequests.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

      {activeTab === 'browse' ? (
        <>
          {/* Search & Filter */}
          <View style={styles.searchSection}>
            <View style={[styles.searchBar, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Ionicons name="search-outline" size={18} color={mutedColor} />
              <TextInput
                style={[styles.searchInput, { color: textColor }]}
                placeholder="Search lender or city..."
                placeholderTextColor={mutedColor}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText ? (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={18} color={mutedColor} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={[styles.rateInput, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Ionicons name="trending-up-outline" size={16} color="#f59e0b" />
              <TextInput
                style={[styles.rateInputField, { color: textColor }]}
                placeholder="Max %"
                placeholderTextColor={mutedColor}
                keyboardType="decimal-pad"
                value={maxRate}
                onChangeText={setMaxRate}
              />
            </View>
          </View>

          {/* Amount Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            {AMOUNT_FILTERS.map((f, idx) => (
              <TouchableOpacity
                key={f.label}
                style={[
                  styles.filterChip,
                  { borderColor: cardBorder },
                  amountFilter === idx && styles.filterChipActive,
                ]}
                onPress={() => setAmountFilter(idx)}
              >
                <ThemedText
                  style={[styles.filterChipText, { color: amountFilter === idx ? '#fff' : mutedColor }]}
                >
                  {f.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Offers List */}
          <FlatList
            data={availableOffers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={mutedColor} />
                <ThemedText style={[styles.emptyText, { color: mutedColor }]}>
                  No active loan offers match filters
                </ThemedText>
              </View>
            }
            renderItem={({ item }) => {
              const alreadyRequested = requests.some(r => r.offerId === item.id && r.borrowerName === currentBorrowerName);
              return (
                <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                  <View style={styles.cardTop}>
                    <View style={styles.avatarCircle}>
                      <ThemedText style={styles.avatarText}>
                        {item.lenderName.charAt(0).toUpperCase()}
                      </ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={[styles.lenderName, { color: textColor }]}>
                        {item.lenderName}
                      </ThemedText>
                      <View style={styles.starsRow}>
                        {renderStars(item.rating)}
                        <ThemedText style={[styles.ratingText, { color: mutedColor }]}>
                          {' '}({item.rating ? item.rating.toFixed(1) : '4.5'})
                        </ThemedText>
                      </View>
                      <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={12} color={mutedColor} />
                        <ThemedText style={[styles.locationText, { color: mutedColor }]}>
                          {item.location || 'India'}
                        </ThemedText>
                      </View>
                    </View>
                    <View>
                      <ThemedText style={[styles.cardAmount, { color: '#7c3aed' }]}>
                        ₹{item.amount.toLocaleString('en-IN')}
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.cardTags}>
                    <View style={[styles.tag, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
                      <Ionicons name="trending-up-outline" size={12} color="#f59e0b" />
                      <ThemedText style={[styles.tagText, { color: '#f59e0b' }]}>
                        {item.interestRate}% p.a.
                      </ThemedText>
                    </View>
                    <View style={[styles.tag, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                      <Ionicons name="time-outline" size={12} color="#3b82f6" />
                      <ThemedText style={[styles.tagText, { color: '#3b82f6' }]}>
                        {item.tenure} days
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={[styles.cardDesc, { color: mutedColor }]}>
                    {item.description}
                  </ThemedText>

                  <TouchableOpacity
                    style={[
                      styles.requestBtn,
                      alreadyRequested
                        ? { backgroundColor: 'rgba(16,185,129,0.15)' }
                        : { backgroundColor: '#7c3aed' },
                    ]}
                    onPress={() => {
                      if (!alreadyRequested) {
                        setSelectedPost(item);
                        setRequestAmount(item.amount.toString());
                        setRequestNote('');
                      }
                    }}
                    activeOpacity={0.85}
                    disabled={alreadyRequested}
                  >
                    <Ionicons
                      name={alreadyRequested ? 'checkmark-circle' : 'send-outline'}
                      size={16}
                      color={alreadyRequested ? '#10b981' : '#fff'}
                    />
                    <ThemedText
                      style={[
                        styles.requestBtnText,
                        { color: alreadyRequested ? '#10b981' : '#fff' },
                      ]}
                    >
                      {alreadyRequested ? 'Request Sent' : 'Request Money'}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </>
      ) : (
        /* Requests Section */
        <FlatList
          data={mySentRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color={mutedColor} />
              <ThemedText style={[styles.emptyText, { color: mutedColor }]}>
                No requests sent yet
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.cardTop}>
                <View style={[styles.avatarCircle, { backgroundColor: '#10b981' }]}>
                  <ThemedText style={styles.avatarText}>
                    {item.lenderName.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={[styles.lenderName, { color: textColor }]}>
                    {item.lenderName}
                  </ThemedText>
                  <ThemedText style={[styles.locationText, { color: mutedColor, marginTop: 4 }]}>
                    Date Applied: {item.createdAt}
                  </ThemedText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBg(item.status) }]}>
                  <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.cardTags}>
                <View style={[styles.tag, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
                  <ThemedText style={[styles.tagText, { color: '#f59e0b' }]}>
                    ₹{item.amount.toLocaleString('en-IN')} Requested
                  </ThemedText>
                </View>
                <View style={[styles.tag, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                  <ThemedText style={[styles.tagText, { color: '#3b82f6' }]}>
                    {item.interestRate}% p.a.
                  </ThemedText>
                </View>
                <View style={[styles.tag, { backgroundColor: 'rgba(99,102,241,0.1)' }]}>
                  <ThemedText style={[styles.tagText, { color: '#6366f1' }]}>
                    {item.tenure} days
                  </ThemedText>
                </View>
              </View>

              <View style={[styles.noteBox, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
                <ThemedText style={[styles.noteLabel, { color: mutedColor }]}>Your Application Message:</ThemedText>
                <ThemedText style={[styles.cardDesc, { color: textColor, marginBottom: 0 }]}>
                  "{item.note}"
                </ThemedText>
              </View>

              {item.status === 'approved' && (
                <View style={[styles.approvedInfoBox, { backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4', borderColor: 'rgba(16,185,129,0.3)' }]}>
                  <ThemedText style={{ color: '#10b981', fontWeight: '700', marginBottom: 8, fontSize: 13 }}>
                    <Ionicons name="checkmark-circle" size={14} /> Loan Approved
                  </ThemedText>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <ThemedText style={{ color: mutedColor, fontSize: 12 }}>Shared CIBIL Score:</ThemedText>
                    <ThemedText style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>785</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <ThemedText style={{ color: mutedColor, fontSize: 12 }}>Shared ID Proofs:</ThemedText>
                    <ThemedText style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>Aadhaar & PAN</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText style={{ color: mutedColor, fontSize: 12 }}>Lender Contact:</ThemedText>
                    <ThemedText style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>+91 91234 56789</ThemedText>
                  </View>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Request Modal */}
      <Modal visible={!!selectedPost} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e2433' : '#fff' }]}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <ThemedText style={[styles.modalTitle, { color: textColor }]}>Request Loan</ThemedText>
                <TouchableOpacity onPress={() => setSelectedPost(null)}>
                  <Ionicons name="close-circle" size={28} color={mutedColor} />
                </TouchableOpacity>
              </View>

              {selectedPost && (
                <>
                  <View style={[styles.lenderInfo, { backgroundColor: isDark ? '#111827' : '#f9fafb', borderColor: cardBorder }]}>
                    <ThemedText style={[styles.lenderInfoName, { color: textColor }]}>
                      {selectedPost.lenderName}
                    </ThemedText>
                    <ThemedText style={[styles.lenderInfoSub, { color: mutedColor }]}>
                      Max: ₹{selectedPost.amount.toLocaleString('en-IN')} · {selectedPost.interestRate}% p.a. · {selectedPost.tenure} days
                    </ThemedText>
                  </View>

                  <ThemedText style={[styles.inputLabel, { color: mutedColor }]}>
                    Amount You Need (₹) *
                  </ThemedText>
                  <View style={[styles.inputWrapper, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <Ionicons name="cash-outline" size={18} color="#7c3aed" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: textColor }]}
                      placeholder={`Up to ₹${selectedPost.amount.toLocaleString('en-IN')}`}
                      placeholderTextColor={mutedColor}
                      keyboardType="numeric"
                      value={requestAmount}
                      onChangeText={setRequestAmount}
                    />
                  </View>

                  <ThemedText style={[styles.inputLabel, { color: mutedColor }]}>
                    Purpose / Note
                  </ThemedText>
                  <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                    <TextInput
                      style={[styles.input, styles.textArea, { color: textColor }]}
                      placeholder="Why do you need this loan?"
                      placeholderTextColor={mutedColor}
                      multiline
                      numberOfLines={3}
                      value={requestNote}
                      onChangeText={setRequestNote}
                      textAlignVertical="top"
                    />
                  </View>

                  {requestAmount && !isNaN(parseFloat(requestAmount)) && (() => {
                    const principal = parseFloat(requestAmount);
                    const interest = principal * (selectedPost.interestRate / 100) * (selectedPost.tenure / 365);
                    const totalRepayment = principal + interest;
                    return (
                      <View style={[styles.emiBox, { backgroundColor: 'rgba(124,58,237,0.08)', borderColor: '#7c3aed' }]}>
                        <ThemedText style={{ color: '#7c3aed', fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                          Loan Summary ({selectedPost.tenure} Days)
                        </ThemedText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                          <ThemedText style={{ color: '#9ca3af', fontSize: 12 }}>Interest ({selectedPost.interestRate}% p.a.):</ThemedText>
                          <ThemedText style={{ color: '#f59e0b', fontSize: 12, fontWeight: '700' }}>₹{interest.toFixed(0)}</ThemedText>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 4 }}>
                          <ThemedText style={{ color: '#9ca3af', fontSize: 12 }}>Total Repayment:</ThemedText>
                          <ThemedText style={{ color: '#7c3aed', fontSize: 13, fontWeight: '800' }}>₹{totalRepayment.toFixed(0)}</ThemedText>
                        </View>
                      </View>
                    );
                  })()}

                  <TouchableOpacity style={styles.submitBtn} onPress={handleRequest} activeOpacity={0.85}>
                    <Ionicons name="send-outline" size={18} color="#fff" />
                    <ThemedText style={styles.submitBtnText}>Send Request</ThemedText>
                  </TouchableOpacity>

                  <View style={{ height: 30 }} />
                </>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 4 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  headerBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(124,58,237,0.06)',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#7c3aed',
  },
  tabButtonActive2: {
    backgroundColor: '#7c3aed',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  searchSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14 },
  rateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    width: 90,
    gap: 6,
  },
  rateInputField: { flex: 1, fontSize: 14 },
  filterScroll: { marginTop: 16, marginBottom: 12 },
  filterContainer: { paddingHorizontal: 16, gap: 12, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  filterChipText: { fontSize: 12, fontWeight: '600' },
  listContent: { padding: 16, gap: 14, paddingBottom: 100 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  lenderName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  starsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  ratingText: { fontSize: 11 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontSize: 12 },
  cardAmount: { fontSize: 18, fontWeight: '800' },
  cardTags: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  tagText: { fontSize: 12, fontWeight: '600' },
  cardDesc: { fontSize: 13, lineHeight: 18, marginBottom: 14 },
  noteBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  approvedInfoBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  requestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 13,
    gap: 8,
  },
  requestBtnText: { fontSize: 14, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 0,
    maxHeight: '88%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center', marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  lenderInfo: {
    borderWidth: 1, borderRadius: 14,
    padding: 14, marginBottom: 16,
  },
  lenderInfoName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  lenderInfoSub: { fontSize: 13 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 14,
    paddingHorizontal: 14, height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  textAreaWrapper: { height: 90, alignItems: 'flex-start', paddingVertical: 12 },
  textArea: { height: 66 },
  emiBox: {
    borderWidth: 1, borderRadius: 12,
    padding: 12, marginTop: 12, alignItems: 'center',
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#7c3aed', borderRadius: 16,
    paddingVertical: 16, marginTop: 20, gap: 8,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
