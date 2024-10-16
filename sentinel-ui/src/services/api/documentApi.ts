import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types
interface Document {
  location: string;
  name: string;
  url: string;
  title: string;
  docAuthor: string;
  description: string;
  docSource: string;
  chunkSource: string;
  published: string;
  wordCount: number;
  token_count_estimate: number;
}

interface DocumentResponse {
  success: boolean;
  error: string | null;
  documents: Document[];
}

interface FileTypesResponse {
  types: Record<string, string[]>;
}

interface MetadataSchemaResponse {
  schema: Record<string, string>;
}

interface DocumentsListResponse {
  localFiles: {
    name: string;
    type: string;
    items: {
      name: string;
      type: string;
      id: string;
      url: string;
      title: string;
      cached: boolean;
    }[];
  };
}

// API Service
export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/v1',
  }),
  tagTypes: ['Documents'],
  endpoints: (builder) => ({
    // Upload a new file
    uploadFile: builder.mutation<DocumentResponse, FormData>({
      query: (body) => ({
        url: '/document/upload',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),

    // Upload a URL for scraping
    uploadUrl: builder.mutation<DocumentResponse, { link: string }>({
      query: (body) => ({
        url: '/document/upload-link',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),

    // Upload raw text with metadata
    uploadRawText: builder.mutation<DocumentResponse, { textContent: string; metadata: Record<string, string> }>({
      query: (body) => ({
        url: '/document/raw-text',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),

    // List all stored documents
    getDocuments: builder.query<DocumentsListResponse, void>({
      query: () => '/documents',
      providesTags: ['Documents'],
    }),

    // Get a single document by its unique name
    getDocumentByName: builder.query<DocumentsListResponse, string>({
      query: (docName) => `/document/${docName}`,
      providesTags: ['Documents'],
    }),

    // Get accepted file types for upload
    getAcceptedFileTypes: builder.query<FileTypesResponse, void>({
      query: () => '/document/accepted-file-types',
    }),

    // Get metadata schema for raw-text upload
    getMetadataSchema: builder.query<MetadataSchemaResponse, void>({
      query: () => '/document/metadata-schema',
    }),

    // Create a folder in the document storage directory
    createFolder: builder.mutation<{ success: boolean; message: string | null }, { name: string }>({
      query: (body) => ({
        url: '/document/create-folder',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),

    // Move files within the document storage directory
    moveFiles: builder.mutation<{ success: boolean; message: string | null }, { files: { from: string; to: string }[] }>({
      query: (body) => ({
        url: '/document/move-files',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useUploadFileMutation,
  useUploadUrlMutation,
  useUploadRawTextMutation,
  useGetDocumentsQuery,
  useGetDocumentByNameQuery,
  useGetAcceptedFileTypesQuery,
  useGetMetadataSchemaQuery,
  useCreateFolderMutation,
  useMoveFilesMutation,
} = documentApi;
