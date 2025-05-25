import { View, Text, Image } from "react-native";

export default function Card() {
    return (
        <>
            <View className="w-1/3 p-2">
                <View className="bg-white rounded-lg shadow-md">
                    <Image
                        source={require("@/assets/cover/bumimanusia.jpeg")}
                        className="w-full h-40 rounded-t-lg"
                    />
                    <View className="p-4">
                        <Text className="text-lg font-bold text-gray-800">
                            Book Title
                        </Text>
                        <Text className="text-gray-600 mt-1">
                            Author Name
                        </Text>
                        <Text className="text-gray-600 mt-1">
                            Rp 100.000
                        </Text>
                        <View className="bg-green-300 px-2 py-0.5 rounded-full mt-2">
                            <Text className="text-xs italic text-green-900">
                                E-book
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className="w-1/3 p-2">
                <View className="bg-white rounded-lg shadow-md">
                    <Image
                        source={require("@/assets/cover/bumimanusia.jpeg")}
                        className="w-full h-40 rounded-t-lg"
                    />
                    <View className="p-4">
                        <Text className="text-lg font-bold text-gray-800">
                            Book Title
                        </Text>
                        <Text className="text-gray-600 mt-1">
                            Author Name
                        </Text>
                        <Text className="text-gray-600 mt-1">
                            Rp 100.000
                        </Text>
                        <View className="bg-green-300 px-2 py-0.5 rounded-full mt-2">
                            <Text className="text-xs italic text-green-900">
                                E-book
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}