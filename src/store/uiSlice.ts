import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootTab, ScreenModal } from '../types';

interface UiState {
  currentTab: RootTab;
  activeModal: ScreenModal;
  deviceViewMode: 'device' | 'fluid';
  selectedPhoneModel: 'iphone' | 'android';
  toast: {
    message: string;
    type: 'success' | 'info' | 'error';
  } | null;
}

const initialState: UiState = {
  currentTab: 'feed',
  activeModal: 'none',
  deviceViewMode: 'device',
  selectedPhoneModel: 'iphone',
  toast: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentTab: (state, action: PayloadAction<RootTab>) => {
      state.currentTab = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<ScreenModal>) => {
      state.activeModal = action.payload;
    },
    toggleDeviceViewMode: (state) => {
      state.deviceViewMode = state.deviceViewMode === 'device' ? 'fluid' : 'device';
    },
    setDeviceViewMode: (state, action: PayloadAction<'device' | 'fluid'>) => {
      state.deviceViewMode = action.payload;
    },
    setPhoneModel: (state, action: PayloadAction<'iphone' | 'android'>) => {
      state.selectedPhoneModel = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type?: 'success' | 'info' | 'error' }>) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  setCurrentTab,
  setActiveModal,
  toggleDeviceViewMode,
  setDeviceViewMode,
  setPhoneModel,
  showToast,
  clearToast,
} = uiSlice.actions;

export default uiSlice.reducer;
