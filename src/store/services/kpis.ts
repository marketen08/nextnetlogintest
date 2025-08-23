import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KpiMetric, KpiSummary, DeveloperKpi, ProjectKpi } from '../types/kpi';

// Usamos las API routes de Next.js que ya implementamos
const API_BASE_URL = '/api';

export const kpiApi = createApi({
  reducerPath: 'kpiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/kpis`,
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
  tagTypes: ['KpiMetric', 'KpiSummary', 'DeveloperKpi', 'ProjectKpi'],
  endpoints: (builder) => ({
    // Obtener todas las métricas con filtros opcionales
    getKpiMetrics: builder.query<{
      success: boolean;
      data: KpiMetric[];
      message?: string;
    }, {
      desarrollador?: string;
      proyecto?: string;
      fechaInicio?: string;
      fechaFin?: string;
      limit?: number;
    }>({
      query: (params = {}) => ({
        url: '/metrics',
        method: 'GET',
        params,
      }),
      providesTags: ['KpiMetric'],
    }),

    // Obtener resumen de KPIs
    getKpiSummary: builder.query<{
      success: boolean;
      data: KpiSummary;
      message?: string;
    }, {
      periodo?: string; // 'mes', 'trimestre', 'año'
      fechaInicio?: string;
      fechaFin?: string;
    }>({
      query: (params = {}) => ({
        url: '/summary',
        method: 'GET',
        params,
      }),
      providesTags: ['KpiSummary'],
    }),

    // Obtener KPIs por desarrollador
    getDeveloperKpis: builder.query<{
      success: boolean;
      data: DeveloperKpi[];
      message?: string;
    }, {
      periodo?: string;
      fechaInicio?: string;
      fechaFin?: string;
    }>({
      query: (params = {}) => ({
        url: '/developers',
        method: 'GET',
        params,
      }),
      providesTags: ['DeveloperKpi'],
    }),

    // Obtener KPIs por proyecto
    getProjectKpis: builder.query<{
      success: boolean;
      data: ProjectKpi[];
      message?: string;
    }, {
      periodo?: string;
      fechaInicio?: string;
      fechaFin?: string;
    }>({
      query: (params = {}) => ({
        url: '/projects',
        method: 'GET',
        params,
      }),
      providesTags: ['ProjectKpi'],
    }),

    // Crear nueva métrica KPI
    addKpiMetric: builder.mutation<{
      success: boolean;
      data: KpiMetric;
      message?: string;
    }, Omit<KpiMetric, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (data) => ({
        url: '/metrics',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['KpiMetric', 'KpiSummary', 'DeveloperKpi', 'ProjectKpi'],
    }),

    // Actualizar métrica KPI
    updateKpiMetric: builder.mutation<{
      success: boolean;
      data: KpiMetric;
      message?: string;
    }, { id: number; data: Partial<KpiMetric> }>({
      query: ({ id, data }) => ({
        url: `/metrics/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['KpiMetric', 'KpiSummary', 'DeveloperKpi', 'ProjectKpi'],
    }),

    // Eliminar métrica KPI
    deleteKpiMetric: builder.mutation<{
      success: boolean;
      message?: string;
    }, number>({
      query: (id) => ({
        url: `/metrics/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KpiMetric', 'KpiSummary', 'DeveloperKpi', 'ProjectKpi'],
    }),

    // Obtener métricas de productividad (para gráficos)
    getProductivityMetrics: builder.query<{
      success: boolean;
      data: Array<{
        fecha: string;
        storyPoints: number;
        commits: number;
        coverage: number;
        cycleTime: number;
      }>;
    }, {
      periodo?: string;
      desarrollador?: string;
      proyecto?: string;
    }>({
      query: (params = {}) => ({
        url: '/productivity',
        method: 'GET',
        params,
      }),
      providesTags: ['KpiMetric'],
    }),

    // Obtener métricas de calidad (para gráficos)
    getQualityMetrics: builder.query<{
      success: boolean;
      data: Array<{
        fecha: string;
        bugsCreados: number;
        bugsResueltos: number;
        deployments: number;
        coverage: number;
      }>;
    }, {
      periodo?: string;
      proyecto?: string;
    }>({
      query: (params = {}) => ({
        url: '/quality',
        method: 'GET',
        params,
      }),
      providesTags: ['KpiMetric'],
    }),

    // Importar métricas desde archivo
    importKpiMetrics: builder.mutation<{
      success: boolean;
      data: { imported: number; errors: number };
      message?: string;
    }, FormData>({
      query: (formData) => ({
        url: '/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['KpiMetric', 'KpiSummary', 'DeveloperKpi', 'ProjectKpi'],
    }),

    // Exportar métricas
    exportKpiMetrics: builder.query<Blob, {
      formato?: 'excel' | 'csv';
      fechaInicio?: string;
      fechaFin?: string;
      desarrollador?: string;
      proyecto?: string;
    }>({
      query: (params = {}) => ({
        url: '/export',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetKpiMetricsQuery,
  useGetKpiSummaryQuery,
  useGetDeveloperKpisQuery,
  useGetProjectKpisQuery,
  useAddKpiMetricMutation,
  useUpdateKpiMetricMutation,
  useDeleteKpiMetricMutation,
  useGetProductivityMetricsQuery,
  useGetQualityMetricsQuery,
  useImportKpiMetricsMutation,
  useLazyExportKpiMetricsQuery,
} = kpiApi;
