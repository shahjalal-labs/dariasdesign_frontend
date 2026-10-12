import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminAuth from "./ReduxFunction";
import bookingReducer from "./bookingSlice";

import baseApi from "./api/baseApi";

// 🔐 Persist configuration for authentication
const authPersistConfig = {
  key: "auth",
  storage,
};

const bookingPersistConfig = {
  key: "booking",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, adminAuth);
const persistedBookingReducer = persistReducer(
  bookingPersistConfig,
  bookingReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    booking: persistedBookingReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// ⚡ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
