import { api } from './api';

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getUsers: build.query<any[], void>({
            query: () => ({
                url: '/auth/users',
                method: 'GET'
            })
        })
    }),
})

export const { useLoginMutation, useLoginGoogleMutation, useRegisterMutation, useGetUsersQuery } = authAPI