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
  const { serial_number, type } = useLocalSearchParams<{ serial_number: string; type: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 data dari params (useEffect):", serial_number, type);
    const fetchBook = async (sn: string, bookType: string) => {
      setLoading(true);
      try {
        const data = await getBookDetailById(sn, bookType);
        setBook(data || null);
      } catch (err) {
        console.error("Failed to fetch book details (component):", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (serial_number && type) {
      fetchBook(serial_number, type);
    } else {
      console.warn("Serial number atau type tidak ditemukan di params.");
      setLoading(false);
      setBook(null);
    }
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
        <Text className="text-red-500 text-lg">
          Buku tidak ditemukan atau gagal dimuat.
        </Text>
        <Text className="text-gray-400 text-sm mt-2">
          Parameter: SN={serial_number}, Type={type}
        </Text>
      </View>
    );
  }

  const filename = book.cover_url?.split("/").pop();
  const imageSource = filename && imageMap[filename]
    ? imageMap[filename]
    : require("@/assets/cover/default.png");

  return (
    <ScrollView className="flex-1 bg-black px-4 pt-6 pb-6">
      <Image
        source={imageSource}
        className="w-full h-64 rounded-xl mb-4 bg-gray-700"
        resizeMode="cover"
      />
      <Text className="text-white text-2xl font-bold">{book.title}</Text>
      <Text className="text-gray-300 text-base mt-1 mb-2">
        {book.author?.join(", ") || "Penulis tidak diketahui"}
      </Text>

      <View className="mb-3 p-3 bg-gray-800 rounded-lg">
        <Text className="text-green-400 font-semibold text-xl">
          Rp {book.price?.toLocaleString() || "Harga tidak tersedia"}
        </Text>
        <Text className="text-gray-400 mt-1">Stok: {book.stock ?? "Tidak diketahui"}</Text>
        <Text className="text-blue-300 italic capitalize mt-1">
          Tipe: {book.book_type}
        </Text>
      </View>

      <View className="mb-3 p-3 bg-gray-800 rounded-lg">
        <Text className="text-gray-400 text-sm italic mb-1">
          Tanggal Rilis: {book.release_date ? new Date(book.release_date).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' }) : "Tidak diketahui"}
        </Text>
        <Text className="text-white font-semibold mb-1">
          Genre: {book.genre?.join(", ") || "Tidak ada genre"}
        </Text>
      </View>

      <View className="mb-3 p-3 bg-gray-800 rounded-lg">
        <Text className="text-white font-bold text-lg mb-2">Sinopsis</Text>
        <Text className="text-gray-200 text-sm leading-relaxed">
          {book.synopsis || "Sinopsis tidak tersedia."}
        </Text>
      </View>

      <View className="mb-6 p-3 bg-gray-800 rounded-lg">
        <Text className="text-white font-bold text-lg mb-2">Deskripsi</Text>
        <Text className="text-gray-200 text-sm leading-relaxed">
          {book.description || "Deskripsi tidak tersedia."}
        </Text>
      </View>
    </ScrollView>
  );
}