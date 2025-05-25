import { Stack } from "expo-router";

export default function TabsLayout() {

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="detail/[serial_number]/[type]"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="search"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
