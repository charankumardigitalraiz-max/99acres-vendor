import { createSlice } from "@reduxjs/toolkit";
import { categoriesData } from "../../data/mockData";

const CategorySlice = createSlice({
    name: "categories",
    initialState: {
        statusFilter: 'All',
        categories: categoriesData,
    },
    reducers: {
        setStatusFilter: (state, action) => { state.statusFilter = action.payload; },
        addCategory: (state, action) => {
            const newId = Math.max(...state.categories.map(c => c.id), 0) + 1;
            state.categories.push({ id: newId, ...action.payload });
        },
        updateCategory: (state, action) => {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        deleteCategory: (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        }
    }
})

export const { setStatusFilter, addCategory, updateCategory, deleteCategory } = CategorySlice.actions;

export const selectFilteredCategories = (state) => {
    const { statusFilter, categories } = state.categories;

    if (statusFilter === 'All') return categories;

    return categories.filter(s => s.status === statusFilter);
};
export default CategorySlice.reducer;