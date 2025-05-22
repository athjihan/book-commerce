import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BOOK_DETAIL_API

export const getBookDetailById = async (id) => {
    if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
        throw new Error('ID buku tidak valid');
    }
    try {
        const response = await axios.get(`${BASE_URL}/${encodeURIComponent(id)}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengambil detail buku');
    }
};