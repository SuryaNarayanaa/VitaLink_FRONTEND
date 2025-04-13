import { Stack, Tabs } from "expo-router";
import {Text} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppStateStatus, Platform } from "react-native";
import { useOnlineManager } from "@/hooks/query/useOnlineManager";
import { useAppState } from "@/hooks/query/useAppState";
import {QueryClient,QueryClientProvider,focusManager} from '@tanstack/react-query'
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout() {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  const queryclient = new QueryClient({defaultOptions:{queries:{retry:false}}})
  useOnlineManager()
  useAppState();

  return (
    <QueryClientProvider client={queryclient}>
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
        <ErrorBoundary>
          <Stack screenOptions={{headerTitleAlign:'center', headerShown:false}}>
          </Stack>
          </ErrorBoundary>
      </SafeAreaView>
    </SafeAreaProvider>
    </QueryClientProvider>
  )
}