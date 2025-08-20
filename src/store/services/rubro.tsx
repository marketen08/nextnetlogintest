import { api } from './api';

// ** Types imports

const url = '/rubro';

export const rubroAPI = api.injectEndpoints({
    endpoints: (build) => ({
        getRubros: build.query({
            query: () => ({
                url,
                method: 'GET'
            })
        }),
        addRubro: build.mutation({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
        }),
        updateRubro: build.mutation({
            query: ({ id, ...body }) => ({
                url: `${url}/${id}`,
                method: 'PUT',
                body
            }),
        }),
        deleteRubro: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${url}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const { useGetRubrosQuery, useAddRubroMutation, useUpdateRubroMutation, useDeleteRubroMutation } = rubroAPI