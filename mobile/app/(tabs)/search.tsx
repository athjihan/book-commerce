import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { searchBooks } from "@/services/searchService";
import Card from "@/components/card";
import imageMap from "@/utils/imageMap";

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

function getFileName(cover_url: string | undefined): string {
  if (!cover_url || typeof cover_url !== "string") {
    return "default.png";
  }
  const parts = cover_url.split("/");
  return parts[parts.length - 1];
}

export default function Search() {
  const params = useLocalSearchParams();
  const { q } = params;

  const [query, setQuery] = useState(typeof q === "string" ? q : "");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      const query = typeof q === "string" ? q.trim() : "";

      if (query) {
        setIsLoading(true);
        setError(null);
        setSearchResults([]);
        try {
          const resultsFromService = await searchBooks({
            title: query,
            author: query,
          });

          const transformedResults: Book[] = resultsFromService.map(
            (item: any, index: number) => ({
              _id: item._id || `search-result-${Date.now()}-${index}`,
              title: item.title || "Tanpa Judul",
              author: Array.isArray(item.author)
                ? item.author
                : typeof item.author === "string"
                ? [item.author]
                : ["Penulis Tidak Diketahui"],
              cover_url: item.cover_url || "",
              price: item.price !== undefined ? item.price : 0,
              genre: item.genre || [],
              book_type: item.book_type || "unknown",
              serial_number: item.serial_number,
            })
          );

          setSearchResults(transformedResults);
        } catch (err: any) {
          setError(
            err.message || "Terjadi kesalahan saat melakukan pencarian."
          );
          console.error("Search error:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setError(null);
      }
    };

    performSearch();
  }, [q]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#00ff00" />
        <Text className="text-white mt-2">Mencari hasil untuk {q}...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center px-4">
        <Text className="text-red-500 text-lg text-center mb-2">Oops!</Text>
        <Text className="text-white text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black px-4 pt-6">
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
          padding: 12,
          width: "100%",
          marginBottom: 16,
        }}
      />
      <ScrollView>
        {searchResults.length > 0 ? (
          <>
            <Text className="text-white text-lg mb-4">
              Hasil pencarian untuk: <Text className="font-bold">{q}</Text>
            </Text>
            <View className="flex flex-wrap flex-row justify-start">
              {searchResults.map((book) => {
                const filename = getFileName(book.cover_url);
                const imageSource =
                  imageMap[filename] || require("@/assets/cover/default.png");

                return (
                  <Card
                    key={`${book.serial_number}-${book.book_type}`}
                    book={book}
                    imageSource={imageSource}
                  />
                );
              })}
            </View>
          </>
        ) : (
          q &&
          !isLoading && (
            <Text className="text-gray-400 text-lg text-center mt-10">
              Tidak ada hasil yang ditemukan untuk {q}.
            </Text>
          )
        )}
        {!q && !isLoading && searchResults.length === 0 && (
          <Text className="text-gray-400 text-lg text-center mt-10">
            Silakan masukkan kata kunci di kolom pencarian di atas.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
