import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    notifications: 4,
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarCollapsed: (state, action) => { state.sidebarCollapsed = action.payload; },
    clearNotifications: (state) => { state.notifications = 0; },
  },
});

export const { toggleSidebar, setSidebarCollapsed, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;
