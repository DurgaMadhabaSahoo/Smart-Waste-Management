import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTrucks = createAsyncThunk(
  'truck/fetchTrucks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token; // ← Get token from userSlice
      const res = await axios.get('/api/trucks/numbers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const truckSlice = createSlice({
  name: 'truck',
  initialState: {
    trucks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.trucks = action.payload;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default truckSlice.reducer;
