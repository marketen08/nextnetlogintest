"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/store/types/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  Target,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isDragging?: boolean;
}

export function KanbanCard({ task, onEdit, onDelete, isDragging = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging || isDragging ? 0.5 : 1,
  };

  const isCompleted = ['DONE', 'DONE_BACKUP'].includes(task.estado);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 border-l-4",
        (isSortableDragging || isDragging) && "shadow-xl rotate-2 z-50",
        isCompleted && "border-l-green-400 bg-green-50/50",
        task.estado === 'TASKLIST' && "border-l-gray-400",
        task.estado === 'TODO' && "border-l-blue-400",
        task.estado === 'DOING' && "border-l-yellow-400",
        task.estado === 'DONE' && "border-l-green-400"
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {task.proyecto}
            </CardTitle>
            {task.sprint && (
              <CardDescription className="text-xs">
                {task.sprint}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-3 w-3" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Desarrollador */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span className="truncate">{task.desarrollador}</span>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(task.fecha), 'dd/MM/yyyy', { locale: es })}</span>
        </div>

        {/* Métricas */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs">
            {task.storyPoints && (
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-blue-500" />
                <span className="font-medium">{task.storyPoints}</span>
              </div>
            )}
            
            {task.horasEstimadas && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-500" />
                <span>{task.horasEstimadas}h</span>
              </div>
            )}
          </div>

          {task.satisfaccionEquipo && (
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3 text-yellow-500" />
              <Badge variant="outline" className="text-xs px-1 py-0">
                {task.satisfaccionEquipo}/5
              </Badge>
            </div>
          )}
        </div>

        {/* Horas trabajadas (solo si está completada) */}
        {isCompleted && task.horasTrabajadas && (
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 text-green-500" />
            <span className="text-green-600 font-medium">
              {task.horasTrabajadas}h trabajadas
            </span>
          </div>
        )}

        {/* Comentarios (solo si existen y la tarjeta está completada) */}
        {isCompleted && task.comentarios && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-green-300">
            <p className="line-clamp-2">{task.comentarios}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
