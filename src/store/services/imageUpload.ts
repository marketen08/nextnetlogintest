import { api } from './api';

export interface UploadImageResponse {
  success: boolean;
  message: string;
  data: {
    imageUrl: string;
    fileName: string;
    fileSize: number;
    message: string;
  };
}

export interface UploadBase64Request {
  base64Image: string;
  fileName: string;
  colaboradorId?: string;
}

// Servicio de upload de imágenes para colaboradores
export const imageUploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Upload de imagen con FormData
    uploadColaboradorImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: '/colaboradores/upload-image',
        method: 'POST',
        body: formData,
        headers: {
          // Remover Content-Type para que el browser lo maneje automáticamente
        },
      }),
      invalidatesTags: ['Colaboradores'],
    }),

    // Upload de imagen Base64
    uploadColaboradorImageBase64: builder.mutation<UploadImageResponse, UploadBase64Request>({
      query: (data) => ({
        url: '/colaboradores/upload-image-base64',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Colaboradores'],
    }),

    // Upload de mi imagen personal (usuario autenticado)
    uploadMyImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: '/colaboradores/upload-my-image',
        method: 'POST',
        body: formData,
        headers: {
          // Remover Content-Type para que el browser lo maneje automáticamente
        },
      }),
      invalidatesTags: ['Colaboradores', 'Profile'],
    }),
  }),
});

export const {
  useUploadColaboradorImageMutation,
  useUploadColaboradorImageBase64Mutation,
  useUploadMyImageMutation,
} = imageUploadApi;