import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface AuthResponse {
  authenticated: boolean;
}

interface MultiUserModeResponse {
  isMultiUser: boolean;
}

interface User {
  username: string;
  role: string;
}

interface UsersResponse {
  users: User[];
}

interface NewUserRequest {
  username: string;
  password: string;
  role: 'default' | 'admin';
}

interface NewUserResponse {
  user: User;
  error: string | null;
}

interface SuccessResponse {
  success: boolean;
  error: string | null;
}

interface Invite {
  id: number;
  status: string;
  code: string;
  claimedBy?: string | null;
}

interface InvitesResponse {
  invites: Invite[];
}

interface WorkspaceUser {
  userId: number;
  role: 'admin' | 'member';
}

interface WorkspaceUsersResponse {
  users: WorkspaceUser[];
}

// API Service
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    // Verify Authentication
    verifyAuth: builder.query<AuthResponse, void>({
      query: () => '/auth',
    }),

    // Check if multi-user mode is enabled
    isMultiUserMode: builder.query<MultiUserModeResponse, void>({
      query: () => '/admin/is-multi-user-mode',
    }),

    // List all users
    getUsers: builder.query<UsersResponse, void>({
      query: () => '/admin/users',
      providesTags: ['Admin'],
    }),

    // Create a new user
    createUser: builder.mutation<NewUserResponse, NewUserRequest>({
      query: (body) => ({
        url: '/admin/users/new',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admin'],
    }),

    // Update an existing user by ID
    updateUser: builder.mutation<SuccessResponse, { id: string; updates: Partial<NewUserRequest> }>({
      query: ({ id, updates }) => ({
        url: `/admin/users/${id}`,
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: ['Admin'],
    }),

    // Delete a user by ID
    deleteUser: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),

    // List all invites
    getInvites: builder.query<InvitesResponse, void>({
      query: () => '/admin/invites',
    }),

    // Create a new invite
    createInvite: builder.mutation<SuccessResponse, { workspaceIds: number[] }>({
      query: (body) => ({
        url: '/admin/invite/new',
        method: 'POST',
        body,
      }),
    }),

    // Deactivate an invite by ID
    deleteInvite: builder.mutation<SuccessResponse, string>({
      query: (id) => ({
        url: `/admin/invite/${id}`,
        method: 'DELETE',
      }),
    }),

    // Retrieve a list of users with permissions to access a workspace
    getWorkspaceUsers: builder.query<WorkspaceUsersResponse, string>({
      query: (workspaceId) => `/admin/workspaces/${workspaceId}/users`,
    }),

    // Update workspace user permissions
    updateWorkspaceUsers: builder.mutation<SuccessResponse, { workspaceId: string; userIds: number[] }>({
      query: ({ workspaceId, userIds }) => ({
        url: `/admin/workspaces/${workspaceId}/update-users`,
        method: 'POST',
        body: { userIds },
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useVerifyAuthQuery,
  useIsMultiUserModeQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetInvitesQuery,
  useCreateInviteMutation,
  useDeleteInviteMutation,
  useGetWorkspaceUsersQuery,
  useUpdateWorkspaceUsersMutation,
} = adminApi;
