// RSS Feed Types

export type SourceType =
  | 'website'
  | 'youtube'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'reddit'
  | 'linkedin'
  | 'tiktok'
  | 'telegram'
  | 'medium'
  | 'blog';

export type FilterRule = {
  id: string;
  type: 'keyword' | 'domain' | 'date';
  value: string;
  action: 'include' | 'exclude';
};

export type RSSFeed = {
  id?: string;
  name: string;
  description?: string;
  sourceUrl: string;
  sourceType: SourceType;
  createdAt: string | Date;
  updatedAt?: string | Date;
  status: 'active' | 'paused' | 'error';
  itemCount: number;
  filters: FilterRule[];
  autoRefresh: boolean;
  refreshInterval?: number; // in minutes
};

export type FeedItem = {
  id: string;
  feedId: string;
  title: string;
  description: string;
  link: string;
  pubDate: string | Date;
  author?: string;
  categories?: string[];
  content?: string;
  imageUrl?: string;
  isPinned?: boolean;
  isHidden?: boolean;
};

export type Bundle = {
  id: string;
  name: string;
  description?: string;
  feedIds: string[];
  createdAt: string | Date;
  status: 'active' | 'paused';
  sortBy: 'date' | 'title' | 'source';
  sortOrder: 'asc' | 'desc';
};

export type WidgetStyle = {
  theme: 'light' | 'dark' | 'custom';
  primaryColor?: string;
  fontFamily?: string;
  showImages: boolean;
  showDescriptions: boolean;
  itemsPerPage: number;
};

export type Widget = {
  id: string;
  name: string;
  feedIds: string[];
  bundleId?: string;
  style: WidgetStyle;
  embedCode: string;
  createdAt: string | Date;
  views: number;
};

export type Integration = {
  id: string;
  type: 'telegram' | 'discord' | 'slack';
  feedIds: string[];
  channelId: string;
  isActive: boolean;
  lastSync?: string | Date;
};
