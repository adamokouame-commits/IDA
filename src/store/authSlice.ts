import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  profile: null,
  isLoading: true,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{
        user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null } | null;
        profile: UserProfile | null;
      }>
    ) => {
      state.currentUser = action.payload.user;
      state.profile = action.payload.profile;
      state.isAuthenticated = !!action.payload.user;
      state.isLoading = false;
      state.error = null;
    },
    updateProfileLocally: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logoutLocally: (state) => {
      state.currentUser = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setAuthState, updateProfileLocally, setAuthLoading, setAuthError, logoutLocally } = authSlice.actions;
export default authSlice.reducer;
