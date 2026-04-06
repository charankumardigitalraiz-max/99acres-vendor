import { createSlice } from '@reduxjs/toolkit';
import { usersData } from '../../data/mockData';

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: usersData,
    searchQuery: '',
    roleFilter: 'All',
    statusFilter: 'All',
    currentPage: 1,
    pageSize: 8,
    selectedUser: null,
  },
  reducers: {
    setSearch: (state, action) => { state.searchQuery = action.payload; state.currentPage = 1; },
    setRoleFilter: (state, action) => { state.roleFilter = action.payload; state.currentPage = 1; },
    setStatusFilter: (state, action) => { state.statusFilter = action.payload; state.currentPage = 1; },
    setPage: (state, action) => { state.currentPage = action.payload; },
    setSelectedUser: (state, action) => { state.selectedUser = action.payload; },
    // setRoleFilter: (state, action) => { state.roleFilter = action.payload; state.currentPage = 1; },

    updateUserStatus: (state, action) => {
      const { id, status } = action.payload;
      const user = state.list.find(u => u.id === id);
      if (user) user.status = status;
    },
  },
});

export const { setSearch, setRoleFilter, setStatusFilter, setPage, setSelectedUser, updateUserStatus } = usersSlice.actions;

export const selectFilteredUsers = (state) => {
  const { list, searchQuery, roleFilter, statusFilter } = state.users;
  return list.filter(u => {
    const matchSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });
};



export const selectUserById = (state, id) => {
  return state.users.list.find(u => u.id === id);
};

export default usersSlice.reducer;
