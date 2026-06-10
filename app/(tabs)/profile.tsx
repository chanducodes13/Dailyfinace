import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import DocumentsSection from "../../components/documents-section";
import IDProofSection from "../../components/id-proof-section";
import ProfileInfoSection from "../../components/profile-info-section";
import { useAuth } from "../../context/auth-context";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.heading}>{t("profile")}</Text>
          <Text style={styles.subHeading}>Manage your profile information</Text>
        </View>

        {/* User Avatar Card */}
        {user && (
          <View style={styles.avatarCard}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-circle" size={64} color="#6366f1" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.full_name || "User"}</Text>
              <View style={styles.roleBadge}>
                <Ionicons
                  name={
                    user.role === "borrower"
                      ? "person-outline"
                      : "trending-up-outline"
                  }
                  size={14}
                  color="#fff"
                />
                <Text style={styles.roleBadgeText}>
                  {user.role === "borrower"
                    ? "Borrower"
                    : user.role === "lender"
                      ? "Lender"
                      : "User"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Profile Information Section */}
        <ProfileInfoSection />

        {/* ID Proof Section */}
        <IDProofSection />

        {/* Documents Section */}
        <DocumentsSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
    color: "#0f0f1e",
  },
  subHeading: {
    fontSize: 14,
    color: "#8b8b99",
    fontWeight: "500",
  },
  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f0f1e",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
});
