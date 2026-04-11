import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createQuery,
  fetchAllQueries,
  getAgentsForUserQuery,
  getQueryById,
  addCommentToQuery,
  updateQueryStatus,
  addOrUpdateReview,
  getAgentById,
  toggleFavoriteStatus,
} from "../api/queryApi";

export const fetchQueryById = createAsyncThunk(
  "query/fetchQueryById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getQueryById(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchAgentsForUserQuery = createAsyncThunk(
  "query/fetchAgentsForUserQuery",
  async ({ queryId, type = "all", search }, { rejectWithValue }) => {
    try {
      const res = await getAgentsForUserQuery(queryId, type, search);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchAllQueriesThunk = createAsyncThunk(
  "query/fetchAllQueries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchAllQueries();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createQueryThunk = createAsyncThunk(
  "query/createQuery",
  async (queryData, { rejectWithValue }) => {
    try {
      const res = await createQuery(queryData);

      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addCommentInQueryThunk = createAsyncThunk(
  "query/addCommentInQuery",
  async (commentData, { rejectWithValue }) => {
    try {
      const res = await addCommentToQuery(commentData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateQueryStatusThunk = createAsyncThunk(
  "query/updateQueryStatus",
  async (statusData, { rejectWithValue }) => {
    try {
      const res = await updateQueryStatus(statusData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const toggleFavoriteStatusThunk = createAsyncThunk(
  "query/toggleFavoriteStatus",
  async ({ agentId, profileId }, { rejectWithValue }) => {
    try {
      const res = await toggleFavoriteStatus({ agentId, profileId });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addOrUpdateReviewThunk = createAsyncThunk(
  "query/addOrUpdateReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const res = await addOrUpdateReview(reviewData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchAgentByIdThunk = createAsyncThunk(
  "query/getAgentById",
  async ({ agentId, profileId }, { rejectWithValue }) => {
    try {
      const res = await getAgentById(agentId, profileId);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
