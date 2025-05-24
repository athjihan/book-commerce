import axios from "axios";
import Constants from "expo-constants";
import { getCache, setCache } from "../utils/cache";

const BASE_URL = Constants.expoConfig.extra.BOOK_SEARCH_API;

export const searchBooks = async (params = {}) => {
  try {
    const allowedParams = {};
    if (typeof params.title === "string") {
      allowedParams.title = params.title.replace(/[^\w\s\-.,]/gi, "");
    }
    if (typeof params.author === "string") {
      allowedParams.author = params.author.replace(/[^\w\s\-.,]/gi, "");
    }

    const cacheKey = `book_search_${allowedParams.title || ""}_${
      allowedParams.author || ""
    }`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log("📦 Data searchBooks dari cache");
      return cachedData;
    }

    const response = await axios.get(`${BASE_URL}/`, { params: allowedParams });

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
        }))
      : [];

    await setCache(cacheKey, fullData, 604800);

    return fullData;
  } catch (error) {
    let errorMessage = "Terjadi kesalahan saat mencari buku.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage += ` ${error.response.data.message}`;
    } else if (error.message) {
      errorMessage += ` ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};