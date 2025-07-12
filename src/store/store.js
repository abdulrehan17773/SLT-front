import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../store/slices/authSlice";
import { authApi } from "../apis/authApi";
import { adminApi } from "../apis/adminApi";

const store = configureStore({
    reducer: {
        auth: authSlice,
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(authApi.middleware, adminApi.middleware); 
    },
});

export default store;