import { api } from './api';

// ** Types imports
import { CliProDTO, TipoType } from '@/store/types/cliPro';

const url = '/clipro';

export const cliProAPI = api.injectEndpoints({
    endpoints: (build) => ({
        getCliPro: build.query<CliProDTO, { tipo: TipoType }>({
            query: ({ tipo }: { tipo: TipoType }) => ({
                url,
                method: 'GET',
                params: {
                    tipo
                }
            })
        }),
        addCliPro: build.mutation({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
        }),
        updateCliPro: build.mutation({
            query: ({id, ...body }) => ({
                url: `${url}/${id}`,
                method: 'PUT',
                body
            }),
        }),
        deleteCliPro: build.mutation <void, number>({
            query: (id: number) => ({
                url: `${url}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const { useGetCliProQuery, useLazyGetCliProQuery, useAddCliProMutation, useUpdateCliProMutation, useDeleteCliProMutation } = cliProAPI