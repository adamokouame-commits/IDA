export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  themePreference?: 'dark' | 'light' | 'system';
  notificationsEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeedItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likesCount?: number;
  createdAt: string;
}

export type RootTab = 'feed' | 'studio' | 'bookmarks' | 'profile';

export type ScreenModal = 'none' | 'itemDetail' | 'createPost' | 'editProfile' | 'authModal';

export interface DynamicImageConfig {
  baseUrl: string;
  width: number;
  height: number;
  category: string;
  blur: number;
  grayscale: boolean;
  htmlSnippet: string;
}
