import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { baseApi } from "@/services/baseApi";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
