import axios from "axios";
import Constants from "expo-constants";
import { getCache, setCache } from "../utils/cache";

const BASE_URL = Constants.expoConfig.extra.BOOK_SEARCH_API;

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "in", "on", "for", "to", "is", "are", "was", "were",
  "dan", "atau", "dari", "di", "ke", "untuk", "adalah", "saya", "kamu", "dia"
]);

const normalizeQueryTermForKey = (term) => {
  if (typeof term !== 'string' || !term.trim()) {
    return "";
  }
  let normalized = term.toLowerCase();
  normalized = normalized.replace(/[^\w\s\-]/gi, "").trim();
  const words = normalized.split(/\s+/).filter(word => word.length > 0);

  const significantWords = words.filter(word => !STOP_WORDS.has(word) && word.length > 1);

  const wordsToProcess = significantWords.length > 0 ? significantWords : words;

  wordsToProcess.sort();

  return wordsToProcess.join("_");
};


export const searchBooks = async (params = {}) => {
  try {
    const originalTitle = params.title || "";
    const originalAuthor = params.author || "";

    const apiParams = {};
    if (typeof originalTitle === "string" && originalTitle.trim()) {
      apiParams.title = originalTitle.trim().replace(/[^\w\s\-.,']/gi, "");
    }
    if (typeof originalAuthor === "string" && originalAuthor.trim()) {
      apiParams.author = originalAuthor.trim().replace(/[^\w\s\-.,']/gi, "");
    }

    const normalizedTitleForKey = normalizeQueryTermForKey(originalTitle);
    const normalizedAuthorForKey = normalizeQueryTermForKey(originalAuthor);

    const cacheKey = `book_search_t_${normalizedTitleForKey}_a_${normalizedAuthorForKey}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`📦 Data searchBooks dari cache (key: ${cacheKey})`);
      return cachedData;
    }

    const queryParamsForApi = {};
    if (apiParams.title) queryParamsForApi.title = apiParams.title;
    if (apiParams.author) queryParamsForApi.author = apiParams.author;

    if (Object.keys(queryParamsForApi).length === 0 && (originalTitle.trim() || originalAuthor.trim())) {
        console.log("Query tidak menghasilkan parameter valid untuk API setelah normalisasi dasar.");
        await setCache(cacheKey, [], 604800); // Cache hasil kosong
        return [];
    } else if (Object.keys(queryParamsForApi).length === 0) {
        return [];
    }


    const response = await axios.get(`${BASE_URL}/`, { params: queryParamsForApi });

    console.log("📡 Data searchBooks dari backend:", response.data);

    const fullData = Array.isArray(response.data)
      ? response.data.map((item) => ({
          _id: item._id,
          title: item.title,
          author: item.author,
          book_type: item.book_type,
          cover_url: item.cover_url,
          price: item.price,
          genre: item.genre,
          serial_number: item.serial_number,
          store: {
            store_name: item.store?.store_name || "",
            store_phoneNumber: item.store?.store_phoneNumber || "",
            store_email: item.store?.store_email || "",
            store_address: item.store?.store_address || "",
            store_city: item.store?.store_city || "",
            store_country: item.store?.store_country || ""
          },
          release_date: item.release_date,
          stock: item.stock,
          created_at: item.created_at,
          description: item.description,
          synopsis: item.synopsis
        }))
      : [];

    await setCache(cacheKey, fullData, 604800);
    console.log(`💾 Data disimpan ke cache (key: ${cacheKey})`);

    return fullData;
  } catch (error) {
    let errorMessage = "Terjadi kesalahan saat mencari buku.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage += ` ${error.response.data.message}`;
    } else if (error.message) {
      errorMessage += ` ${error.message}`;
    }
    console.error(errorMessage, error);
    return [];
  }
};