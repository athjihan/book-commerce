// app/_layout.tsx (RootLayout)

import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTitle: () => (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>boomerce</Text>
        ),
        headerTitleAlign: "center",
        headerTintColor: "#fff",
        headerRight: () => (
            <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => {
              router.push("/search");
            }}
            >
            <Feather name="search" size={24} color="#fecaca" />
            </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}