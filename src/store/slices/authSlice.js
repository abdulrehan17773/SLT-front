import { createSlice } from "@reduxjs/toolkit";

const getAuthFromLocalStorage = () => {
  const storedAuth = localStorage.getItem("auth");
  if (storedAuth) {
    try {
      return JSON.parse(storedAuth);
    } catch (error) {
      return { status: false, userData: null }; 
    }
  }
  return { status: false, userData: null };
};

const initialState = getAuthFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.status = true;
      state.userData = action.payload.userData;
      localStorage.setItem("auth", JSON.stringify(state)); // Store in localStorage
    },
    logout(state) {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("auth"); // Remove from localStorage on logout
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;