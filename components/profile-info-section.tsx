import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/auth-context";

interface ProfileInfoProps {
  onSave?: () => void;
}

export default function ProfileInfoSection({ onSave }: ProfileInfoProps) {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    secondary_mobile: user?.secondary_mobile || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
  });

  const handleSave = async () => {
    try {
      if (!formData.full_name.trim()) {
        Alert.alert("Validation", "Name is required");
        return;
      }
      if (!formData.mobile.trim()) {
        Alert.alert("Validation", "Primary mobile is required");
        return;
      }

      await updateProfile({
        full_name: formData.full_name,
        secondary_mobile: formData.secondary_mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
      onSave?.();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Basic Information</Text>
        <TouchableOpacity
          style={[styles.editBtn, isEditing && styles.editBtnActive]}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isEditing ? "checkmark-done" : "pencil"}
            size={14}
            color={isEditing ? "#fff" : "#6366f1"}
          />
          <Text
            style={[styles.editBtnText, isEditing && styles.editBtnTextActive]}
          >
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Full Name */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="person" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.full_name}
                  onChangeText={(value) =>
                    handleInputChange("full_name", value)
                  }
                  placeholder="Enter full name"
                  editable={isEditing}
                />
              ) : (
                <Text style={styles.value}>{formData.full_name}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Email */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="mail" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{formData.email}</Text>
            </View>
          </View>
        </View>

        {/* Primary Mobile */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="call" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>Primary Mobile</Text>
              <Text style={styles.value}>{formData.mobile}</Text>
            </View>
          </View>
        </View>

        {/* Secondary Mobile */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="phone-portrait" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>Secondary Mobile</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.secondary_mobile}
                  onChangeText={(value) =>
                    handleInputChange("secondary_mobile", value)
                  }
                  placeholder="Enter secondary mobile (optional)"
                  editable={isEditing}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text
                  style={[
                    styles.value,
                    !formData.secondary_mobile && styles.valueEmpty,
                  ]}
                >
                  {formData.secondary_mobile || "Not provided"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="location" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={formData.address}
                  onChangeText={(value) => handleInputChange("address", value)}
                  placeholder="Enter address"
                  editable={isEditing}
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Text
                  style={[styles.value, !formData.address && styles.valueEmpty]}
                >
                  {formData.address || "Not provided"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* City */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="business" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>City</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(value) => handleInputChange("city", value)}
                  placeholder="Enter city"
                  editable={isEditing}
                />
              ) : (
                <Text
                  style={[styles.value, !formData.city && styles.valueEmpty]}
                >
                  {formData.city || "Not provided"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* State */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="map" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>State</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.state}
                  onChangeText={(value) => handleInputChange("state", value)}
                  placeholder="Enter state"
                  editable={isEditing}
                />
              ) : (
                <Text
                  style={[styles.value, !formData.state && styles.valueEmpty]}
                >
                  {formData.state || "Not provided"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Pincode */}
        <View style={styles.fieldContainer}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldIcon}>
              <Ionicons name="mail-unread" size={18} color="#6366f1" />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.label}>Pincode</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={formData.pincode}
                  onChangeText={(value) => handleInputChange("pincode", value)}
                  placeholder="Enter pincode"
                  editable={isEditing}
                  keyboardType="numeric"
                />
              ) : (
                <Text
                  style={[styles.value, !formData.pincode && styles.valueEmpty]}
                >
                  {formData.pincode || "Not provided"}
                </Text>
              )}
            </View>
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsEditing(false);
              setFormData({
                full_name: user.full_name || "",
                email: user.email || "",
                mobile: user.mobile || "",
                secondary_mobile: user.secondary_mobile || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
              });
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle-outline" size={18} color="#8b8b99" />
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f0f1e",
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F0F3FF",
    borderWidth: 1.5,
    borderColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editBtnActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366f1",
  },
  editBtnTextActive: {
    color: "#fff",
  },
  fieldContainer: {
    marginBottom: 18,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F0F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8b8b99",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#0f0f1e",
    backgroundColor: "#fafbfc",
  },
  inputFocused: {
    borderColor: "#6366f1",
    backgroundColor: "#ffffff",
  },
  multilineInput: {
    textAlignVertical: "top",
    minHeight: 100,
    paddingVertical: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0f0f1e",
    paddingVertical: 4,
  },
  valueEmpty: {
    color: "#a0a0a8",
    fontStyle: "italic",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#f5f5f7",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 20,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8b8b99",
  },
});
