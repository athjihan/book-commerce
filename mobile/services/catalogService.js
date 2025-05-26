import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.BOOK_DISPLAY_API;

export const getAllBooks = async (retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(`${BASE_URL}/`);
            console.log('Successfully passed request to backend and received response.');
            return response.data;
        } catch (error) {
            if (attempt === retries) {
                console.error('Error fetching all books after retries:', error);
                throw error;
            }
            console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
};