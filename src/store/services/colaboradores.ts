import { api } from './api';
import { Colaborador, ColaboradorRequest, ColaboradoresPagedResponse, ColaboradoresListResponse } from '../types/colaborador';

export const colaboradoresAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getColaboradoresList: build.query<ColaboradoresListResponse, { page?: number; pageSize?: number; nombre?: string }>({
      query: ({ page = 1, pageSize = 20, nombre }) => ({
        url: `/colaboradores/list`,
        method: 'GET',
        params: {
          page,
          pageSize,
          nombre
        }
      }),
      providesTags: ['Colaboradores']
    }),
    getColaboradoresPaged: build.query<ColaboradoresPagedResponse, { page?: number; pageSize?: number; nombre?: string }>({
      query: ({ page = 1, pageSize = 20, nombre }) => ({
        url: `/colaboradores/paged`,
        method: 'GET',
        params: {
          page,
          pageSize,
          nombre
        }
      }),
      providesTags: ['Colaboradores']
    }),
    getColaboradorById: build.query<Colaborador, string>({
      query: (id) => ({
        url: `/colaboradores/${id}`,
        method: 'GET'
      }),
      providesTags: ['Colaboradores']
    }),
    createColaborador: build.mutation<Colaborador, ColaboradorRequest>({
      query: (body) => ({
        url: '/colaboradores/create',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Colaboradores']
    }),
    updateColaborador: build.mutation<Colaborador, { id: string; data: Partial<ColaboradorRequest> }>({
      query: ({ id, data }) => ({
        url: `/colaboradores/update/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Colaboradores']
    }),
    deleteColaborador: build.mutation<void, string>({
      query: (id) => ({
        url: `/colaboradores/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Colaboradores']
    })
  })
});

export const {
  useGetColaboradoresListQuery,
  useLazyGetColaboradoresListQuery,
  useGetColaboradoresPagedQuery,
  useLazyGetColaboradoresPagedQuery,
  useGetColaboradorByIdQuery,
  useLazyGetColaboradorByIdQuery,
  useCreateColaboradorMutation,
  useUpdateColaboradorMutation,
  useDeleteColaboradorMutation
} = colaboradoresAPI;