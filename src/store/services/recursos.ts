import { api } from './api';
import { Recurso, RecursoRequest, RecursosPagedResponse, RecursosListResponse } from '../types/recurso';

export const recursosAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getRecursosList: build.query<RecursosListResponse, { page?: number; pageSize?: number; nombre?: string }>({
      query: ({ page = 1, pageSize = 20, nombre }) => ({
        url: `/recursos/list`,
        method: 'GET',
        params: {
          page,
          pageSize,
          nombre
        }
      }),
      providesTags: ['Recursos']
    }),
    getRecursosPaged: build.query<RecursosPagedResponse, { page?: number; pageSize?: number; nombre?: string }>({
      query: ({ page = 1, pageSize = 20, nombre }) => ({
        url: `/recursos/paged`,
        method: 'GET',
        params: {
          page,
          pageSize,
          nombre
        }
      }),
      providesTags: ['Recursos']
    }),
    getRecursoById: build.query<Recurso, string>({
      query: (id) => ({
        url: `/recursos/${id}`,
        method: 'GET'
      }),
      providesTags: ['Recursos']
    }),
    createRecurso: build.mutation<Recurso, RecursoRequest>({
      query: (body) => ({
        url: '/recursos/create',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Recursos']
    }),
    updateRecurso: build.mutation<Recurso, { id: string; data: Partial<RecursoRequest> }>({
      query: ({ id, data }) => ({
        url: `/recursos/update/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Recursos']
    }),
    deleteRecurso: build.mutation<void, string>({
      query: (id) => ({
        url: `/recursos/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Recursos']
    })
  })
});

export const {
  useGetRecursosListQuery,
  useLazyGetRecursosListQuery,
  useGetRecursosPagedQuery,
  useLazyGetRecursosPagedQuery,
  useGetRecursoByIdQuery,
  useLazyGetRecursoByIdQuery,
  useCreateRecursoMutation,
  useUpdateRecursoMutation,
  useDeleteRecursoMutation
} = recursosAPI;
