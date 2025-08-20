import { api } from './api';

// ** Types imports
import { Cubierta, CubiertaAssignDTO, CubiertasDTO } from '@/store/types/cubierta';

const url = '/cubierta';

const apiWithTag = api.enhanceEndpoints({
    addTagTypes: ['Cubiertas']
})

export const cubiertaAPI = apiWithTag.injectEndpoints({
    endpoints: (build) => ({
        getCubiertas: build.query<CubiertasDTO, void>({
            query: () => ({
                url,
                method: 'GET'
            }),
            providesTags: () => [{ type: 'Cubiertas' }]
        }),
        getCubiertasDisponibles: build.query<CubiertasDTO, void>({
            query: () => ({
                url,
                method: 'GET',
                params: { disponible: true }
            })
        }),
        addCubierta: build.mutation<Cubierta, Cubierta>({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
            invalidatesTags: () => [{ type: 'Cubiertas' }]
        }),
        updateCubierta: build.mutation<Cubierta, Cubierta>({
            query: ({ id, ...body }) => ({
                url: `${url}/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: () => [{ type: 'Cubiertas' }]
        }),
        deleteCubierta: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${url}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'Cubiertas' }]
        }),
        assignCubiertas: build.mutation<void, CubiertaAssignDTO>({
            query: (body) => ({
                url: `${url}/assign`,
                method: 'PUT',
                body
            }),
        })
    }),
})

export const {
    useGetCubiertasQuery,
    useLazyGetCubiertasQuery,
    useAddCubiertaMutation,
    useDeleteCubiertaMutation,
    useUpdateCubiertaMutation,
    useLazyGetCubiertasDisponiblesQuery,
    useAssignCubiertasMutation
} = cubiertaAPI