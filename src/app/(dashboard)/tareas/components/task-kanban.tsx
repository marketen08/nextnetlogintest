"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  rectIntersection,
  getFirstCollision,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/store/services/tasks";
import { Task, TaskStatus } from "@/store/types/task";
import { TaskForm } from "./task-form";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { useBulkMoveToBackup } from "../hooks/useBulkMoveToBackup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Users,
  Briefcase,
  Archive,
  Info,
  RotateCcw,
} from "lucide-react";

// Estados del Kanban (sin DONE_BACKUP)
const KANBAN_COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'TASKLIST', title: 'Task List', color: 'bg-gray-100' },
  { id: 'TODO', title: 'To Do', color: 'bg-blue-100' },
  { id: 'DOING', title: 'Doing', color: 'bg-yellow-100' },
  { id: 'DONE', title: 'Done', color: 'bg-green-100' },
];

// Función de detección de colisiones personalizada que prioriza las columnas
const customCollisionDetection = (args: any) => {
  const columnIds = KANBAN_COLUMNS.map(col => col.id);
  
  // Primero intentar detectar colisiones con las columnas usando pointerWithin
  const pointerCollisions = pointerWithin(args);
  const columnCollisions = pointerCollisions.filter((collision: any) => 
    columnIds.includes(collision.id)
  );
  
  if (columnCollisions.length > 0) {
    return columnCollisions;
  }
  
  // Si no hay colisiones con columnas, usar rectIntersection como respaldo
  return rectIntersection(args);
};

interface TaskKanbanProps {
  className?: string;
}

