import { createSlice } from '@reduxjs/toolkit';
import { monthlyRevenueReport, propertyTypeData } from '../../data/mockData';

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    revenueReport: monthlyRevenueReport,
    propertyTypeData,
    dateRange: '6months',
    activeTab: 'revenue',
  },
  reducers: {
    setDateRange: (state, action) => { state.dateRange = action.payload; },
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
  },
});

export const { setDateRange, setActiveTab } = reportsSlice.actions;
export default reportsSlice.reducer;
