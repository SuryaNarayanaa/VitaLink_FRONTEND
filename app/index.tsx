import { Link } from "expo-router";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        const userRole = await SecureStore.getItemAsync("userRole");
        
        if (token && userRole) {
          // Redirect based on role
          if (userRole === "doctor") {
            router.replace("/doctor");
          } else if (userRole === "patient") {
            router.replace("/patient");
          }
        } else {
          // No token or role, redirect to login
          router.replace("/signIn");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        router.replace("/signIn");
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={'/doctor'}>Go to doctor Page</Link>
      <Link href={'/patient'}>Go to patient page</Link>
      <Link href={'/signIn'}>Login Page</Link>
    </View>
  );
}
