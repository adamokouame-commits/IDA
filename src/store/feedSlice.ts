import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeedItem } from '../types';

interface FeedState {
  items: FeedItem[];
  selectedItem: FeedItem | null;
  selectedCategory: string;
  searchQuery: string;
  likedItemIds: string[];
  isLoading: boolean;
}

const DEFAULT_FEED_ITEMS: FeedItem[] = [
  {
    id: 'nova-card-1',
    title: 'Aurore Boréale en Laponie',
    subtitle: 'Lueurs émeraudes et ciel étoilé au-dessus des forêts enneigées arctiques.',
    category: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800&auto=format&fit=crop&q=80',
    authorId: 'system_creator_1',
    authorName: 'Éléonore Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    likesCount: 342,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'nova-card-2',
    title: 'Architecture Néo-Brutaliste',
    subtitle: 'Compositions géométriques pures en béton armé et reflets de verre au coucher du soleil.',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    authorId: 'system_creator_2',
    authorName: 'Marc Delacroix',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    likesCount: 512,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'nova-card-3',
    title: 'Néo-Tokyo Cyber Vibes',
    subtitle: 'Néons holographiques et reflets pluvieux dans les ruelles animées de Shinjuku.',
    category: 'Urban',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    authorId: 'system_creator_3',
    authorName: 'Kenji Sato',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    likesCount: 789,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'nova-card-4',
    title: 'Minimalisme Botanique & Design',
    subtitle: 'Harmonie des textures naturelles, céramiques artisanales et feuillages d’intérieur.',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=80',
    authorId: 'system_creator_4',
    authorName: 'Clara Dubois',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    likesCount: 220,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'nova-card-5',
    title: 'Gastronomie Moléculaire & Art',
    subtitle: 'Création culinaire avant-gardiste sublimée par des émulsions aromatiques.',
    category: 'Art',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    authorId: 'system_creator_5',
    authorName: 'Julien Blanc',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    likesCount: 468,
    createdAt: new Date().toISOString(),
  },
];

const initialState: FeedState = {
  items: DEFAULT_FEED_ITEMS,
  selectedItem: null,
  selectedCategory: 'Tous',
  searchQuery: '',
  likedItemIds: [],
  isLoading: false,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      // Merge unique items from firestore or keep defaults if empty
      if (action.payload.length > 0) {
        const map = new Map<string, FeedItem>();
        DEFAULT_FEED_ITEMS.forEach((item) => map.set(item.id, item));
        action.payload.forEach((item) => map.set(item.id, item));
        state.items = Array.from(map.values());
      }
      state.isLoading = false;
    },
    addFeedItem: (state, action: PayloadAction<FeedItem>) => {
      state.items.unshift(action.payload);
    },
    setSelectedItem: (state, action: PayloadAction<FeedItem | null>) => {
      state.selectedItem = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleLikeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const isLiked = state.likedItemIds.includes(id);
      if (isLiked) {
        state.likedItemIds = state.likedItemIds.filter((item) => item !== id);
      } else {
        state.likedItemIds.push(id);
      }

      const found = state.items.find((item) => item.id === id);
      if (found) {
        found.likesCount = Math.max(0, (found.likesCount || 0) + (isLiked ? -1 : 1));
      }
      if (state.selectedItem && state.selectedItem.id === id) {
        state.selectedItem.likesCount = found?.likesCount;
      }
    },
    setFeedLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setFeedItems,
  addFeedItem,
  setSelectedItem,
  setSelectedCategory,
  setSearchQuery,
  toggleLikeItem,
  setFeedLoading,
} = feedSlice.actions;

export default feedSlice.reducer;
