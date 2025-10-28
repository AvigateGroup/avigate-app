// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Utility Functions
 * Wraps React Native AsyncStorage with error handling and type safety
 */

/**
 * Save a string value to storage
 * @param key - Storage key
 * @param value - String value to save
 */
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw error;
  }
};

/**
 * Retrieve a string value from storage
 * @param key - Storage key
 * @returns The stored string value or null if not found
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

/**
 * Remove an item from storage
 * @param key - Storage key to remove
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
    throw error;
  }
};

/**
 * Clear all items from storage
 * WARNING: This will remove ALL stored data
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Save an object to storage (automatically stringified)
 * @param key - Storage key
 * @param value - Object to save
 */
export const setObject = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving object to storage:', error);
    throw error;
  }
};

/**
 * Retrieve an object from storage (automatically parsed)
 * @param key - Storage key
 * @returns The parsed object or null if not found
 */
export const getObject = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading object from storage:', error);
    return null;
  }
};

/**
 * Check if a key exists in storage
 * @param key - Storage key to check
 * @returns true if key exists, false otherwise
 */
export const hasKey = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error('Error checking key existence:', error);
    return false;
  }
};

/**
 * Get all storage keys
 * @returns Array of all storage keys
 */
export const getAllKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

/**
 * Get multiple items from storage
 * @param keys - Array of keys to retrieve
 * @returns Array of [key, value] pairs
 */
export const multiGet = async (
  keys: string[]
): Promise<readonly [string, string | null][]> => {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (error) {
    console.error('Error getting multiple items:', error);
    return [];
  }
};

/**
 * Save multiple items to storage
 * @param keyValuePairs - Array of [key, value] pairs to save
 */
export const multiSet = async (keyValuePairs: [string, string][]): Promise<void> => {
  try {
    await AsyncStorage.multiSet(keyValuePairs);
  } catch (error) {
    console.error('Error setting multiple items:', error);
    throw error;
  }
};

/**
 * Remove multiple items from storage
 * @param keys - Array of keys to remove
 */
export const multiRemove = async (keys: string[]): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error removing multiple items:', error);
    throw error;
  }
};