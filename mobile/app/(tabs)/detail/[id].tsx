import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DetailPage() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-white text-xl font-bold">Detail Buku ID: {id}</Text>
    </View>
  );
}