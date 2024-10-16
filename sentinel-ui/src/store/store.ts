// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

// Import the RTK Query API slice (to be created)
import { workspaceApi } from '../services/api/workspaceApi';
import { systemApi } from "../services/api/systemApi.ts";
import { threadApi } from "../services/api/threadApi.ts";
import { openAIApi } from "../services/api/openAiApi.ts";
import { embedApi } from "../services/api/embedApi.ts";
import { usersApi } from "../services/api/usersApi.ts";
import { documentApi } from "../services/api/documentApi.ts";
import { adminApi } from "../services/api/adminApi.ts";

export const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [systemApi.reducerPath]: systemApi.reducer,
    [threadApi.reducerPath]: threadApi.reducer,
    [openAIApi.reducerPath]: openAIApi.reducer,
    [embedApi.reducerPath]: embedApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      workspaceApi.middleware,
      systemApi.middleware,
      threadApi.middleware,
      openAIApi.middleware,
      embedApi.middleware,
      usersApi.middleware,
      documentApi.middleware,
      adminApi.middleware,
    ),
});

// Optional: Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
