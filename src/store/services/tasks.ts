import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task, TaskSummary, DeveloperTaskSummary, ProjectTaskSummary, CreateTaskRequest, UpdateTaskRequest, CompleteTaskRequest, TaskStatus } from '../types/task';

// Usamos las API routes de Next.js para tareas
const API_BASE_URL = '/api';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/tasks`,
    prepareHeaders: (headers, { getState }) => {
      // Agregar token si existe
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Task', 'TaskStats'],
  endpoints: (builder) => ({
    // Obtener todas las tareas con filtros opcionales
    getTasks: builder.query<{
      success: boolean;
      data: Task[];
      total: number;
      message?: string;
    }, {
      desarrollador?: string;
      proyecto?: string;
      estado?: TaskStatus;
      fechaInicio?: string;
      fechaFin?: string;
    }>({
      query: (params = {}) => ({
        url: '',
        method: 'GET',
        params,
      }),
      providesTags: ['Task'],
    }),

    // Obtener tarea por ID
    getTaskById: builder.query<{
      success: boolean;
      data: Task;
      message?: string;
    }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    // Crear nueva tarea
    addTask: builder.mutation<{
      success: boolean;
      data: Task;
      message?: string;
    }, CreateTaskRequest>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task', 'TaskStats'],
    }),

    // Actualizar tarea
    updateTask: builder.mutation<{
      success: boolean;
      data: Task;
      message?: string;
    }, UpdateTaskRequest>({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Task', 'TaskStats'],
    }),

    // Completar tarea (helper para marcar como completada con datos adicionales)
    completeTask: builder.mutation<{
      success: boolean;
      data: Task;
      message?: string;
    }, CompleteTaskRequest>({
      query: ({ id, horasTrabajadas, satisfaccionEquipo, comentarios }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: {
          estado: 'DONE',
          horasTrabajadas,
          satisfaccionEquipo,
          comentarios,
        },
      }),
      invalidatesTags: ['Task', 'TaskStats'],
    }),

    // Eliminar tarea
    deleteTask: builder.mutation<{
      success: boolean;
      message?: string;
    }, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task', 'TaskStats'],
    }),

    // Obtener estadísticas de tareas
    getTaskStats: builder.query<{
      success: boolean;
      data: {
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
        avgHorasTrabajadas: number;
        avgSatisfaccion: number;
        desarrolladores: number;
        completionRate: number;
      };
      message?: string;
    }, void>({
      query: () => ({
        url: '/stats',
        method: 'GET',
      }),
      providesTags: ['TaskStats'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useCompleteTaskMutation,
  useDeleteTaskMutation,
  useGetTaskStatsQuery,
  useLazyGetTasksQuery,
} = taskApi;
