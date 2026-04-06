import { createSlice } from "@reduxjs/toolkit";
import {
  addCommentInQueryThunk,
  createQueryThunk,
  fetchAllQueriesThunk,
  fetchQueryById,
  fetchAgentByIdThunk,
} from "./queryThunks";

const initialState = {
  query: null,
  loading: false,
  error: null,
};

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQueryById.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload;
      })
      .addCase(fetchQueryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const queriesInitialState = {
  queries: [],
  loading: false,
  error: null,
};

const queriesSlice = createSlice({
  name: "queries",
  initialState: queriesInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllQueriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQueriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.queries = action.payload;
      })
      .addCase(fetchAllQueriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const createQueryInitialState = {
  data: null,
  loading: false,
  error: null,
};

const createQuerySlice = createSlice({
  name: "createQuery",
  initialState: createQueryInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createQueryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQueryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(createQueryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const addCommentInitialState = {
  data: null,
  loading: false,
  error: null,
};

const addCommentSlice = createSlice({
  name: "addComment",
  initialState: addCommentInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCommentInQueryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommentInQueryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addCommentInQueryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const updateQueryStatusInitialState = {
  data: null,
  loading: false,
  error: null,
};

const updateQueryStatusSlice = createSlice({
  name: "updateQueryStatus",
  initialState: updateQueryStatusInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateQueryStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQueryStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateQueryStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const toggleFavoriteinitialState = {
  data: null,
  loading: false,
  error: null,
};

const toggleFavoriteSlice = createSlice({
  name: "toggleFavorite",
  initialState: toggleFavoriteinitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavoriteStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavoriteStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(toggleFavoriteStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const addOrUpdateReviewInitialState = {
  data: null,
  loading: false,
  error: null,
};

const addOrUpdateReviewSlice = createSlice({
  name: "addOrUpdateReview",
  initialState: addOrUpdateReviewInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOrUpdateReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(addOrUpdateReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


const fetchAgentByIdInitialState = {
  data: null,
  loading: false,
  error: null,
};

const fetchAgentByIdSlice = createSlice({
  name: "fetchAgentById",
  initialState: fetchAgentByIdInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentByIdThunk.fulfilled, (state, action) => {
        
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAgentByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});




const queryReducer = querySlice.reducer;
const queriesReducer = queriesSlice.reducer;
const createQueryReducer = createQuerySlice.reducer;
const addCommentReducer = addCommentSlice.reducer;
const updateQueryStatusReducer = updateQueryStatusSlice.reducer;
const toggleFavoriteReducer = toggleFavoriteSlice.reducer;
const addOrUpdateReviewReducer = addOrUpdateReviewSlice.reducer;
const fetchAgentByIdReducer = fetchAgentByIdSlice.reducer;

export {
  queryReducer,
  queriesReducer,
  createQueryReducer,
  addCommentReducer,
  updateQueryStatusReducer,
  toggleFavoriteReducer,
  addOrUpdateReviewReducer,
  fetchAgentByIdReducer
};
