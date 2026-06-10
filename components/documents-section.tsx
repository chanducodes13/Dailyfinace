import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Document, useAuth } from "../context/auth-context";

export default function DocumentsSection() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(user?.documents || []);
  const [selectedDocType, setSelectedDocType] = useState("");

  const documentTypes = [
    { label: "Bank Statement", value: "bank_statement" },
    { label: "Salary Slip", value: "salary_slip" },
    { label: "Income Tax Return", value: "itr" },
    { label: "Property Document", value: "property_doc" },
    { label: "Employment Letter", value: "employment_letter" },
    { label: "Other", value: "other" },
  ];

  const handleAddDocument = async () => {
    try {
      if (!selectedDocType) {
        Alert.alert("Validation", "Please select document type");
        return;
      }

      setLoading(true);
      // Simulate document upload
      const newDocument: Document = {
        id: Date.now().toString(),
        name: `Document_${Date.now()}`,
        type: selectedDocType,
        uri: "file://document-" + Date.now(),
        uploadedAt: new Date().toISOString(),
      };

      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);
      await updateProfile({ documents: updatedDocuments });

      setSelectedDocType("");
      setIsAdding(false);
      Alert.alert("Success", "Document uploaded successfully");
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to upload document");
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      Alert.alert("Delete", "Are you sure you want to delete this document?", [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {
            const updatedDocuments = documents.filter((d) => d.id !== docId);
            setDocuments(updatedDocuments);
            await updateProfile({ documents: updatedDocuments });
            Alert.alert("Success", "Document deleted successfully");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to delete document");
    }
  };

  const renderDocumentItem = ({ item }: { item: Document }) => {
    const docTypeLabel =
      documentTypes.find((t) => t.value === item.type)?.label || item.type;
    const uploadDate = new Date(item.uploadedAt).toLocaleDateString();

    return (
      <View style={styles.documentItem}>
        <View style={styles.documentInfo}>
          <View style={styles.documentIcon}>
            <Text style={styles.docIcon}>📄</Text>
          </View>
          <View style={styles.documentDetails}>
            <Text style={styles.docName}>{docTypeLabel}</Text>
            <Text style={styles.docDate}>{uploadDate}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteDocument(item.id)}
        >
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        {!isAdding && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setIsAdding(true)}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {isAdding && (
        <View style={styles.addForm}>
          <Text style={styles.formLabel}>Select Document Type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typeScroll}
          >
            {documentTypes.map((docType) => (
              <TouchableOpacity
                key={docType.value}
                style={[
                  styles.typeChip,
                  selectedDocType === docType.value && styles.typeChipActive,
                ]}
                onPress={() => setSelectedDocType(docType.value)}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    selectedDocType === docType.value &&
                      styles.typeChipTextActive,
                  ]}
                >
                  {docType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.uploadBtn, loading && styles.uploadBtnDisabled]}
            onPress={handleAddDocument}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.uploadBtnText}>📤 Upload Document</Text>
                <Text style={styles.uploadBtnSubtext}>
                  Supported: PDF, JPEG, PNG (Max 10MB)
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsAdding(false);
              setSelectedDocType("");
            }}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {documents.length > 0 ? (
        <FlatList
          data={documents}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.documentsList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {isAdding
              ? "Select a document type above"
              : "No documents uploaded yet"}
          </Text>
        </View>
      )}
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
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F3E5F5",
    borderWidth: 1,
    borderColor: "#9C27B0",
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9C27B0",
  },
  addForm: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  typeScroll: {
    marginBottom: 12,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: "#9C27B0",
    borderColor: "#9C27B0",
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  typeChipTextActive: {
    color: "#fff",
  },
  uploadBtn: {
    backgroundColor: "#9C27B0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
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
    color: "#E1BEE7",
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  documentsList: {
    gap: 8,
  },
  documentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  docIcon: {
    fontSize: 24,
  },
  documentDetails: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  docDate: {
    fontSize: 12,
    color: "#999",
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  deleteBtnText: {
    fontSize: 16,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
