import { api } from './api';

// ** Types imports
import { Usuario, UsuariosDTO, UsuarioType } from '@/screens/usuarios/types';

const url = '/usuario';

export const usuarioAPI = api.injectEndpoints({
    endpoints: (build) => ({
        getUsuarios: build.query<UsuariosDTO, { role: UsuarioType }>({
            query: ({ role }: { role: UsuarioType }) => ({
                url,
                method: 'GET',
                params: {
                    role
                }
            }),
            transformResponse: (response: UsuariosDTO) => {
                const data: Usuario[] = response?.data?.map((usuario: Usuario) => ({
                    ...usuario,
                    nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
                })) ?? [];

                response.data = data;

                return response;
            },
        }),
        addUsuario: build.mutation({
            query: (body) => ({
                url,
                method: 'POST',
                body
            }),
        }),
        updateUsuario: build.mutation({
            query: ({ id, ...body }) => ({
                url: `${url}/${id}`,
                method: 'PUT',
                body
            }),
        }),
        deleteUsuario: build.mutation<void, number>({
            query: (id: number) => ({
                url: `${url}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const { useLazyGetUsuariosQuery, useAddUsuarioMutation, useUpdateUsuarioMutation, useDeleteUsuarioMutation } = usuarioAPI