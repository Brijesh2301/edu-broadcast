import { configureStore, createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    contentFilter: 'all',
    searchQuery: '',
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setContentFilter: (state, action) => {
      state.contentFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.contentFilter = 'all';
      state.searchQuery = '';
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setContentFilter,
  setSearchQuery,
  resetFilters,
} = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});
