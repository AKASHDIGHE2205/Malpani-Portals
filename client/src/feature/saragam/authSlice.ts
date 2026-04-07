/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

interface auth {
  token: string | null;
  user: any;
  isAuthenticated: boolean;
  tokenExpiry: number | null; // Token expiration time
}

const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in milliseconds


// Utility function to check if the token is expired
export const isTokenExpired = (state: auth) => {
  if (!state.token || !state.tokenExpiry) {
    return true; // No token or no expiry time, consider it expired
  }
  const currentTime = Date.now();
  return currentTime > state.tokenExpiry; // Token is expired if current time is greater than tokenExpiry
};

const initialState: auth = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('userData'),
  isAuthenticated: !!localStorage.getItem('token'),
  tokenExpiry: Number(localStorage.getItem('tokenExpiry')) || null, // Get token expiry time from localStorage
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    storeUserData: (state, action) => {
      const { data } = action.payload;
      console.log(data);

      state.token = data.token;
      state.isAuthenticated = !!data.token;
      state.user = data;

      // Set token expiry to 1 minute from now
      const tokenExpiryTime = Date.now() + ONE_DAY; // Current time + 1 minute

      // Set expiry time in Redux state
      state.tokenExpiry = tokenExpiryTime;

      // Store token and expiry time in localStorage
      localStorage.setItem('userData', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenExpiry', String(tokenExpiryTime)); // Store token expiry time
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;

      // Clear data from localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
    },
  },
});

// Action creators are generated for each case reducer function
export const { storeUserData, logout } = authSlice.actions;

export default authSlice.reducer;
