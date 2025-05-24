import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TextInput, View, Platform } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="search"
        options={{
          headerTitle: () => (
            <TextInput
              autoFocus
              placeholder="Cari judul atau penulis"
              placeholderTextColor="#ccc"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => {
                router.setParams({ q: query });
              }}
              style={{
                color: "#fff",
                backgroundColor: "#1f1f1f",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: Platform.OS === "ios" ? 8 : 4,
                width: "100%",
              }}
            />
          ),
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
