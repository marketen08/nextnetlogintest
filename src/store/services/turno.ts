import { api } from './api';

// ** Types imports
import { TurnoDTO, TurnosDTO } from '@/store/types/turno';

const url = '/turno';

export const turnoAPI = api.injectEndpoints({
    endpoints: (build) => ({
        getTurnos: build.query<TurnosDTO, boolean | void>({
            query: (done?: boolean) => ({
                url,
                method: 'GET',
                params: { done }
            })
        }),
        getTurno: build.query<TurnoDTO, {id: string, include: boolean}>({
            query: ({ id, include }) => ({
                url: `${url}/${id}`,
                method: 'GET',
                params: { include }
            })
        }),
        addTurno: build.mutation({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
        }),
        updateTurno: build.mutation({
            query: ({ id, ...body }) => ({
                url: `${url}/${id}`,
                method: 'PUT',
                body
            }),
        }),
        deleteTurno: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${url}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const { useLazyGetTurnosQuery, useLazyGetTurnoQuery,
    useAddTurnoMutation, useUpdateTurnoMutation, useDeleteTurnoMutation } = turnoAPI