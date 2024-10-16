import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface Model {
  name: string;
  model: string;
  llm: {
    provider: string;
    model: string;
  };
}

interface ModelsResponse {
  models: Model[];
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  stream?: boolean;
  temperature?: number;
}

interface EmbeddingRequest {
  input: string[];
  model?: string | null;
}

interface EmbeddingResponse {
  vectors: number[][];
  metadata: string[];
}

interface VectorStore {
  id: string;
  object: string;
  name: string;
  file_counts: {
    total: number;
  };
  provider: string;
}

interface VectorStoresResponse {
  data: VectorStore[];
}

// API Service
export const openAIApi = createApi({
  reducerPath: 'openAIApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['OpenAI'],
  endpoints: (builder) => ({
    // Get all available models (workspaces)
    getModels: builder.query<ModelsResponse, void>({
      query: () => '/openai/models',
      providesTags: ['OpenAI'],
    }),

    // Execute a chat with a workspace
    executeChatCompletion: builder.mutation<void, ChatCompletionRequest>({
      query: (body) => ({
        url: '/openai/chat/completions',
        method: 'POST',
        body,
      }),
    }),

    // Get embeddings for arbitrary text strings
    getEmbeddings: builder.mutation<EmbeddingResponse, EmbeddingRequest>({
      query: (body) => ({
        url: '/openai/embeddings',
        method: 'POST',
        body,
      }),
    }),

    // List all vector stores (workspaces with vector DB identifiers)
    getVectorStores: builder.query<VectorStoresResponse, void>({
      query: () => '/openai/vector_stores',
      providesTags: ['OpenAI'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetModelsQuery,
  useExecuteChatCompletionMutation,
  useGetEmbeddingsMutation,
  useGetVectorStoresQuery,
} = openAIApi;
