import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookmarksState {
  bookmarkedIds: string[];
  isSyncing: boolean;
}

const initialState: BookmarksState = {
  bookmarkedIds: ['nova-card-1', 'nova-card-3'],
  isSyncing: false,
};

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setBookmarks: (state, action: PayloadAction<string[]>) => {
      state.bookmarkedIds = action.payload;
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.bookmarkedIds.includes(id)) {
        state.bookmarkedIds = state.bookmarkedIds.filter((item) => item !== id);
      } else {
        state.bookmarkedIds.push(id);
      }
    },
    setBookmarkSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
  },
});

export const { setBookmarks, toggleBookmark, setBookmarkSyncing } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
