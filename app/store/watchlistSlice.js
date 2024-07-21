import { createSlice } from '@reduxjs/toolkit';

// Load watchlist from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('watchlist');
    if (serializedState === null) {
      return { watchlist: [], theme: 'light' };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { watchlist: [], theme: 'light' };
  }
};

const initialState = loadState();

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('watchlist', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addCoin: (state, action) => {
      const coinExists = state.watchlist.some(coin => coin.id === action.payload.id);
      if (!coinExists) {
        state.watchlist.push(action.payload);
        saveState(state); // Save the state to localStorage
      }
    },
    removeCoin: (state, action) => {
      const newWatchlist = state.watchlist.filter(coin => coin.id !== action.payload);
      state.watchlist = newWatchlist;
      saveState(state); // Save the state to localStorage
    },
    setWatchlist: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.watchlist = action.payload;
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      saveState(state); // Save the state to localStorage
    }
  },
});

export const { addCoin, removeCoin, setWatchlist, toggleTheme } = watchlistSlice.actions;

export default watchlistSlice.reducer;
