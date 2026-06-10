import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useLoans } from '@/context/loan-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  View,
} from 'react-native';

const TENURE_OPTIONS = ['10', '15', '30', '45', '90'];

export default function LenderScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { offers, requests, postOffer, closeOffer, updateRequestStatus } = useLoans();
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [activeTab, setActiveTab] = useState<'offers' | 'requests'>('offers');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('30');
  const [description, setDescription] = useState('');

  const currentLenderName = user?.full_name || 'Sunita Rao';

  const myOffers = offers.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  const myReceivedRequests = requests;

  const totalInvested = offers
    .filter((o) => o.status === 'active')
    .reduce((sum, o) => sum + o.amount, 0);

  const activeCount = offers.filter((o) => o.status === 'active').length;

  const handlePostOffer = () => {
    if (!amount || !interestRate || !tenure) {
      Alert.alert(t('validation_error'), t('fill_all_fields'));
      return;
    }
    const parsedAmount = parseFloat(amount);
    const parsedRate = parseFloat(interestRate);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert(t('invalid_amount'), t('enter_valid_amount'));
      return;
    }
    if (isNaN(parsedRate) || parsedRate < 1 || parsedRate > 30) {
      Alert.alert(t('invalid_rate'), t('rate_range'));
      return;
    }

    postOffer({
      lenderName: currentLenderName,
      amount: parsedAmount,
      interestRate: parsedRate,
      tenure: parseInt(tenure),
      description: description || t('no_description'),
      location: 'India',
    });

    setAmount('');
    setInterestRate('');
    setTenure('30');
    setDescription('');
    setModalVisible(false);
    Alert.alert(t('success'), t('offer_posted'));
  };

  const statusColor = (status: string) => {
    if (status === 'active' || status === 'approved') return '#10b981';
    if (status === 'pending') return '#f59e0b';
    return '#6b7280';
  };

  const statusBg = (status: string) => {
    if (status === 'active' || status === 'approved') return 'rgba(16,185,129,0.12)';
    if (status === 'pending') return 'rgba(245,158,11,0.12)';
    return 'rgba(107,114,128,0.12)';
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
      <View style={[styles.header, { backgroundColor: isDark ? '#0f172a' : '#1a56db' }]}>
        <View>
          <ThemedText style={styles.headerLabel}>{t('lender_dashboard')}</ThemedText>
          <ThemedText style={styles.headerTitle}>{t('manage_investments')}</ThemedText>
        </View>
        <TouchableOpacity
          style={styles.postBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <ThemedText style={styles.postBtnText}>{t('post_offer')}</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'offers' && styles.tabButtonActive]}
          onPress={() => setActiveTab('offers')}
        >
          <Ionicons name="list-outline" size={16} color={activeTab === 'offers' ? '#fff' : mutedColor} />
          <ThemedText style={[styles.tabButtonText, { color: activeTab === 'offers' ? '#fff' : mutedColor }]}>
            {t('my_loan_offers')} ({offers.length})
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'requests' && styles.tabButtonActive]}
          onPress={() => setActiveTab('requests')}
        >
          <Ionicons name="people-outline" size={16} color={activeTab === 'requests' ? '#fff' : mutedColor} />
          <ThemedText style={[styles.tabButtonText, { color: activeTab === 'requests' ? '#fff' : mutedColor }]}>
            {t('received_requests')} ({myReceivedRequests.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

      {activeTab === 'offers' ? (
        <>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Ionicons name="cash-outline" size={20} color="#10b981" />
              <ThemedText style={[styles.statValue, { color: '#10b981' }]}>
                ₹{(totalInvested / 1000).toFixed(0)}K
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: mutedColor }]}>{t('total_offered')}</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
              <ThemedText style={[styles.statValue, { color: '#3b82f6' }]}>{activeCount}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: mutedColor }]}>{t('active_posts')}</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <Ionicons name="people-outline" size={20} color="#f59e0b" />
              <ThemedText style={[styles.statValue, { color: '#f59e0b' }]}>
                {offers.reduce((s, o) => s + (o.applicants || 0), 0)}
              </ThemedText>
              <ThemedText style={[styles.statLabel, { color: mutedColor }]}>{t('applicants')}</ThemedText>
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContainer}
          >
            {(['all', 'active', 'closed'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  { borderColor: cardBorder },
                  activeFilter === f && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(f)}
              >
                <ThemedText style={[styles.filterChipText, { color: activeFilter === f ? '#fff' : mutedColor }]}>
                  {t(`filter_${f}`)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Offers List */}
          <FlatList
            data={myOffers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="file-tray-outline" size={48} color={mutedColor} />
                <ThemedText style={[styles.emptyText, { color: mutedColor }]}>
                  {t('no_offers_category')}
                </ThemedText>
              </View>
            }
            renderItem={({ item }) => (
              <View style={[styles.offerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
                <View style={styles.offerHeader}>
                  <View>
                    <ThemedText style={[styles.offerAmount, { color: textColor }]}>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </ThemedText>
                    <ThemedText style={[styles.offerDate, { color: mutedColor }]}>
                      {t('lender_label')}: {item.lenderName} • {item.createdAt}
                    </ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusBg(item.status) }]}>
                    <ThemedText style={[styles.statusText, { color: statusColor(item.status) }]}>
                      {item.status.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.offerDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="trending-up-outline" size={14} color="#f59e0b" />
                    <ThemedText style={[styles.detailText, { color: mutedColor }]}>
                      {item.interestRate}% {t('per_annum')}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={14} color="#3b82f6" />
                    <ThemedText style={[styles.detailText, { color: mutedColor }]}>
                      {item.tenure} {t('days')}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={14} color="#10b981" />
                    <ThemedText style={[styles.detailText, { color: mutedColor }]}>
                      {item.applicants || 0} {t('applicants')}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={[styles.offerDesc, { color: mutedColor }]}>
                  {item.description}
                </ThemedText>

                {item.status === 'active' && (
                  <View style={styles.offerActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { borderColor: '#ef4444' }]}
                      onPress={() => closeOffer(item.id)}
                    >
                      <ThemedText style={{ color: '#ef4444', fontSize: 13, fontWeight: '600' }}>
                        {t('close_offer')}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        </>
      ) : (
        /* Requests Tab */
        <FlatList
          data={myReceivedRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={mutedColor} />
              <ThemedText style={[styles.emptyText, { color: mutedColor }]}>
                {t('no_received_requests')}
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.offerCard, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={styles.offerHeader}>
                <View>
                  <ThemedText style={[styles.offerAmount, { color: '#10b981' }]}>
                    ₹{item.amount.toLocaleString('en-IN')} {t('requested')}
                  </ThemedText>
                  <ThemedText style={[styles.offerDate, { color: mutedColor }]}>
                    {t('borrower_label')}: <ThemedText style={{ fontWeight: '700' }}>{item.borrowerName}</ThemedText>
                  </ThemedText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusBg(item.status) }]}>
                  <ThemedText style={[styles.statusText, { color: statusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.offerDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="trending-up-outline" size={14} color="#f59e0b" />
                  <ThemedText style={[styles.detailText, { color: mutedColor }]}>
                    {item.interestRate}% {t('per_annum')}
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={14} color="#3b82f6" />
                  <ThemedText style={[styles.detailText, { color: mutedColor }]}>
                    {item.tenure} {t('days')}
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={14} color="#6366f1" />
                  <ThemedText style={[styles.detailText, { color: mutedColor }]}>
                    {item.createdAt}
                  </ThemedText>
                </View>
              </View>

              <View style={[styles.noteBox, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
                <ThemedText style={[styles.noteLabel, { color: mutedColor }]}>
                  {t('borrower_message')}:
                </ThemedText>
                <ThemedText style={[styles.offerDesc, { color: textColor, marginBottom: 0 }]}>
                  "{item.note || t('no_note')}"
                </ThemedText>
              </View>

              {item.status === 'pending' && (
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={[styles.reqActionBtn, styles.rejectBtn]}
                    onPress={() => {
                      updateRequestStatus(item.id, 'rejected');
                      Alert.alert(t('request_rejected'), t('request_rejected_msg'));
                    }}
                  >
                    <Ionicons name="close-circle-outline" size={16} color="#ef4444" />
                    <ThemedText style={styles.rejectBtnText}>{t('reject')}</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.reqActionBtn, styles.approveBtn]}
                    onPress={() => {
                      updateRequestStatus(item.id, 'approved');
                      Alert.alert(t('request_approved'), t('request_approved_msg'));
                    }}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                    <ThemedText style={styles.approveBtnText}>{t('approve')}</ThemedText>
                  </TouchableOpacity>
                </View>
              )}

              {item.status === 'approved' && (
                <View style={[styles.approvedInfoBox, {
                  backgroundColor: isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4',
                  borderColor: 'rgba(16,185,129,0.3)'
                }]}>
                  <ThemedText style={{ color: '#10b981', fontWeight: '700', marginBottom: 8, fontSize: 13 }}>
                    <Ionicons name="shield-checkmark" size={14} /> {t('borrower_verified')}
                  </ThemedText>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <ThemedText style={{ color: mutedColor, fontSize: 12 }}>{t('cibil_score')}:</ThemedText>
                    <ThemedText style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>785 (Excellent)</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <ThemedText style={{ color: mutedColor, fontSize: 12 }}>{t('id_proofs')}:</ThemedText>
                    <ThemedText style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>{t('aadhaar_pan')}</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ThemedText style={{ color: mutedColor, fontSize: 12 }}>{t('lender_contact')}:</ThemedText>
                    <ThemedText style={{ color: textColor, fontSize: 12, fontWeight: '700' }}>+91 98765 43210</ThemedText>
                  </View>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* Post Offer Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1e2433' : '#ffffff' }]}>
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <ThemedText style={[styles.modalTitle, { color: textColor }]}>
                  {t('post_loan_offer')}
                </ThemedText>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-circle" size={28} color={mutedColor} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText style={[styles.inputLabel, { color: mutedColor }]}>
                  {t('offer_amount')} *
                </ThemedText>
                <View style={[styles.inputWrapper, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                  <Ionicons name="cash-outline" size={18} color="#10b981" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="e.g. 100000"
                    placeholderTextColor={mutedColor}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>

                <ThemedText style={[styles.inputLabel, { color: mutedColor }]}>
                  {t('interest_rate_label')} *
                </ThemedText>
                <View style={[styles.inputWrapper, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                  <Ionicons name="trending-up-outline" size={18} color="#f59e0b" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="e.g. 9"
                    placeholderTextColor={mutedColor}
                    keyboardType="decimal-pad"
                    value={interestRate}
                    onChangeText={setInterestRate}
                  />
                </View>

                <ThemedText style={[styles.inputLabel, { color: mutedColor }]}>
                  {t('tenure_days')} *
                </ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tenureScroll}>
                  {TENURE_OPTIONS.map((t_opt) => (
                    <TouchableOpacity
                      key={t_opt}
                      style={[
                        styles.tenureChip,
                        {
                          backgroundColor: tenure === t_opt ? '#1a56db' : inputBg,
                          borderColor: tenure === t_opt ? '#1a56db' : inputBorder,
                        },
                      ]}
                      onPress={() => setTenure(t_opt)}
                    >
                      <ThemedText style={{ color: tenure === t_opt ? '#fff' : mutedColor, fontWeight: '600' }}>
                        {t_opt}d
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <ThemedText style={[styles.inputLabel, { color: mutedColor }]}>
                  {t('description')}
                </ThemedText>
                <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor: inputBg, borderColor: inputBorder }]}>
                  <TextInput
                    style={[styles.input, styles.textArea, { color: textColor }]}
                    placeholder={t('offer_description_placeholder')}
                    placeholderTextColor={mutedColor}
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    textAlignVertical="top"
                  />
                </View>

                <TouchableOpacity style={styles.submitBtn} onPress={handlePostOffer} activeOpacity={0.85}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <ThemedText style={styles.submitBtnText}>{t('post_offer')}</ThemedText>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
              </ScrollView>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  headerLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 4 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  postBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, gap: 6,
  },
  postBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  tabRow: {
    flexDirection: 'row', backgroundColor: 'rgba(26,86,219,0.06)',
    margin: 16, borderRadius: 12, padding: 4,
  },
  tabButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 6,
  },
  tabButtonActive: { backgroundColor: '#1a56db' },
  tabButtonText: { fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10 },
  statCard: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 11, textAlign: 'center' },
  filterScroll: { marginTop: 16, marginBottom: 12 },
  filterContainer: { paddingHorizontal: 16, gap: 12, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24,
    borderWidth: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center',
  },
  filterChipActive: { backgroundColor: '#1a56db', borderColor: '#1a56db' },
  filterChipText: { fontSize: 13, fontWeight: '600' },
  listContent: { padding: 16, gap: 14, paddingBottom: 100 },
  offerCard: {
    borderRadius: 20, borderWidth: 1, padding: 18,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  offerAmount: { fontSize: 20, fontWeight: '800' },
  offerDate: { fontSize: 12, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  offerDetails: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 13 },
  offerDesc: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  noteBox: { padding: 10, borderRadius: 10, marginBottom: 12 },
  noteLabel: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  offerActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  actionBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  requestActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  reqActionBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, gap: 6,
  },
  rejectBtn: { borderColor: '#ef4444' },
  rejectBtnText: { color: '#ef4444', fontSize: 13, fontWeight: '700' },
  approveBtn: { backgroundColor: '#10b981', borderColor: '#10b981' },
  approveBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  approvedInfoBox: { marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 0, maxHeight: '90%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, height: 52 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  textAreaWrapper: { height: 100, alignItems: 'flex-start', paddingVertical: 12 },
  textArea: { height: 76 },
  tenureScroll: { marginBottom: 4 },
  tenureChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginRight: 8 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#1a56db', borderRadius: 16, paddingVertical: 16, marginTop: 24, gap: 8,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});