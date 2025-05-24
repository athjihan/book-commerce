import { getAllBooks } from "@/services/catalogService";
import imageMap from "@/utils/imageMap";
import Card from "@/components/card";
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
  _id: string;
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
    <SafeAreaView className="flex-1 bg-black px-4 pt-6">
      <ScrollView>
        <View className="flex flex-wrap flex-row justify-between">
          {paginatedBooks.map((book, index) => {
            const filename = getFileName(book.cover_url);
            const imageSource =
              imageMap[filename] || require("@/assets/cover/default.png");

            return (
                <Card key={index} book={book} imageSource={imageSource} />
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
