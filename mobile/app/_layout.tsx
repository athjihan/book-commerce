import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTitle: () => (
          <Image
            source={require("../assets/images/logo.png")}
            style={{ width: 120, height: 40 }}
            resizeMode="contain" />
        ),
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              router.push("/search");
            }}
          >
            <Feather name="search" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
