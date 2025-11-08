// RSS Feed Database Service
// This service provides data persistence for the RSS platform
// Currently uses window.storage, but can be extended to use a real database

import type { RSSFeed, FeedItem, Bundle, Widget } from '../types';

export const DatabaseService = {
  // RSS Feeds
  async getAllFeeds(): Promise<RSSFeed[]> {
    try {
      if (window.storage) {
        const data = await window.storage.get('rssFeeds');
        return data ? JSON.parse(data) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading feeds:', error);
      return [];
    }
  },

  async createFeed(feed: RSSFeed): Promise<RSSFeed> {
    try {
      const feeds = await this.getAllFeeds();
      const newFeed = { ...feed, id: feed.id || Date.now().toString() };
      feeds.push(newFeed);
      if (window.storage) {
        await window.storage.set('rssFeeds', JSON.stringify(feeds));
      }
      return newFeed;
    } catch (error) {
      console.error('Error creating feed:', error);
      throw error;
    }
  },

  async updateFeed(feedId: string, updates: Partial<RSSFeed>): Promise<RSSFeed> {
    try {
      const feeds = await this.getAllFeeds();
      const index = feeds.findIndex(f => f.id === feedId);
      if (index === -1) throw new Error('Feed not found');

      feeds[index] = { ...feeds[index], ...updates };
      if (window.storage) {
        await window.storage.set('rssFeeds', JSON.stringify(feeds));
      }
      return feeds[index];
    } catch (error) {
      console.error('Error updating feed:', error);
      throw error;
    }
  },

  async deleteFeed(feedId: string): Promise<void> {
    try {
      const feeds = await this.getAllFeeds();
      const filtered = feeds.filter(f => f.id !== feedId);
      if (window.storage) {
        await window.storage.set('rssFeeds', JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('Error deleting feed:', error);
      throw error;
    }
  },

  // Feed Items
  async getFeedItems(feedId?: string): Promise<FeedItem[]> {
    try {
      if (window.storage) {
        const data = await window.storage.get('feedItems');
        const items: FeedItem[] = data ? JSON.parse(data) : [];
        return feedId ? items.filter(item => item.feedId === feedId) : items;
      }
      return [];
    } catch (error) {
      console.error('Error loading feed items:', error);
      return [];
    }
  },

  // Bundles
  async getAllBundles(): Promise<Bundle[]> {
    try {
      if (window.storage) {
        const data = await window.storage.get('bundles');
        return data ? JSON.parse(data) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading bundles:', error);
      return [];
    }
  },

  // Widgets
  async getAllWidgets(): Promise<Widget[]> {
    try {
      if (window.storage) {
        const data = await window.storage.get('widgets');
        return data ? JSON.parse(data) : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading widgets:', error);
      return [];
    }
  },

  // Utility
  async disconnect(): Promise<void> {
    // Cleanup if needed
    console.log('Database service disconnected');
  }
};

// Global storage interface declaration
declare global {
  interface Window {
    storage?: {
      get: (key: string) => Promise<any>;
      set: (key: string, value: any) => Promise<void>;
    };
  }
}
