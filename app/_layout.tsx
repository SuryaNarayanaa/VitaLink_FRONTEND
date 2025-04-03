import { Stack, Tabs } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppStateStatus, Platform } from "react-native";
import { useOnlineManager } from "@/hooks/query/useOnlineManager";
import { useAppState } from "@/hooks/query/useAppState";
import {QueryClient,QueryClientProvider,focusManager} from '@tanstack/react-query'

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
          <Stack screenOptions={{headerTitleAlign:'center', headerShown:false}}>
              <Stack.Screen name='(auth)/signIn' options={{title:"Patient"}}/>
              <Stack.Screen name="index" options={{title:'Home Page'}}/>
              <Stack.Screen name="doctor" options={{title:"Doctor"}}/>
              <Stack.Screen name="patient" options={{title:"Patient"}}/>
          </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
    </QueryClientProvider>
  )
}