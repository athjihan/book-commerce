import axios from "axios";
import Constants from "expo-constants";
import { getCache, setCache } from "../utils/cache";

const BASE_URL = Constants.expoConfig.extra.BOOK_DETAIL_API;

export const getBookDetailById = async (serial_number, type) => {
  if (!serial_number && !type || !/^[a-zA-Z0-9_-]+$/.test(serial_number, type)) {
    throw new Error("ID buku tidak valid");
  }

  const cacheKey = `book-detail:${serial_number}:${type}`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log("📦 Data detail buku dari cache");
    return cachedData;
  }
  if (!BASE_URL) {
    throw new Error("URL API detail buku tidak ditemukan");
  }
  try {
    const response = await axios.get(`${BASE_URL}/${serial_number}/${type}`);
    console.log("🌐 Request URL:", `${BASE_URL}/${serial_number}/${type}`);
    console.log("📖 Data detail buku:", response.data);
    await setCache(cacheKey, response.data, 604800);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan saat mengambil detail buku"
    );
  }
};
