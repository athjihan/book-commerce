import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface Book {
  _id: string;
  cover_url: string;
  title: string;
  author: string[];
  price: number;
  genre: string[];
  book_type: string;
  serial_number: string;
}

interface CardProps {
  book: Book;
  imageSource: any;
}

export default function Card({ book, imageSource }: CardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({ pathname: "/(tabs)/detail/[serial_number]/[type]", params: { serial_number: book.serial_number, type: book.book_type } });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-[31%] bg-gray-800 rounded-2xl p-2 mb-4 shadow-md items-stretch"
      style={{ alignSelf: "flex-start" }}
    >
      <Image
        source={imageSource}
        className="w-full h-36 rounded-lg mb-2"
        resizeMode="cover"
      />
      <Text className="text-base font-bold text-white">{book.title}</Text>
      <Text className="text-sm text-gray-200">{book.author.join(", ")}</Text>
      <Text className="text-sm text-green-300 font-semibold mt-1">
        {book.price === 0 ? "Free" : `Rp ${book.price.toLocaleString()}`}
      </Text>

      {book.book_type === "e-book" ? (
        <View className="bg-blue-300 px-2 py-0.5 rounded-full mt-1 self-start">
          <Text className="text-xs italic text-blue-950">{book.book_type}</Text>
        </View>
      ) : book.book_type === "physics" ? (
        <View className="bg-red-200 px-2 py-0.5 rounded-full mt-1 self-start">
          <Text className="text-xs italic text-red-950">{book.book_type}</Text>
        </View>
      ) : (
        <Text className="text-xs italic text-gray-500">{book.book_type}</Text>
      )}
    </TouchableOpacity>
  );
}
