import { createSlice } from "@reduxjs/toolkit";
import { supportTickets } from "../../data/mockData";

const SupportSlice = createSlice({
    name: "tickets",
    initialState: {
        statusFilter: 'All',
        categoryFilter: 'All',
        priorityFilter: 'All',
        tickets: supportTickets,
    },
    reducers: {
        setStatusFilter: (state, action) => { state.statusFilter = action.payload; },
        setCategoryFilter: (state, action) => { state.categoryFilter = action.payload; },
        setPriorityFilter: (state, action) => { state.priorityFilter = action.payload; },
        // addCategory: (state, action) => {
        //     const newId = Math.max(...state.supportTickets.map(c => c.id), 0) + 1;
        //     state.supportTickets.push({ id: newId, ...action.payload });
        // },
        // updateCategory: (state, action) => {
        //     const index = state.supportTickets.findIndex(c => c.id === action.payload.id);
        //     if (index !== -1) {
        //         state.supportTickets[index] = action.payload;
        //     }
        // },
        // deleteCategory: (state, action) => {
        //     state.supportTickets = state.supportTickets.filter(c => c.id !== action.payload);
        // }
    }
})

export const { setStatusFilter, setCategoryFilter, setPriorityFilter } = SupportSlice.actions;

export const selectFilteredTickets = (state) => {
    const { statusFilter, categoryFilter, priorityFilter, tickets } = state.tickets;
    return tickets.filter(s =>
        (statusFilter === 'All' || s.status === statusFilter) &&
        (categoryFilter === 'All' || s.category === categoryFilter) &&
        (priorityFilter === 'All' || s.priority === priorityFilter)
    );
};




export default SupportSlice.reducer;