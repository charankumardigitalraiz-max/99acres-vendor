import { createSlice } from '@reduxjs/toolkit';
import { propertiesData } from '../../data/mockData';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    list: propertiesData,
    searchQuery: '',
    typeFilter: '',
    statusFilter: '',
    cityFilter: '',
    currentPage: 1,
    pageSize: 8,
    selectedProperty: null,
  },
  reducers: {
    setSearch: (state, action) => { state.searchQuery = action.payload; state.currentPage = 1; },
    setTypeFilter: (state, action) => { state.typeFilter = action.payload; state.currentPage = 1; },
    setStatusFilter: (state, action) => { state.statusFilter = action.payload; state.currentPage = 1; },
    setCityFilter: (state, action) => { state.cityFilter = action.payload; state.currentPage = 1; },
    setPage: (state, action) => { state.currentPage = action.payload; },
    setSelectedProperty: (state, action) => { state.selectedProperty = action.payload; },
    updatePropertyStatus: (state, action) => {
      const { id, status, rejectionReason } = action.payload;
      const prop = state.list.find(p => Number(p.id) === Number(id));
      if (prop) {
        prop.status = status;
        if (rejectionReason) prop.rejectionReason = rejectionReason;
      }
    },
  },
});

export const { setSearch, setTypeFilter, setStatusFilter, setCityFilter, setPage, setSelectedProperty, updatePropertyStatus } = productsSlice.actions;

export const selectFilteredProperties = (state) => {
  const { list, searchQuery, typeFilter, statusFilter, cityFilter } = state.products;

  // SIMULATION: In a vendor dashboard, we only show 'Self Properties'
  const CURRENT_VENDOR_ID = '10002'; // Priya Mehta

  return list.filter(p => {
    // Only show properties belonging to the current vendor
    if (p.userId !== CURRENT_VENDOR_ID) return false;

    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !typeFilter || p.propertyType?.toLowerCase() === typeFilter.toLowerCase();
    const matchStatus = !statusFilter || p.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchCity = !cityFilter || p.city === cityFilter;
    return matchSearch && matchType && matchStatus && matchCity;
  });
};

export const selectPropertiesByUserId = (state, id) => {
  return state.products.list.filter(u => u.userId === id);
};

export const selectPropertyById = (state, id) => {
  return state.products.list.find(p => p.id === Number(id) || p.id === id);
};

export const selectWishlistedProperties = (state, wishlistIds) => {
  if (!wishlistIds || !Array.isArray(wishlistIds)) return [];
  return state.products.list.filter(p => wishlistIds.includes(p.id));
};


export default productsSlice.reducer;
