import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BOOK_SEARCH_API

export const searchBooks = async (params = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}/`, { params });
        return response.data;
    } catch (error) {
        // Tambahkan pesan error yang lebih jelas
        let errorMessage = 'Terjadi kesalahan saat mencari buku.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage += ` ${error.response.data.message}`;
        } else if (error.message) {
            errorMessage += ` ${error.message}`;
        }
        throw new Error(errorMessage);
    }
};