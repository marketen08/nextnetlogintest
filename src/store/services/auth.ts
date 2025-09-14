import { api } from './api';

// ** Tipos para usuarios del sistema
interface Usuario {
    id: string;
    email: string;
    userName: string;
    nombre: string | null;
    apellido: string | null;
    profileImageUrl: string | null;
    proyectoId: string | null;
    clienteId: string | null;
    sociedadId: string | null;
    terminalId: string | null;
    color: string | null;
}

interface UsuariosPagedResponse {
    data: Usuario[];
    total: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
}

export const authAPI = api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: ({ email, password }) => ({
                url: '/auth/login',
                method: 'POST',
                body: {
                    email,
                    password
                }
            }),
        }),
        register: build.mutation({
            query: ({ email, password }) => ({
                url: '/auth/register',
                method: 'POST',
                body: {
                    email,
                    password
                }
            }),
        }),
        loginGoogle: build.mutation({
            query: (body) => ({
                url: '/auth/google',
                method: 'POST',
                body
            }),
        }),
        loginMicrosoft: build.mutation({
            query: (body) => ({
                url: '/auth/microsoft',
                method: 'POST',
                body
            }),
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getUsers: build.query<any[], void>({
            query: () => ({
                url: '/auth/users',
                method: 'GET'
            })
        }),
        getUsersPaged: build.query<UsuariosPagedResponse, void>({
            query: () => ({
                url: '/auth/paged',
                method: 'GET'
            })
        }),
    }),
})

export const { useLoginMutation, useLoginGoogleMutation, useLoginMicrosoftMutation, useRegisterMutation, useGetUsersQuery, useGetUsersPagedQuery } = authAPI