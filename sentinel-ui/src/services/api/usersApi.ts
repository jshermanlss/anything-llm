import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface User {
  id: number;
  username: string;
  role: string;
}

interface UsersResponse {
  users: User[];
}

// API Service
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // List all users
    getUsers: builder.query<UsersResponse, void>({
      query: () => '/users',
      providesTags: ['Users'],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetUsersQuery } = usersApi;
