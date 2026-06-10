import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Blocked tab component shown when user tries to access restricted tab
function BlockedTab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[
        styles.blockedContainer,
        { backgroundColor: isDark ? "#0f172a" : "#f9fafb" },
      ]}
    >
      <Ionicons name="lock-closed-outline" size={64} color="#ef4444" />
      <Text
        style={[styles.blockedTitle, { color: isDark ? "#f9fafb" : "#111827" }]}
      >
        Access Restricted
      </Text>
      <Text
        style={[
          styles.blockedSubtitle,
          { color: isDark ? "#9ca3af" : "#6b7280" },
        ]}
      >
        This section is not available for your current role.
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user, isProfileComplete } = useAuth();

  // Redirect to onboarding if profile is not complete
  if (user && !isProfileComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  const activeTint = "#1a56db";
  const inactiveTint = isDark ? "#6b7280" : "#9ca3af";
  const blockedTint = "#ef4444";

  // Get active role — adjust field name based on your auth context
  const role = user?.role; // 'lender' | 'borrower'

  const isLender = role === "lender";
  const isBorrower = role === "borrower";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderTopColor: isDark ? "#1f2937" : "#f3f4f6",
          height: 64,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      {/* Home — accessible to all */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Lender — blocked for borrowers */}
      <Tabs.Screen
        name="lender"
        options={{
          title: "Lender",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="cash-outline"
              size={size}
              color={isBorrower ? blockedTint : color}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: isBorrower
                  ? blockedTint
                  : focused
                    ? activeTint
                    : inactiveTint,
              }}
            >
              {isBorrower ? "🔒 Lender" : "Lender"}
            </Text>
          ),
          // Show blocked screen instead of lender screen for borrowers
          tabBarButton: isBorrower
            ? (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {}} // disable navigation
                  style={[props.style, styles.blockedTabBtn]}
                />
              )
            : undefined,
        }}
      />

      {/* Borrower — blocked for lenders */}
      <Tabs.Screen
        name="borrower"
        options={{
          title: "Borrower",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="wallet-outline"
              size={size}
              color={isLender ? blockedTint : color}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: isLender
                  ? blockedTint
                  : focused
                    ? activeTint
                    : inactiveTint,
              }}
            >
              {isLender ? "🔒 Borrower" : "Borrower"}
            </Text>
          ),
          // Show blocked screen instead of borrower screen for lenders
          tabBarButton: isLender
            ? (props) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => {}} // disable navigation
                  style={[props.style, styles.blockedTabBtn]}
                />
              )
            : undefined,
        }}
      />

      {/* Profile — accessible to all */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blockedTabBtn: {
    opacity: 0.5,
  },
  blockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 32,
  },
  blockedTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  blockedSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
