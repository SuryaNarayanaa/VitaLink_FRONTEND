import { Stack, Tabs } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex:1}}>
          <Stack screenOptions={{headerTitleAlign:'center'}}>
              <Stack.Screen name="index" options={{title:'Home Page'}}/>
              <Stack.Screen name="doctor" options={{title:"Doctor"}}/>
              <Stack.Screen name="patient" options={{title:"Patient"}}/>
          </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
