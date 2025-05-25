import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { getBookDetailById } from "@/services/detailService";
import imageMap from "@/utils/imageMap";

interface Book {
  book_type: string;
  serial_number: string;
  title: string;
  author: string[];
  release_date: string;
  genre: string[];
  synopsis: string;
  description: string;
  price: number;
  stock: number;
  cover_url: string;
}

export default function Detail() {
  const { serial_number, type } = useLocalSearchParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 data dari params:", serial_number, type);
    const fetchBook = async (serial_number: string, type: string) => {
      try {
        const data = await getBookDetailById(serial_number, type);
        setBook(data?.data || null);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (serial_number && type) fetchBook(serial_number as string, type as string);
  }, [serial_number, type]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#00ffcc" />
      </View>
    );
  }

  if (!book) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-red-500">Buku tidak ditemukan.</Text>
      </View>
    );
  }

  const filename = book.cover_url.split("/").pop()!;
  const imageSource =
    imageMap[filename] || require("@/assets/cover/default.png");

  return (
    <ScrollView className="flex-1 bg-black px-4 pt-6">
      <Image
        source={imageSource}
        className="w-full h-64 rounded-xl mb-4"
        resizeMode="cover"
      />
      <Text className="text-white text-2xl font-bold">{book.title}</Text>
      <Text className="text-gray-300 text-base mt-1 mb-2">
        {book.author.join(", ")}
      </Text>

      <View className="mb-2">
        <Text className="text-green-400 font-semibold text-lg">
          Rp {book.price.toLocaleString()}
        </Text>
        <Text className="text-gray-400">Stock: {book.stock}</Text>
        <Text className="text-blue-300 italic capitalize mt-1">
          {book.book_type}
        </Text>
      </View>

      <Text className="text-gray-400 text-sm italic mb-1">
        Rilis: {new Date(book.release_date).toLocaleDateString()}
      </Text>
      <Text className="text-white font-semibold mb-1">
        Genre: {book.genre.join(", ")}
      </Text>

      <Text className="text-white font-bold text-lg mt-4 mb-2">Synopsis</Text>
      <Text className="text-gray-200 text-sm">{book.synopsis}</Text>

      <Text className="text-white font-bold text-lg mt-4 mb-2">Description</Text>
      <Text className="text-gray-200 text-sm mb-6">{book.description}</Text>
    </ScrollView>
  );
}
