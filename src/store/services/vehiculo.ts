import { api } from './api';

// ** Tipos temporales para vehículos
interface VehiculoDTO {
    id: number;
    marca: string;
    modelo: string;
    tipo: VehiculoType;
    [key: string]: any;
}

interface VehiculosDTO {
    data: VehiculoDTO[];
    success: boolean;
    message?: string;
}

type VehiculoType = 'auto' | 'camion' | 'moto';

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