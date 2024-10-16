import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface Workspace {
  id: number;
  name: string;
}

interface Embed {
  id: number;
  uuid: string;
  enabled: boolean;
  chat_mode: string;
  createdAt: string;
  workspace: Workspace;
  chat_count: number;
}

interface EmbedResponse {
  embeds: Embed[];
}

interface Chat {
  id: number;
  session_id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

interface ChatResponse {
  chats: Chat[];
}

// API Service
export const embedApi = createApi({
  reducerPath: 'embedApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['Embed'],
  endpoints: (builder) => ({
    // List all active embeds
    getEmbeds: builder.query<EmbedResponse, void>({
      query: () => '/embed',
      providesTags: ['Embed'],
    }),

    // Get all chats for a specific embed
    getChatsByEmbedUuid: builder.query<ChatResponse, string>({
      query: (embedUuid) => `/embed/${embedUuid}/chats`,
    }),

    // Get chats for a specific embed and session
    getChatsBySession: builder.query<ChatResponse, { embedUuid: string; sessionUuid: string }>({
      query: ({ embedUuid, sessionUuid }) => `/embed/${embedUuid}/chats/${sessionUuid}`,
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetEmbedsQuery,
  useGetChatsByEmbedUuidQuery,
  useGetChatsBySessionQuery,
} = embedApi;
