import { createSlice } from "@reduxjs/toolkit";
import { staffRoles } from "../../data/mockData";

const initialState = {
    roles: staffRoles,
    loading: false,
    error: null,
}

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        addRoles: (state, action) => {
            const newId = Math.max(...state.roles.map(role => role.id), 0) + 1;
            const newRole = { id: newId, ...action.payload };
            state.roles.push(newRole);
        },
        updaterole: (state, action) => {
            const index = state.roles.findIndex(role => role.id === action.payload.id);
            if(index !== -1){
                state.roles[index] = {...state.roles[index], ...action.payload};
            }
        },
        deleteRole: (state, action) => {
            state.roles = state.roles.filter(role => role.id !== action.payload.id);
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { addRoles, updaterole, deleteRole, setLoading, setError } = roleSlice.actions;
export default roleSlice.reducer;