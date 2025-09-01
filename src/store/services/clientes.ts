import { api } from './api';
import { 
  Cliente,
  PagedClientesResponse,
  ClientesQueryParams,
  CreateClienteRequest,
  UpdateClienteRequest
} from '@/store/types/cliPro';

export interface ClienteListParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  activo?: boolean;
}

export const clienteAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // Nuevo endpoint para clientes paginados
    getClientesPaged: build.query<PagedClientesResponse, ClientesQueryParams>({
      query: ({ page = 1, pagesize = 20, search } = {}) => ({
        url: '/clientes/paged',
        method: 'GET',
        params: {
          page,
          pagesize,
          ...(search && { search }),
        },
      }),
      providesTags: ['Cliente'],
    }),

    // Endpoint anterior (mantenido por compatibilidad)
    getClientes: build.query<any, ClienteListParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params && params.pageIndex !== undefined) {
          searchParams.append('pageIndex', params.pageIndex.toString());
        }
        if (params && params.pageSize !== undefined) {
          searchParams.append('pageSize', params.pageSize.toString());
        }
        if (params && params.search) {
          searchParams.append('search', params.search);
        }
        if (params && params.activo !== undefined) {
          searchParams.append('activo', params.activo.toString());
        }

        return {
          url: `/clientes/list${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Cliente'],
    }),

    getClienteById: build.query<Cliente, string>({
      query: (id) => ({
        url: `/clientes/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Cliente', id }],
    }),

    createCliente: build.mutation<Cliente, CreateClienteRequest>({
      query: (body) => ({
        url: '/clientes/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cliente'],
    }),

    updateCliente: build.mutation<Cliente, UpdateClienteRequest>({
      query: ({ id, ...body }) => ({
        url: `/clientes/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Cliente',
        { type: 'Cliente', id }
      ],
    }),

    deleteCliente: build.mutation<void, string>({
      query: (id) => ({
        url: `/clientes/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        'Cliente',
        { type: 'Cliente', id }
      ],
    }),
  }),
});

export const {
  // Nuevo hook para clientes paginados
  useGetClientesPagedQuery,
  useLazyGetClientesPagedQuery,
  
  // Hooks anteriores (mantenidos por compatibilidad)
  useGetClientesQuery,
  useLazyGetClientesQuery,
  useGetClienteByIdQuery,
  useLazyGetClienteByIdQuery,
  useCreateClienteMutation,
  useUpdateClienteMutation,
  useDeleteClienteMutation,
} = clienteAPI;
