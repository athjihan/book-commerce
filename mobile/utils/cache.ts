import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  value: T;
  expiry: number;
}

export const setCache = async <T>(key: string, data: T, ttlInSeconds: number = 604800): Promise<void> => {
    const item: CacheItem<T> = {
        value: data,
        expiry: Date.now() + ttlInSeconds * 1000,
    };
    try {
        await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
        console.warn(`Gagal menyimpan cache untuk key: ${key}`, e);
    }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const itemStr = await AsyncStorage.getItem(key);
    if (!itemStr) return null;

    const item: CacheItem<T> = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.warn(`Gagal mengambil cache untuk key: ${key}`, e);
    return null;
  }
};
