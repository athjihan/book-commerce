import axios from "axios";
import Constants from "expo-constants";
import { getCache, setCache } from "../utils/cache";

const BASE_URL = Constants.expoConfig.extra.BOOK_DETAIL_API;

export const getBookDetailById = async (id) => {
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error("ID buku tidak valid");
  }

  const cacheKey = `book_detail_${id}`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log("📦 Data detail buku dari cache");
    return cachedData;
  }

  try {
    const response = await axios.get(`${BASE_URL}/${encodeURIComponent(id)}`);

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
