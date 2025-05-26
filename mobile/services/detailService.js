import axios from "axios";
import Constants from "expo-constants";
import { getCache, setCache } from "../utils/cache";

const BASE_URL = Constants.expoConfig.extra.BOOK_DETAIL_API;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
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
      lastError = error;
      if (attempt < MAX_RETRIES) {
        console.warn(`Percobaan ke-${attempt} gagal, mencoba ulang dalam ${RETRY_DELAY_MS}ms...`);
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  let errorMessage = "Terjadi kesalahan saat mengambil detail buku";
  if (lastError && lastError.response) {
    console.error(`🚨 Error API ${lastError.response.status}:`, lastError.response.data);
    errorMessage = lastError.response.data?.error || lastError.response.data?.message || `Server error: ${lastError.response.status}`;
  } else if (lastError && lastError.request) {
    console.error("🚨 Error Network/Request:", lastError.request);
    errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  } else if (lastError) {
    console.error("🚨 Error Lain:", lastError.message);
    errorMessage = lastError.message;
  }
  const errToThrow = new Error(errorMessage);
  if (lastError && lastError.response) errToThrow.response = lastError.response;
  throw errToThrow;
};