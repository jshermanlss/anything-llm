import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface Thread {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ThreadResponse {
  thread: Thread;
  message?: string;
}

interface ThreadsListResponse {
  threads: Thread[];
}

interface CreateThreadRequest {
  title: string;
  content: string;
}

interface UpdateThreadRequest {
  title?: string;
  content?: string;
}

interface DeleteThreadResponse {
  success: boolean;
  message: string;
}

// API Service
export const threadApi = createApi({
  reducerPath: 'threadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['Thread'],
  endpoints: (builder) => ({
    // Create a new thread
    createThread: builder.mutation<ThreadResponse, CreateThreadRequest>({
      query: (body) => ({
        url: '/threads',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Thread'],
    }),

    // Get all threads
    getThreads: builder.query<ThreadsListResponse, void>({
      query: () => '/threads',
      providesTags: ['Thread'],
    }),

    // Get a thread by ID
    getThreadById: builder.query<ThreadResponse, string>({
      query: (id) => `/threads/${id}`,
      providesTags: ['Thread'],
    }),

    // Update a thread by ID
    updateThread: builder.mutation<ThreadResponse, { id: string; updates: UpdateThreadRequest }>({
      query: ({ id, updates }) => ({
        url: `/threads/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['Thread'],
    }),

    // Delete a thread by ID
    deleteThread: builder.mutation<DeleteThreadResponse, string>({
      query: (id) => ({
        url: `/threads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Thread'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateThreadMutation,
  useGetThreadsQuery,
  useGetThreadByIdQuery,
  useUpdateThreadMutation,
  useDeleteThreadMutation,
} = threadApi;
