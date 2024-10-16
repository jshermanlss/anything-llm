import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface SystemSettings {
  [key: string]: string | boolean;
}

interface VectorCountResponse {
  vectorCount: number;
}

interface UpdateEnvResponse {
  newValues: { [key: string]: string };
  error: string | null;
}

interface RemoveDocumentsResponse {
  success: boolean;
  message: string;
}

interface ExportChatsResponse {
  role: string;
  content: string;
}

// API Service
export const systemApi = createApi({
  reducerPath: 'systemApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['System'],
  endpoints: (builder) => ({
    // Dump all settings to file storage
    dumpEnv: builder.query<void, void>({
      query: () => '/system/env-dump',
    }),

    // Get all current system settings
    getSystemSettings: builder.query<{ settings: SystemSettings }, void>({
      query: () => '/system',
    }),

    // Get vector count from the connected vector database
    getVectorCount: builder.query<VectorCountResponse, void>({
      query: () => '/system/vector-count',
    }),

    // Update a system setting or preference
    updateSystemEnv: builder.mutation<UpdateEnvResponse, { [key: string]: string }>({
      query: (envUpdate) => ({
        url: '/system/update-env',
        method: 'POST',
        body: envUpdate,
      }),
    }),

    // Export chats from the system
    exportChats: builder.query<ExportChatsResponse[], { type?: string }>({
      query: (params) => ({
        url: '/system/export-chats',
        params,
      }),
    }),

    // Remove documents from the system
    removeDocuments: builder.mutation<RemoveDocumentsResponse, { names: string[] }>({
      query: (body) => ({
        url: '/system/remove-documents',
        method: 'DELETE',
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useDumpEnvQuery,
  useGetSystemSettingsQuery,
  useGetVectorCountQuery,
  useUpdateSystemEnvMutation,
  useExportChatsQuery,
  useRemoveDocumentsMutation,
} = systemApi;
