import { api } from './api';

// ** Types imports
import { VehiculoDTO, VehiculosDTO, VehiculoType } from '@/screens/vehiculos/types';

const url = '/vehiculo';

export const vehiculoAPI = api.injectEndpoints({
    endpoints: (build) => ({
        getVehiculos: build.query<VehiculosDTO, { tipo: VehiculoType }>({
            query: ({ tipo }: { tipo: VehiculoType }) => ({
                url,
                method: 'GET',
                params: {
                    tipo
                }
            })
        }),
        getVehiculo: build.query<VehiculoDTO, string>({
            query: (id: string) => ({
                url: `${url}/${id}`,
                method: 'GET'
            })
        }),
        addVehiculo: build.mutation({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
        }),
        updateVehiculo: build.mutation({
            query: ({ id, ...body }) => ({
                url: `${url}/${id}`,
                method: 'PUT',
                body
            }),
        }),
        deleteVehiculo: build.mutation<void, string>({
            query: (id: string) => ({
                url: `${url}/${id}`,
                method: 'DELETE',
            }),
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getVehiculosAvailable: build.query<any, void>({
            query: () => ({
                url: `${url}/available`,
                method: 'GET'
            })
        }),
    }),
})

export const { useAddVehiculoMutation, useDeleteVehiculoMutation, useUpdateVehiculoMutation, useLazyGetVehiculosQuery,
    useLazyGetVehiculosAvailableQuery, useLazyGetVehiculoQuery } = vehiculoAPI