"use client";

import { withAuth } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  useGetKpiMetricsQuery, 
  useDeleteKpiMetricMutation 
} from '@/store/services/kpis';
import { 
  Trash2, 
  Edit, 
  Eye, 
  Calendar,
  User,
  Folder,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function MetricasPage() {
  const [deleteMetricId, setDeleteMetricId] = useState<number | null>(null);
  const { data: kpiResponse, isLoading, refetch } = useGetKpiMetricsQuery({});
  const [deleteKpiMetric] = useDeleteKpiMetricMutation();
  
  const kpiMetrics = kpiResponse?.data || [];

  const handleDeleteMetric = async (id: number) => {
    try {
      await deleteKpiMetric(id).unwrap();
      toast.success('Métrica eliminada correctamente');
      refetch(); // Refrescar la lista
    } catch (error) {
      console.error('Error al eliminar métrica:', error);
      toast.error('Error al eliminar la métrica');
    } finally {
      setDeleteMetricId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando métricas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registro de Métricas</h1>
          <p className="text-muted-foreground">
            Administra y revisa todas las métricas KPI registradas
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {kpiMetrics.length} registros
        </Badge>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMetrics.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desarrolladores</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(kpiMetrics.map(m => m.desarrollador)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <Folder className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(kpiMetrics.map(m => m.proyecto)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Story Points Total</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiMetrics.reduce((total, m) => total + (m.storyPoints || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Métricas */}
      <Card>
        <CardHeader>
          <CardTitle>Registro Completo de Métricas</CardTitle>
          <CardDescription>
            Todas las métricas registradas ordenadas por fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {kpiMetrics.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay métricas registradas</h3>
              <p className="text-muted-foreground mb-4">
                Comienza registrando algunas métricas desde el dashboard principal
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Desarrollador</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Sprint</TableHead>
                    <TableHead>Story Points</TableHead>
                    <TableHead>Commits</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Bugs</TableHead>
                    <TableHead>Satisfacción</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...kpiMetrics]
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map((metric) => (
                    <TableRow key={metric.id}>
                      <TableCell className="font-medium">
                        {formatDate(metric.fecha)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {metric.desarrollador}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {metric.proyecto}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {metric.sprint || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={metric.storyPoints && metric.storyPoints > 10 ? "default" : "secondary"}>
                          {metric.storyPoints || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {metric.commits || 0}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            (metric.codeCoverage || 0) >= 85 
                              ? "default" 
                              : (metric.codeCoverage || 0) >= 70 
                                ? "secondary" 
                                : "destructive"
                          }
                        >
                          {metric.codeCoverage || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="text-red-600">
                            {metric.bugsEncontrados || 0}
                          </span>
                          {' / '}
                          <span className="text-green-600">
                            {metric.bugsResueltos || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor((metric.satisfaccionCliente || 0) + (metric.satisfaccionEquipo || 0)) / 2
                                  ? "bg-yellow-400"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Aquí podrías abrir un modal para ver detalles
                              toast.info('Funcionalidad de vista detallada próximamente');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Aquí podrías abrir el formulario de edición
                              toast.info('Funcionalidad de edición próximamente');
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteMetricId(metric.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Confirmación de Eliminación */}
      <AlertDialog open={deleteMetricId !== null} onOpenChange={() => setDeleteMetricId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar métrica?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La métrica será eliminada permanentemente
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMetricId && handleDeleteMetric(deleteMetricId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAuth(MetricasPage);
