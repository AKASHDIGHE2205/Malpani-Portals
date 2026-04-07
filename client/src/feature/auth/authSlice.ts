import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from 'crypto-js';

const initialState = {
  isAuthenticated: !!sessionStorage.getItem('token'),
  user: sessionStorage.getItem('user'),
  token: sessionStorage.getItem('token'),
}

const secretKey = `Malpani@2025`;

export const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      const { data } = action.payload;
      state.isAuthenticated = !!data.token;
      state.user = data;
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', encryptedData);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      console.clear();
    }
  }
})
export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;