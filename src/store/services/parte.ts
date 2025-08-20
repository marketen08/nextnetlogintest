import { api } from './api';

// ** Types imports

const url = '/parte';

export const parteAPI = api.injectEndpoints({
    endpoints: (build) => ({
        getPartes: build.query({
            query: () => ({
                url,
                method: 'GET'
            })
        }),
        getParte: build.query<any, number>({
            query: (id: number) => ({
                url: `${url}/${id}`,
                method: 'GET'
            })
        }),
        addParte: build.mutation({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
        }),
        //updateTurno: build.mutation({
        //    query: ({ id, ...body }) => ({
        //        url: `${url}/${id}`,
        //        method: 'PUT',
        //        body
        //    }),
        //}),
        //deleteTurno: build.mutation<void, number>({
        //    query: (id: number) => ({
        //        url: `${url}/${id}`,
        //        method: 'DELETE',
        //    }),
        //}),
    }),
})

export const { useAddParteMutation } = parteAPI