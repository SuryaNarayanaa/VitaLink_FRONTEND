import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
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
    </View>
  );
}
