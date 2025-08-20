import { api } from './api';

// ** Types imports

const url = '/prodserv';

export const prodServAPI = api.injectEndpoints({
    endpoints: (build) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getProdServs: build.query<any, string | void>({
            query: (tipo?: string) => ({
                url, 
                method: 'GET',
                params: tipo ? { tipo } : undefined
            })
        }),
        getProdServ: build.query({
            query: (id: number | string) => ({
                url: `${url}/${id}`,
                method: 'GET'
            })
        }),
        addProdServ: build.mutation({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
        }),
        updateProdServ: build.mutation({
            query: ({ id, ...body }) => ({
                url: `${url}/${id}`,
                method: 'PUT',
                body
            }),
        }),
        deleteProdServ: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${url}/${id}`,
                method: 'DELETE',
            }),
        }),
        getMovimientos: build.query({
            query: (producto: string) => ({
                url: `${url}/movements/${producto}`,
                method: 'GET'
            })
        }),
    }),
})

export const {
    useLazyGetProdServQuery,
    useLazyGetProdServsQuery,
    useAddProdServMutation,
    useUpdateProdServMutation,
    useDeleteProdServMutation,
    useLazyGetMovimientosQuery
} = prodServAPI