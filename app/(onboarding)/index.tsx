import { useAuth } from "@/context/auth-context";
import { validateProfileCompletion, ValidationError } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const getErrorMessage = (field: string): string | undefined => {
    return errors.find((e) => e.field === field)?.message;
  };

  const handleComplete = async () => {
    // Validate all fields
    const validation = validateProfileCompletion({
      address,
      city,
      state,
      pincode,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      Alert.alert("Validation Error", validation.errors[0].message);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      await updateProfile({
        address,
        city,
        state,
        pincode,
      });

      Alert.alert("Success", "Profile completed successfully!");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const handleStateSelect = (selectedState: string) => {
    setState(selectedState);
    setShowStateDropdown(false);
    // Clear error for state field
    setErrors(errors.filter((e) => e.field !== "state"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.headerTitle}>Complete Your Profile</Text>
            <Text style={styles.headerSubtitle}>
              Help us know you better by providing your address details
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Address Field */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  getErrorMessage("address") && styles.inputError,
                ]}
                placeholder="Enter your full address"
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  setErrors(errors.filter((e) => e.field !== "address"));
                }}
              />
              {getErrorMessage("address") && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#DC2626"
                  />
                  <Text style={styles.errorText}>
                    {getErrorMessage("address")}
                  </Text>
                </View>
              )}
            </View>

            {/* City Field */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>City</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  getErrorMessage("city") && styles.inputError,
                ]}
                placeholder="Enter your city"
                placeholderTextColor="#999"
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  setErrors(errors.filter((e) => e.field !== "city"));
                }}
              />
              {getErrorMessage("city") && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#DC2626"
                  />
                  <Text style={styles.errorText}>
                    {getErrorMessage("city")}
                  </Text>
                </View>
              )}
            </View>

            {/* State Field */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>State</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.stateInput,
                  getErrorMessage("state") && styles.inputError,
                ]}
                onPress={() => setShowStateDropdown(!showStateDropdown)}
              >
                <Text
                  style={[
                    styles.stateInputText,
                    !state && styles.stateInputPlaceholder,
                  ]}
                >
                  {state || "Select your state"}
                </Text>
                <Ionicons
                  name={showStateDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {showStateDropdown && (
                <View style={styles.stateDropdown}>
                  <ScrollView
                    style={styles.stateList}
                    nestedScrollEnabled={true}
                  >
                    {indianStates.map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={styles.stateOption}
                        onPress={() => handleStateSelect(s)}
                      >
                        <Text
                          style={[
                            styles.stateOptionText,
                            state === s && styles.stateOptionTextActive,
                          ]}
                        >
                          {s}
                        </Text>
                        {state === s && (
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color="#6366F1"
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {getErrorMessage("state") && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#DC2626"
                  />
                  <Text style={styles.errorText}>
                    {getErrorMessage("state")}
                  </Text>
                </View>
              )}
            </View>

            {/* Pincode Field */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Pincode</Text>
                <Text style={styles.required}>*</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  getErrorMessage("pincode") && styles.inputError,
                ]}
                placeholder="Enter 6-digit pincode"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={6}
                value={pincode}
                onChangeText={(text) => {
                  setPincode(text.replace(/[^0-9]/g, ""));
                  setErrors(errors.filter((e) => e.field !== "pincode"));
                }}
              />
              {getErrorMessage("pincode") && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color="#DC2626"
                  />
                  <Text style={styles.errorText}>
                    {getErrorMessage("pincode")}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#6366F1"
            />
            <Text style={styles.infoText}>
              This information helps us process your loan applications faster
            </Text>
          </View>
        </ScrollView>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.completeButton, loading && styles.buttonDisabled]}
            onPress={handleComplete}
            disabled={loading}
          >
            <Text style={styles.completeButtonText}>
              {loading ? "Completing..." : "Complete Profile"}
            </Text>
            {!loading && (
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "100%",
    backgroundColor: "#6366F1",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  required: {
    fontSize: 14,
    color: "#DC2626",
    marginLeft: 2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  stateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 12,
  },
  stateInputText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  stateInputPlaceholder: {
    color: "#999",
  },
  stateDropdown: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#6366F1",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    borderTopWidth: 0,
    marginHorizontal: 0,
  },
  stateList: {
    maxHeight: 200,
  },
  stateOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  stateOptionText: {
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
  },
  stateOptionTextActive: {
    fontWeight: "600",
    color: "#6366F1",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E0E7FF",
    borderRadius: 8,
    padding: 12,
    gap: 10,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 13,
    color: "#4338CA",
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  completeButton: {
    backgroundColor: "#6366F1",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
