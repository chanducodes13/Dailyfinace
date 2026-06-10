import { useAuth } from "@/context/auth-context";
import { createProfile } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { refreshProfile } = useAuth();

  const [selectedRole, setSelectedRole] = useState<
    "lender" | "borrower" | null
  >(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!fullName.trim()) {
      Alert.alert("Required", "Please enter your full name");
      return;
    }
    if (!selectedRole) {
      Alert.alert("Required", "Please select a role to continue");
      return;
    }

    try {
      setLoading(true);

      // Get current logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expired. Please login again.");

      // Create profile with locked role
      await createProfile(user.id, fullName.trim(), phone, selectedRole);

      // Refresh profile in context
      await refreshProfile();

      // Go to onboarding to fill profile details
      router.replace("/(onboarding)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Choose your role carefully — it cannot be changed later
      </Text>

      {/* Full Name Input */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />

      {/* Role Selection */}
      <Text style={styles.label}>Select Your Role</Text>

      <TouchableOpacity
        style={[
          styles.roleCard,
          selectedRole === "lender" && styles.roleCardSelected,
        ]}
        onPress={() => setSelectedRole("lender")}
      >
        <Text style={styles.roleIcon}>💰</Text>
        <View style={styles.roleInfo}>
          <Text
            style={[
              styles.roleTitle,
              selectedRole === "lender" && styles.roleTitleSelected,
            ]}
          >
            Lender
          </Text>
          <Text style={styles.roleDesc}>I want to lend money to borrowers</Text>
        </View>
        {selectedRole === "lender" && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roleCard,
          selectedRole === "borrower" && styles.roleCardSelected,
        ]}
        onPress={() => setSelectedRole("borrower")}
      >
        <Text style={styles.roleIcon}>🤝</Text>
        <View style={styles.roleInfo}>
          <Text
            style={[
              styles.roleTitle,
              selectedRole === "borrower" && styles.roleTitleSelected,
            ]}
          >
            Borrower
          </Text>
          <Text style={styles.roleDesc}>
            I want to borrow money from lenders
          </Text>
        </View>
        {selectedRole === "borrower" && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Warning */}
      {selectedRole && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ You are registering as a{" "}
            <Text style={styles.warningBold}>{selectedRole}</Text>. This cannot
            be changed later.
          </Text>
        </View>
      )}

      {/* Confirm Button */}
      <TouchableOpacity
        style={[
          styles.button,
          (!selectedRole || loading) && styles.buttonDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!selectedRole || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirm & Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 24,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  roleCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  roleIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  roleTitleSelected: {
    color: "#4F46E5",
  },
  roleDesc: {
    fontSize: 13,
    color: "#888",
  },
  checkmark: {
    fontSize: 20,
    color: "#4F46E5",
    fontWeight: "bold",
  },
  warningBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
  },
  warningText: {
    fontSize: 13,
    color: "#92400E",
  },
  warningBold: {
    fontWeight: "700",
    textTransform: "capitalize",
  },
  button: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
