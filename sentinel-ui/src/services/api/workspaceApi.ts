import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface Workspace {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  openAiTemp: number | null;
  lastUpdatedAt: string;
  openAiHistory: number;
  openAiPrompt: string | null;
  threads?: any[];
  documents?: any[];
}

interface WorkspaceResponse {
  workspace: Workspace;
  message?: string;
}

interface WorkspacesListResponse {
  workspaces: Workspace[];
}

interface ChatHistory {
  role: string;
  content: string;
  sentAt: number;
  sources?: { source: string }[];
}

interface StreamChatResponse {
  id: string;
  type: 'abort' | 'textResponseChunk';
  textResponse: string;
  sources?: { title: string; chunk: string }[];
  close: boolean;
  error?: string;
}

// API Service
export const workspaceApi = createApi({
  reducerPath: 'workspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['Workspace'],
  endpoints: (builder) => ({
    // Create a new workspace
    createWorkspace: builder.mutation<WorkspaceResponse, { name: string }>({
      query: (body) => ({
        url: '/workspace/new',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Workspace'],
    }),

    // List all workspaces
    getWorkspaces: builder.query<WorkspacesListResponse, void>({
      query: () => '/workspaces',
      providesTags: ['Workspace'],
    }),

    // Get a workspace by its slug
    getWorkspaceBySlug: builder.query<WorkspaceResponse, string>({
      query: (slug) => `/workspace/${slug}`,
      providesTags: ['Workspace'],
    }),

    // Delete a workspace by its slug
    deleteWorkspace: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/workspace/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Workspace'],
    }),

    // Update a workspace by its slug
    updateWorkspace: builder.mutation<WorkspaceResponse, { slug: string; updates: Partial<Workspace> }>({
      query: ({ slug, updates }) => ({
        url: `/workspace/${slug}/update`,
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: ['Workspace'],
    }),

    // Get chats of a workspace
    getWorkspaceChats: builder.query<ChatHistory[], string>({
      query: (slug) => `/workspace/${slug}/chats`,
    }),

    // Add or remove documents from workspace
    updateWorkspaceEmbeddings: builder.mutation<WorkspaceResponse, { slug: string; adds: string[]; deletes: string[] }>({
      query: ({ slug, adds, deletes }) => ({
        url: `/workspace/${slug}/update-embeddings`,
        method: 'POST',
        body: { adds, deletes },
      }),
      invalidatesTags: ['Workspace'],
    }),

    // Add or remove pin from document in workspace
    updatePinStatus: builder.mutation<{ message: string }, { slug: string; docPath: string; pinStatus: boolean }>({
      query: ({ slug, docPath, pinStatus }) => ({
        url: `/workspace/${slug}/update-pin`,
        method: 'POST',
        body: { docPath, pinStatus },
      }),
    }),

    // Execute a chat with a workspace
    executeChat: builder.mutation<any, { slug: string; message: string; mode: 'query' | 'chat'; sessionId: string }>({
      query: ({ slug, message, mode, sessionId }) => ({
        url: `/workspace/${slug}/chat`,
        method: 'POST',
        body: { message, mode, sessionId },
      }),
    }),

    // Execute a streamable chat with a workspace
    executeStreamChat: builder.mutation<StreamChatResponse[], { slug: string; message: string; mode: 'query' | 'chat'; sessionId: string }>({
      query: ({ slug, message, mode, sessionId }) => ({
        url: `/workspace/${slug}/stream-chat`,
        method: 'POST',
        body: { message, mode, sessionId },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreateWorkspaceMutation,
  useGetWorkspacesQuery,
  useGetWorkspaceBySlugQuery,
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useGetWorkspaceChatsQuery,
  useUpdateWorkspaceEmbeddingsMutation,
  useUpdatePinStatusMutation,
  useExecuteChatMutation,
  useExecuteStreamChatMutation,
} = workspaceApi;
