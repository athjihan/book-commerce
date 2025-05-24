import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DetailPage() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-black text-xl font-bold">Detail Buku ID: {id}</Text>
    </View>
  );
}