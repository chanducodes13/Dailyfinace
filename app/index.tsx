import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, loading, isProfileComplete, role } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a0a0f",
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // No user logged in - go to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Admin user - go to admin panel
  if (user.role === "admin") {
    return <Redirect href="/(admin)" />;
  }

  // User exists but no role selected yet - go to role selection
  if (!user.role) {
    return <Redirect href="/(auth)/role-selection" />;
  }

  // User has role but profile incomplete - complete profile in onboarding
  if (!isProfileComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  // User has role and complete profile - go to main app
  return <Redirect href="/(tabs)" />;
}
