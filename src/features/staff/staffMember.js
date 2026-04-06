import { createSlice } from "@reduxjs/toolkit";
import { staffMembers } from "../../data/mockData";

const initialState = {
    members: staffMembers,
    loading: false,
    error: null,
}

const staffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: {
        addMember: (state, action) => {
            const newId = Math.max(...state.members.map(m => m.id), 0) + 1;
            const newMember = { id: newId, ...action.payload, joined: new Date().toISOString().split('T')[0] };
            state.members.push(newMember);
        },
        updateMember: (state, action) => {
            const index = state.members.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.members[index] = { ...state.members[index], ...action.payload };
            }
        },
        deleteMember: (state, action) => {
            state.members = state.members.filter(m => m.id !== action.payload.id);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { addMember, updateMember, deleteMember, setLoading, setError } = staffSlice.actions;
export default staffSlice.reducer;
