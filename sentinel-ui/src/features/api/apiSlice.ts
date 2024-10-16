// src/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api', // Optional, defaults to 'api'
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Adjust base URL as needed
  endpoints: (builder) => ({
    // Define endpoints here; will be filled with OpenAPI definitions later
  }),
});

// export const { useGetQuery, useLazyGetQuery } = apiSlice;
