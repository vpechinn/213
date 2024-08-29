import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Deed {
  deedId: string;
  title: string;
  description: string;
  userId: string;
}

interface DeedsState {
  deeds: Deed[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: DeedsState = {
  deeds: [],
  status: 'idle',
  error: null,
};

// Create Deed action
export const createDeed = createAsyncThunk(
  'deeds/createDeed',
  async ({ title, description }: { title: string; description: string }, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      const response = await axios.post('http://localhost:3001/deeds', { title, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to create deed');
    }
  }
);

// Fetch Deeds action
export const fetchDeeds = createAsyncThunk(
  'deeds/fetchDeeds',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      const response = await axios.get('http://localhost:3001/deeds', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to fetch deeds');
    }
  }
);

// Update Deed action
export const updateDeed = createAsyncThunk(
  'deeds/updateDeed',
  async ({ deedId, title, description }: { deedId: string; title: string; description: string }, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      const response = await axios.put(`http://localhost:3001/deeds/${deedId}`, { title, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue('Failed to update deed');
    }
  }
);

// Delete Deed action
export const deleteDeed = createAsyncThunk(
  'deeds/deleteDeed',
  async (deedId: string, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const { token } = state.user;

    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      await axios.delete(`http://localhost:3001/deeds/${deedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return deedId;
    } catch (err) {
      return rejectWithValue('Failed to delete deed');
    }
  }
);

const deedsSlice = createSlice({
  name: 'deeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDeed.fulfilled, (state, action: PayloadAction<Deed>) => {
        state.deeds.push(action.payload);
        state.status = 'idle';
      })
      .addCase(createDeed.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchDeeds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeeds.fulfilled, (state, action: PayloadAction<Deed[]>) => {
        state.deeds = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchDeeds.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateDeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDeed.fulfilled, (state, action: PayloadAction<Deed>) => {
        const index = state.deeds.findIndex(deed => deed.deedId === action.payload.deedId);
        if (index >= 0) {
          state.deeds[index] = action.payload;
        }
        state.status = 'idle';
      })
      .addCase(updateDeed.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteDeed.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDeed.fulfilled, (state, action: PayloadAction<string>) => {
        state.deeds = state.deeds.filter(deed => deed.deedId !== action.payload);
        state.status = 'idle';
      })
      .addCase(deleteDeed.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default deedsSlice.reducer;
