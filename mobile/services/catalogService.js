import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BOOK_DISPLAY_API;

export const getAllBooks = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log('Successfully passed request to backend and received response.');
        return response.data;
    } catch (error) {
        console.error('Error fetching all books:', error);
        throw error;
    }
};