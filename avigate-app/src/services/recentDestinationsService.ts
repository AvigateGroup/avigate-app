// src/services/recentDestinationsService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RecentDestination {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  timestamp: number; // When it was added/last used
  useCount: number; // How many times it's been used
}

const STORAGE_KEY = '@avigate:recent_destinations';
const MAX_RECENT_DESTINATIONS = 10;

class RecentDestinationsService {
  /**
   * Get all recent destinations sorted by most recent first
   */
  async getRecentDestinations(): Promise<RecentDestination[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const destinations: RecentDestination[] = JSON.parse(data);

      // Sort by timestamp (most recent first)
      return destinations.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error loading recent destinations:', error);
      return [];
    }
  }

  /**
   * Get frequent destinations sorted by use count
   */
  async getFrequentDestinations(): Promise<RecentDestination[]> {
    try {
      const destinations = await this.getRecentDestinations();

      // Filter destinations with more than 1 use and sort by use count
      return destinations
        .filter(dest => dest.useCount > 1)
        .sort((a, b) => b.useCount - a.useCount)
        .slice(0, 5); // Top 5 frequent destinations
    } catch (error) {
      console.error('Error loading frequent destinations:', error);
      return [];
    }
  }

  /**
   * Add or update a destination when user selects it
   */
  async addDestination(destination: Omit<RecentDestination, 'timestamp' | 'useCount' | 'id'>): Promise<void> {
    try {
      const existing = await this.getRecentDestinations();

      // Check if destination already exists (by name and coordinates)
      const existingIndex = existing.findIndex(
        dest =>
          dest.name === destination.name &&
          Math.abs(dest.latitude - destination.latitude) < 0.001 &&
          Math.abs(dest.longitude - destination.longitude) < 0.001
      );

      if (existingIndex !== -1) {
        // Update existing: increment use count and update timestamp
        existing[existingIndex].timestamp = Date.now();
        existing[existingIndex].useCount += 1;
      } else {
        // Add new destination
        const newDestination: RecentDestination = {
          ...destination,
          id: `dest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          useCount: 1,
        };

        existing.unshift(newDestination);

        // Keep only the most recent MAX_RECENT_DESTINATIONS
        if (existing.length > MAX_RECENT_DESTINATIONS) {
          existing.pop();
        }
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Error adding recent destination:', error);
    }
  }

  /**
   * Remove a specific destination from recent list
   */
  async removeDestination(id: string): Promise<void> {
    try {
      const existing = await this.getRecentDestinations();
      const filtered = existing.filter(dest => dest.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing recent destination:', error);
    }
  }

  /**
   * Clear all recent destinations
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing recent destinations:', error);
    }
  }
}

export default new RecentDestinationsService();
