import axios from "axios";
import Constants from "expo-constants";
import { getCache, setCache } from "../utils/cache";

const BASE_URL = Constants.expoConfig.extra.BOOK_DETAIL_API;

export const getBookDetailById = async (serial_number, type) => {
  if (!BASE_URL) {
    console.error("URL API detail buku (BOOK_DETAIL_API) tidak ditemukan di konfigurasi Expo.");
    throw new Error("URL API detail buku tidak ditemukan");
  }

  if (!serial_number || !type) {
    console.warn("Serial number atau tipe buku kosong saat memanggil getBookDetailById.");
    throw new Error("Serial number dan tipe buku tidak boleh kosong");
  }

  const validFormatRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validFormatRegex.test(serial_number)) {
    throw new Error("Format serial number tidak valid.");
  }
  if (!validFormatRegex.test(type)) {
    throw new Error("Format tipe buku tidak valid.");
  }

  const cacheKey = `book-detail:${serial_number}:${type}`;

  try {
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`📦 Data detail buku dari cache (frontend): ${cacheKey}`);
      return cachedData;
    }
  } catch (cacheError) {
    console.warn("Gagal membaca dari cache:", cacheError);
  }

  const requestUrl = `${BASE_URL}/${encodeURIComponent(serial_number)}/${encodeURIComponent(type)}`;
  console.log("🌐 Request URL (frontend):", requestUrl);

  try {
    const response = await axios.get(requestUrl);
    console.log("📖 Data detail buku diterima dari API (frontend):", response.data);

    if (response.data && typeof response.data === 'object') {
      await setCache(cacheKey, response.data, 604800);
      return response.data;
    } else {
      console.error("Data API tidak valid:", response.data);
      throw new Error("Format data dari API tidak sesuai");
    }

  } catch (error) {
    let errorMessage = "Terjadi kesalahan saat mengambil detail buku";
    if (error.response) {
      console.error(`🚨 Error API ${error.response.status}:`, error.response.data);
      errorMessage = error.response.data?.error || error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      console.error("🚨 Error Network/Request:", error.request);
      errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    } else {
      console.error("🚨 Error Lain:", error.message);
      errorMessage = error.message;
    }
    const errToThrow = new Error(errorMessage);
    errToThrow.response = error.response;
    throw errToThrow;
  }
};