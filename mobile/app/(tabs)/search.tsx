import { useState } from "react";
import { View, Text, TextInput, FlatList, Button } from "react-native";
import { searchBooks } from "../../services/searchService"; // path ini sesuaikan ya

export default function Search() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");
      const results = await searchBooks({ title: query });
      setBooks(results);
    } catch (err) {
      console.error("Search error:", err.message);
      setError("Gagal mengambil data buku.");
    }
  };

  return (
    <View className="flex-1 bg-black px-4 pt-6">
      <TextInput
        className="bg-zinc-800 text-white rounded px-4 py-2 mb-4"
        placeholder="Cari judul buku"
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        style={{
          backgroundColor: "#1f1f1f",
          color: "#fff",
          padding: 10,
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      <Button title="Search" onPress={handleSearch} />

      {error ? (
        <Text className="text-red-400">{error}</Text>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={({ item }) => (
            <View className="mb-4">
              <Text className="text-white font-bold text-lg">{item.title}</Text>
              <Text className="text-gray-300">{item.author.join(", ")}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