export function TaskKanban({ className }: TaskKanbanProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showBackupConfirmation, setShowBackupConfirmation] = useState(false);
  
  // Hook para mover tareas a backup
  const { moveAllToBackup, isMoving: isMovingToBackup } = useBulkMoveToBackup();
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [developerFilter, setDeveloperFilter] = useState<string | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string | 'all'>('all');
  const [isRecovering, setIsRecovering] = useState(false);

  // Construir parámetros de query (excluyendo DONE_BACKUP)
  const queryParams: Record<string, string> = {};
  if (developerFilter !== 'all') queryParams.desarrollador = developerFilter;
  if (projectFilter !== 'all') queryParams.proyecto = projectFilter;

  const { 
    data: tasksResponse, 
    isLoading, 
    error,
    refetch 
  } = useGetTasksQuery(queryParams);

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const tasks = tasksResponse?.data || [];

  // Obtener tareas en DONE_BACKUP para mostrar información
  const backupTasks = useMemo(() => {
    return tasks.filter((task: Task) => task.estado === 'DONE_BACKUP');
  }, [tasks]);

  // Filtrar tareas para Kanban (sin DONE_BACKUP) y por término de búsqueda
  const kanbanTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      // Excluir DONE_BACKUP del Kanban
      if (task.estado === 'DONE_BACKUP') return false;
      
      // Filtrar por término de búsqueda
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          task.desarrollador.toLowerCase().includes(search) ||
          task.proyecto.toLowerCase().includes(search) ||
          task.sprint?.toLowerCase().includes(search) ||
          task.comentarios?.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [tasks, searchTerm]);

  // Agrupar tareas por estado
  const tasksByStatus = useMemo(() => {
    return KANBAN_COLUMNS.reduce((acc, column) => {
      acc[column.id] = kanbanTasks.filter((task: Task) => task.estado === column.id);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [kanbanTasks]);

  // Obtener valores únicos para filtros
  const uniqueDevelopers = Array.from(new Set(tasks.map((t: Task) => t.desarrollador)));
  const uniqueProjects = Array.from(new Set(tasks.map((t: Task) => t.proyecto)));

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Menor distancia para activación más sensible
      },
    })
  );

  // Manejar inicio de drag
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = kanbanTasks.find((t: Task) => t.id.toString() === active.id);
    setActiveTask(task || null);
  };

  // Manejar fin de drag
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    // Si no hay un destino válido, mostrar mensaje informativo
    if (!over) {
      toast.info('Arrastra la tarea a una de las columnas para cambiar su estado');
      return;
    }

    const taskId = active.id;
    const newStatus = over.id as TaskStatus;
    
    // Validar que el nuevo estado sea uno de los estados válidos del Kanban
    const validStatuses = KANBAN_COLUMNS.map(col => col.id);
    if (!validStatuses.includes(newStatus)) {
      console.warn(`Estado inválido: ${newStatus}. Estados válidos: ${validStatuses.join(', ')}`);
      toast.warning('Arrastra la tarea a una columna válida (Task List, To Do, Doing, o Done)');
      return; // No proceder si el estado no es válido
    }
    
    const task = kanbanTasks.find((t: Task) => t.id.toString() === taskId);
    if (!task || task.estado === newStatus) return;

    try {
      await updateTask({
        ...task,
        estado: newStatus,
        // Si se mueve a DONE, requerir horas trabajadas y satisfacción
        ...(newStatus === 'DONE' && !task.horasTrabajadas && {
          horasTrabajadas: task.horasEstimadas || 0,
          satisfaccionEquipo: 4,
          comentarios: `Tarea completada mediante Kanban el ${format(new Date(), 'dd/MM/yyyy', { locale: es })}`
        })
      }).unwrap();
      
      toast.success(`Tarea movida a ${KANBAN_COLUMNS.find(c => c.id === newStatus)?.title}`);
    } catch (error: any) {
      console.error('Error al actualizar tarea:', error);
      toast.error(error?.data?.message || 'Error al mover la tarea');
    }
  };

  // Manejar edición de tarea
  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  // Manejar eliminación de tarea
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

  const handleFormSuccess = () => {
    setSelectedTask(null);
    refetch();
  };

  // Manejar movimiento a backup
  const handleMoveAllToBackup = () => {
    const doneTasks = tasksByStatus['DONE'] || [];
    if (doneTasks.length === 0) {
      toast.info('No hay tareas completadas para mover');
      return;
    }
    setShowBackupConfirmation(true);
  };

  // Función para recuperar tareas DONE_BACKUP
  const handleRecoverBackupTasks = async () => {
    setIsRecovering(true);
    try {
      const response = await fetch('/api/tasks/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Se recuperaron ${result.fixed} tareas desde DONE_BACKUP a TASKLIST`);
        // Forzar refetch de las tareas para mostrar los cambios
        refetch();
      } else {
        toast.error(result.message || 'Error al recuperar las tareas');
      }
    } catch (error) {
      console.error('Error al recuperar tareas:', error);
      toast.error('Error al recuperar las tareas');
    } finally {
      setIsRecovering(false);
    }
  };

  const confirmMoveAllToBackup = async () => {
    const doneTasks = tasksByStatus['DONE'] || [];
    const success = await moveAllToBackup(doneTasks);
    if (success) {
      refetch(); // Refrescar datos después del movimiento
    }
    setShowBackupConfirmation(false);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDeveloperFilter('all');
    setProjectFilter('all');
  };

  if (error) {
    return (
      <div className={`${className} h-full flex flex-col items-center justify-center`}>
        <div className="text-center text-red-600">
          Error al cargar las tareas. Por favor, intenta nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} h-full flex flex-col`}>
      {/* Header y filtros en una línea */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {/* Botones de acción */}
        <Button 
          onClick={handleRecoverBackupTasks} 
          variant="outline" 
          className="gap-2 h-9"
          disabled={isRecovering}
          size="sm"
        >
          <RotateCcw className="h-4 w-4" />
          {isRecovering ? 'Recuperando...' : 'Recuperar Backup'}
        </Button>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2 h-9" size="sm">
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>

        {/* Filtros */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        <Select value={developerFilter} onValueChange={(value: string) => setDeveloperFilter(value)}>
          <SelectTrigger className="h-9 min-w-[140px]">
            <SelectValue placeholder="Desarrollador" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Todos
              </div>
            </SelectItem>
            {uniqueDevelopers.map((developer: string) => (
              <SelectItem key={developer} value={developer}>
                {developer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={projectFilter} onValueChange={(value: string) => setProjectFilter(value)}>
          <SelectTrigger className="h-9 min-w-[120px]">
            <SelectValue placeholder="Proyecto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Todos
              </div>
            </SelectItem>
            {uniqueProjects.map((project: string) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="gap-2 h-9"
          size="sm"
        >
          <Filter className="h-4 w-4" />
          Limpiar
        </Button>
      </div>

      {/* Información de tareas en backup */}
      {false && (
        <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-700">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">
              Hay {backupTasks.length} tarea{backupTasks.length > 1 ? 's' : ''} en DONE_BACKUP 
              (no visible{backupTasks.length > 1 ? 's' : ''} en el Kanban)
            </span>
          </div>
        </div>
      )}

      {/* Tablero Kanban */}
      <div className="flex-1" style={{ height: 'calc(100vh - 200px)' }}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
            {KANBAN_COLUMNS.map((column) => (
              <div key={column.id} className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
                <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-white rounded border animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={customCollisionDetection}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
                {KANBAN_COLUMNS.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    id={column.id}
                    title={column.title}
                    color={column.color}
                    tasks={tasksByStatus[column.id] || []}
                    onEdit={handleEdit}
                    onDelete={(id: number) => setDeleteTaskId(id)}
                    onMoveAllToBackup={column.id === 'DONE' ? handleMoveAllToBackup : undefined}
                    isMovingToBackup={isMovingToBackup}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeTask ? (
                  <KanbanCard
                    task={activeTask}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    isDragging
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
        )}
      </div>

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

      {/* Dialog de confirmación para mover a backup */}
      <AlertDialog open={showBackupConfirmation} onOpenChange={setShowBackupConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-orange-500" />
              Mover tareas a Backup
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres mover todas las {tasksByStatus['DONE']?.length || 0} tarea
              {(tasksByStatus['DONE']?.length || 0) > 1 ? 's' : ''} completada
              {(tasksByStatus['DONE']?.length || 0) > 1 ? 's' : ''} a DONE_BACKUP?
              <br /><br />
              Las tareas en DONE_BACKUP no se mostrarán en el tablero Kanban pero seguirán 
              disponibles en la vista de lista y estadísticas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMovingToBackup}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMoveAllToBackup}
              disabled={isMovingToBackup}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isMovingToBackup ? 'Moviendo...' : 'Mover a Backup'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
