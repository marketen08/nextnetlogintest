import { api } from './api';
import { 
  Role, 
  RolesResponse, 
  UserWithRoles, 
  AssignRoleRequest, 
  RemoveRoleRequest, 
  CreateRoleRequest,
  CreateRoleResponse,
  AssignRoleResponse,
  RemoveRoleResponse
} from '../types/roles';

export const rolesAPI = api.injectEndpoints({
  endpoints: (build) => ({
    // Obtener todos los roles
    getRoles: build.query<RolesResponse, void>({
      query: () => ({
        url: '/auth/roles',
        method: 'GET'
      }),
      providesTags: ['Roles']
    }),

    // Obtener roles de un usuario específico
    getUserRoles: build.query<UserWithRoles, string>({
      query: (userId) => ({
        url: `/auth/users/${userId}/roles`,
        method: 'GET'
      }),
      providesTags: (result, error, userId) => [
        { type: 'UserRoles', id: userId },
        'Roles'
      ]
    }),

    // Asignar rol a usuario
    assignRole: build.mutation<AssignRoleResponse, AssignRoleRequest>({
      query: (body) => ({
        url: '/auth/users/assign-role',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserRoles', id: userId },
        'Roles'
      ]
    }),

    // Remover rol de usuario
    removeRole: build.mutation<RemoveRoleResponse, RemoveRoleRequest>({
      query: (body) => ({
        url: '/auth/users/remove-role',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserRoles', id: userId },
        'Roles'
      ]
    }),

    // Crear nuevo rol
    createRole: build.mutation<CreateRoleResponse, CreateRoleRequest>({
      query: (body) => ({
        url: '/auth/roles/create',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Roles']
    })
  })
});

export const {
  useGetRolesQuery,
  useLazyGetRolesQuery,
  useGetUserRolesQuery,
  useLazyGetUserRolesQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useCreateRoleMutation
} = rolesAPI;