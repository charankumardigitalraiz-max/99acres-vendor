import { createSlice } from "@reduxjs/toolkit";
import { reviewsData } from "../../data/mockData";

const initialState = {
    reviews: reviewsData,
    statusFilter: 'All',
    propertyFilter: 'All',
    loading: false,
    error: null,
}

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        addReview: (state, action) => {
            state.reviews.push(action.payload);
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload;
        },
        setPropertyFilter: (state, action) => {
            state.propertyFilter = action.payload;
        },
        showById: (state, action) => {
            return state.reviews.find(review => review.id === action.payload.id);
        }
    },
});


export const selectFilteredReviews = (state) => {
    const { reviews, statusFilter, propertyFilter } = state.reviews;
    return reviews.filter(review => {
        const matchStatus = statusFilter === 'All' || review.status === statusFilter;
        const matchProperty = propertyFilter === 'All' || Number(review.propertyId) === Number(propertyFilter);
        return matchStatus && matchProperty;
    });
};


export const selectReviewsByPropertyId = (state, id) => {
    return state.reviews.reviews.filter(review => review.propertyId === id);
};

export const { addReview, showById, setStatusFilter, setPropertyFilter } = reviewSlice.actions;
export default reviewSlice.reducer;
