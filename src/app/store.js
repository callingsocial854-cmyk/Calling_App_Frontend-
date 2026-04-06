import { configureStore } from "@reduxjs/toolkit";
import { createQueryReducer, queriesReducer, queryReducer, addCommentReducer, fetchAgentByIdReducer } from "../features/querySlice";
import agentReducer from "../features/agentSlice";
import networkReducer from "../features/networkSlice";

export const store = configureStore({
  reducer: {
    query: queryReducer,
    agents: agentReducer,
    queries: queriesReducer,
    createQuery: createQueryReducer,
    addComment: addCommentReducer,
    agentData: fetchAgentByIdReducer,
    network: networkReducer,
  },
});
