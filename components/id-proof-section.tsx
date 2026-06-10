import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/auth-context";

export default function IDProofSection() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idProofType, setIdProofType] = useState(user?.id_proof_type || "");
  const [idProofUri, setIdProofUri] = useState(user?.id_proof_url || "");

  const idProofTypes = [
    { label: "Aadhar Card", value: "aadhar" },
    { label: "PAN Card", value: "pancard" },
    { label: "Passport", value: "passport" },
    { label: "Driving License", value: "license" },
  ];

  const handleUpload = async () => {
    try {
      setLoading(true);
      // In a real app, use expo-image-picker or expo-document-picker
      // For now, we'll simulate the upload
      Alert.alert(
        "Upload",
        "Document upload functionality would be implemented here",
      );
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to upload document");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!idProofType) {
        Alert.alert("Validation", "Please select ID proof type");
        return;
      }
      if (!idProofUri) {
        Alert.alert("Validation", "Please upload ID proof");
        return;
      }

      await updateProfile({
        id_proof_type: idProofType,
        id_proof_url: idProofUri,
      });

      setIsEditing(false);
      Alert.alert("Success", "ID proof updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save ID proof");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ID Proof</Text>
        <TouchableOpacity
          style={[styles.editBtn, isEditing && styles.editBtnActive]}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={loading}
        >
          <Text style={styles.editBtnText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ID Proof Type Selection */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>ID Proof Type</Text>
          {isEditing ? (
            <View style={styles.typeSelector}>
              {idProofTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeOption,
                    idProofType === type.value && styles.typeOptionActive,
                  ]}
                  onPress={() => setIdProofType(type.value)}
                >
                  <Text
                    style={[
                      styles.typeOptionText,
                      idProofType === type.value && styles.typeOptionTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.value}>
              {idProofTypes.find((t) => t.value === idProofType)?.label ||
                "Not selected"}
            </Text>
          )}
        </View>

        {/* ID Proof Document */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>ID Proof Document</Text>
          {idProofUri ? (
            <View>
              <View style={styles.documentPreview}>
                {idProofUri.startsWith("http") ||
                idProofUri.startsWith("file") ? (
                  <Image
                    source={{ uri: idProofUri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.documentName}>📄 Document Uploaded</Text>
                )}
              </View>
              {isEditing && (
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => setIdProofUri("")}
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          {isEditing && (!idProofUri || true) && (
            <TouchableOpacity
              style={[styles.uploadBtn, loading && styles.uploadBtnDisabled]}
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.uploadBtnText}>📤 Upload ID Proof</Text>
                  <Text style={styles.uploadBtnSubtext}>
                    Supported: JPEG, PNG, PDF (Max 5MB)
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {isEditing && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsEditing(false);
              setIdProofType(user?.id_proof_type || "");
              setIdProofUri(user?.id_proof_url || "");
            }}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  editBtnActive: {
    backgroundColor: "#2196F3",
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2196F3",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 10,
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    minWidth: "45%",
  },
  typeOptionActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  typeOptionTextActive: {
    color: "#fff",
  },
  documentPreview: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  documentName: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadBtn: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtnDisabled: {
    opacity: 0.6,
  },
  uploadBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  uploadBtnSubtext: {
    fontSize: 12,
    color: "#B3E5FC",
    marginTop: 4,
  },
  removeBtn: {
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C62828",
    textAlign: "center",
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginTop: 16,
    marginBottom: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
});
