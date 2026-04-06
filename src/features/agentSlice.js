import { createSlice } from "@reduxjs/toolkit";
import { fetchAgentsForUserQuery } from "./queryThunks";

const initialState = {
    agents: [],
    loading: false,
    error: null,
}

const agentSlice = createSlice({
    name: "agent",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgentsForUserQuery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAgentsForUserQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.agents = action.payload
            })
            .addCase(fetchAgentsForUserQuery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
})

export default agentSlice.reducer;