"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useCompleteTaskMutation,
} from "@/store/services/tasks";
import { Task, TaskStatus } from "@/store/types/task";
import { TaskForm } from "./task-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Filter,
  Calendar,
  User,
  Clock,
  Target,
} from "lucide-react";

const taskStateLabels: Record<TaskStatus, string> = {
  TASKLIST: 'Task List',
  TODO: 'To Do',
  DOING: 'Doing',
  DONE: 'Done',
  DONE_BACKUP: 'Done (Backup)',
};

const taskStateVariants: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  TASKLIST: 'secondary',
  TODO: 'outline',
  DOING: 'default',
  DONE: 'default',
  DONE_BACKUP: 'secondary',
};

interface TaskListProps {
  className?: string;
}

export function TaskList({ className }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [developerFilter, setDeveloperFilter] = useState<string | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');

  // Construir parámetros de query
  const queryParams: Record<string, string> = {};
  if (statusFilter !== 'all') queryParams.estado = statusFilter;
  if (developerFilter !== 'all') queryParams.desarrollador = developerFilter;
  if (projectFilter !== 'all') queryParams.proyecto = projectFilter;

  const { 
    data: tasksResponse, 
    isLoading, 
    error,
    refetch 
  } = useGetTasksQuery(queryParams);

  const tasks = tasksResponse?.data || [];

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [completeTask, { isLoading: isCompleting }] = useCompleteTaskMutation();

  // Filtrar tareas por término de búsqueda
  const filteredTasks = tasks.filter((task: Task) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      task.desarrollador.toLowerCase().includes(search) ||
      task.proyecto.toLowerCase().includes(search) ||
      task.sprint?.toLowerCase().includes(search) ||
      task.comentarios?.toLowerCase().includes(search)
    );
  });

  // Obtener valores únicos para filtros
  const uniqueDevelopers = Array.from(new Set(tasks.map((t: Task) => t.desarrollador)));
  const uniqueProjects = Array.from(new Set(tasks.map((t: Task) => t.proyecto)));

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id).unwrap();
      toast.success('Tarea eliminada exitosamente');
      setDeleteTaskId(null);
    } catch (error: any) {
      console.error('Error al eliminar tarea:', error);
      toast.error(error?.data?.message || 'Error al eliminar la tarea');
    }
  };

  const handleComplete = async (task: Task) => {
    try {
      await completeTask({
        id: task.id,
        horasTrabajadas: task.horasEstimadas || 0,
        satisfaccionEquipo: 4,
        comentarios: `Tarea completada automáticamente`,
      }).unwrap();
      toast.success('Tarea marcada como completada');
    } catch (error: any) {
      console.error('Error al completar tarea:', error);
      toast.error(error?.data?.message || 'Error al completar la tarea');
    }
  };

  const handleFormSuccess = () => {
    setSelectedTask(null);
    refetch();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDeveloperFilter('all');
    setProjectFilter('all');
  };

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error al cargar las tareas. Por favor, intenta nuevamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Gestión de Tareas</CardTitle>
              <CardDescription>
                Administra las tareas del equipo de desarrollo
              </CardDescription>
            </div>
            <Button onClick={() => setIsFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros y búsqueda */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por desarrollador, proyecto, sprint..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Limpiar Filtros
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={statusFilter} onValueChange={(value: TaskStatus | 'all') => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(taskStateLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={developerFilter} onValueChange={(value: string) => setDeveloperFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por desarrollador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los desarrolladores</SelectItem>
                  {uniqueDevelopers.map((developer: string) => (
                    <SelectItem key={developer} value={developer}>
                      {developer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={projectFilter} onValueChange={(value: string) => setProjectFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proyectos</SelectItem>
                  {uniqueProjects.map((project: string) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de tareas */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No se encontraron tareas</p>
              <p className="text-sm">
                {tasks.length === 0 
                  ? "Comienza creando tu primera tarea" 
                  : "Intenta ajustar los filtros de búsqueda"
                }
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha
                      </div>
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Desarrollador
                      </div>
                    </TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Sprint</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Target className="h-4 w-4" />
                        SP
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        Horas
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Satisfacción</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task: Task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        {format(new Date(task.fecha), 'dd/MM/yyyy', { locale: es })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={taskStateVariants[task.estado]}>
                          {taskStateLabels[task.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.desarrollador}</TableCell>
                      <TableCell>{task.proyecto}</TableCell>
                      <TableCell>{task.sprint || '-'}</TableCell>
                      <TableCell className="text-center">
                        {task.storyPoints || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          {task.horasEstimadas ? `${task.horasEstimadas}h` : '-'}
                          {task.horasTrabajadas && (
                            <>
                              <br />
                              <span className="text-green-600">
                                {task.horasTrabajadas}h real
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {task.satisfaccionEquipo ? (
                          <Badge variant="outline">
                            {task.satisfaccionEquipo}/5
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(task)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            {!['DONE', 'DONE_BACKUP'].includes(task.estado) && (
                              <DropdownMenuItem 
                                onClick={() => handleComplete(task)}
                                disabled={isCompleting}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marcar como completada
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteTaskId(task.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario de tareas */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedTask(null);
        }}
        task={selectedTask}
        onSuccess={handleFormSuccess}
      />

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la tarea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTaskId && handleDelete(deleteTaskId)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
