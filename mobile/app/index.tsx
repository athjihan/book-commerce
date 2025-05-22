import { getAllBooks } from "@/services/catalogService";
import imageMap from "@/app/utils/imageMap";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "./global.css";

// ✅ Tambah tipe Book
interface Book {
  cover_url: string;
  title: string;
  author: string[];
  price: number;
  genre: string[];
  book_type: string;
}

export default function Index() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const booksPerPage = 9;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllBooks();
        console.log("Fetched books data:", data);
        setBooks(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };
    fetchBooks();
  }, []);

  // Fungsi untuk ngambil nama file dari cover_url
  function getFileName(cover_url: string): string {
    const parts = cover_url.split("/");
    return parts[parts.length - 1];
  }

  const startIndex = (page - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const paginatedBooks = books.slice(startIndex, endIndex);
  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <ScrollView>
        <View className="flex flex-wrap flex-row justify-between">
          {paginatedBooks.map((book, index) => {
            const filename = getFileName(book.cover_url);
            const imageSource = imageMap[filename] || require("@/assets/cover/default.png");

            return (
              <View
                key={index}
                className="w-[31%] bg-gray-100 rounded-2xl p-2 mb-4 shadow-md"
              >
                <Image
                  source={imageSource}
                  className="w-full h-36 rounded-lg mb-2"
                  resizeMode="cover"
                />
                <Text className="text-base font-bold text-black">
                  {book.title}
                </Text>
                <Text className="text-sm text-gray-700">
                  {book.author.join(", ")}
                </Text>
                <Text className="text-sm text-green-600 font-semibold mt-1">
                  Rp {book.price.toLocaleString()}
                </Text>
                {book.book_type === "e-book" ? (
                  <View className="bg-green-300 px-2 py-0.5 rounded-full mt-1 self-start">
                    <Text className="text-xs italic text-green-900">
                      {book.book_type}
                    </Text>
                  </View>
                ) : book.book_type === "physics" ? (
                  <View className="bg-red-200 px-2 py-0.5 rounded-full mt-1 self-start">
                    <Text className="text-xs italic text-red-800">
                      {book.book_type}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-xs italic text-gray-500">
                    {book.book_type}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        <View className="flex flex-row justify-between mt-4 mb-6">
          <TouchableOpacity
            onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-blue-500 rounded-xl"
          >
            <Text className="text-white font-bold">Previous</Text>
          </TouchableOpacity>

          <Text className="text-center font-bold text-lg">
            Page {page} of {totalPages}
          </Text>

          <TouchableOpacity
            onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-blue-500 rounded-xl"
          >
            <Text className="text-white font-bold">Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
