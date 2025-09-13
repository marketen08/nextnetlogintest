"use client";

import { useMemo } from "react";
import { useGetTaskStatsQuery, useGetTasksQuery } from "@/store/services/tasks";
import { TaskStatus } from "@/store/types/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Target,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Activity,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskDashboardProps {
  className?: string;
}

const statusColors = {
  TASKLIST: '#8b5cf6',
  TODO: '#06b6d4',
  DOING: '#f59e0b',
  DONE: '#10b981',
  DONE_BACKUP: '#6b7280',
};

const statusLabels = {
  TASKLIST: 'Task List',
  TODO: 'To Do',
  DOING: 'Doing',
  DONE: 'Done',
  DONE_BACKUP: 'Done (Backup)',
};

export function TaskDashboard({ className }: TaskDashboardProps) {
  const { 
    data: statsResponse, 
    isLoading: isLoadingStats,
    error: statsError 
  } = useGetTaskStatsQuery();

  const { 
    data: tasksResponse, 
    isLoading: isLoadingTasks 
  } = useGetTasksQuery({});

  const stats = statsResponse?.data;
  const tasks = tasksResponse?.data || [];

  // Calcular estadísticas adicionales
  const additionalStats = useMemo(() => {
    if (!tasks.length) return null;

    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.estado] = (acc[task.estado] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    const developerStats = tasks.reduce((acc, task) => {
      if (!acc[task.desarrollador]) {
        acc[task.desarrollador] = {
          total: 0,
          done: 0,
          hours: 0,
          satisfaction: 0,
          satisfactionCount: 0,
        };
      }
      acc[task.desarrollador].total += 1;
      if (['DONE', 'DONE_BACKUP'].includes(task.estado)) {
        acc[task.desarrollador].done += 1;
        if (task.horasTrabajadas) {
          acc[task.desarrollador].hours += task.horasTrabajadas;
        }
        if (task.satisfaccionEquipo) {
          acc[task.desarrollador].satisfaction += task.satisfaccionEquipo;
          acc[task.desarrollador].satisfactionCount += 1;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const projectStats = tasks.reduce((acc, task) => {
      if (!acc[task.proyecto]) {
        acc[task.proyecto] = {
          total: 0,
          done: 0,
          storyPoints: 0,
          hours: 0,
        };
      }
      acc[task.proyecto].total += 1;
      if (['DONE', 'DONE_BACKUP'].includes(task.estado)) {
        acc[task.proyecto].done += 1;
      }
      if (task.storyPoints) {
        acc[task.proyecto].storyPoints += task.storyPoints;
      }
      if (task.horasTrabajadas) {
        acc[task.proyecto].hours += task.horasTrabajadas;
      }
      return acc;
    }, {} as Record<string, any>);

    return {
      statusCounts,
      developerStats,
      projectStats,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => ['DONE', 'DONE_BACKUP'].includes(t.estado)).length,
      activeDevelopers: Object.keys(developerStats).length,
      activeProjects: Object.keys(projectStats).length,
    };
  }, [tasks]);

  // Datos para gráficos
  const statusChartData = useMemo(() => {
    if (!additionalStats) return [];
    return Object.entries(additionalStats.statusCounts).map(([status, count]) => ({
      name: statusLabels[status as TaskStatus],
      value: count,
      color: statusColors[status as TaskStatus],
    }));
  }, [additionalStats]);

  const developerChartData = useMemo(() => {
    if (!additionalStats) return [];
    return Object.entries(additionalStats.developerStats)
      .map(([developer, data]) => ({
        developer,
        total: data.total,
        done: data.done,
        completion: data.total > 0 ? ((data.done / data.total) * 100).toFixed(1) : '0',
        avgSatisfaction: data.satisfactionCount > 0 
          ? (data.satisfaction / data.satisfactionCount).toFixed(1) 
          : 'N/A',
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [additionalStats]);

  const projectChartData = useMemo(() => {
    if (!additionalStats) return [];
    return Object.entries(additionalStats.projectStats)
      .map(([project, data]) => ({
        project,
        total: data.total,
        done: data.done,
        storyPoints: data.storyPoints,
        hours: data.hours,
        completion: data.total > 0 ? ((data.done / data.total) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [additionalStats]);

  if (statsError) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error al cargar las estadísticas. Por favor, intenta nuevamente.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tareas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{additionalStats?.totalTasks || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {additionalStats?.activeDevelopers || 0} desarrolladores activos
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {additionalStats?.completedTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {additionalStats?.totalTasks 
                    ? ((additionalStats.completedTasks / additionalStats.totalTasks) * 100).toFixed(1)
                    : 0}% completado
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Horas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.avgHorasTrabajadas?.toFixed(1) || '0.0'}h
                </div>
                <p className="text-xs text-muted-foreground">
                  Por tarea completada
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción Promedio</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.avgSatisfaccion?.toFixed(1) || '0.0'}/5
                </div>
                <p className="text-xs text-muted-foreground">
                  Satisfacción del equipo
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por estado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Distribución por Estado
            </CardTitle>
            <CardDescription>
              Distribución de tareas por estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <Skeleton className="h-64 w-full" />
            ) : statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }: any) => 
                      `${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rendimiento por desarrollador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rendimiento por Desarrollador
            </CardTitle>
            <CardDescription>
              Tareas totales y completadas por desarrollador
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <Skeleton className="h-64 w-full" />
            ) : developerChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={developerChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="developer" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      name === 'total' ? 'Total' : 'Completadas'
                    ]}
                    labelFormatter={(label) => `Desarrollador: ${label}`}
                  />
                  <Bar dataKey="total" fill="#e5e7eb" name="total" />
                  <Bar dataKey="done" fill="#10b981" name="done" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen por proyectos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumen por Proyectos
          </CardTitle>
          <CardDescription>
            Estadísticas de progreso por proyecto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : projectChartData.length > 0 ? (
            <div className="space-y-4">
              {projectChartData.map((project) => (
                <div key={project.project} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <h4 className="font-semibold">{project.project}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>Total: {project.total}</span>
                      <span>Completadas: {project.done}</span>
                      {project.storyPoints > 0 && <span>SP: {project.storyPoints}</span>}
                      {project.hours > 0 && <span>Horas: {project.hours}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={parseFloat(project.completion) >= 50 ? "default" : "secondary"}>
                      {project.completion}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay proyectos para mostrar
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
