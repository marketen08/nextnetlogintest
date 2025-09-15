"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/store/types/task";
import { ChecklistProgress } from "./checklist-manager";
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
  const [isDragStarted, setIsDragStarted] = useState(false);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  
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

  // Manejar mouse down para detectar inicio de posible drag
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    setIsDragStarted(false);
    
    // Llamar al listener original de dnd-kit
    if (listeners?.onMouseDown) {
      listeners.onMouseDown(e as any);
    }
  };

  // Manejar mouse move para detectar si es un drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseDownPos.current) {
      const distance = Math.sqrt(
        Math.pow(e.clientX - mouseDownPos.current.x, 2) +
        Math.pow(e.clientY - mouseDownPos.current.y, 2)
      );
      
      // Si se mueve más de 5px, considerarlo un drag
      if (distance > 5) {
        setIsDragStarted(true);
      }
    }
    
    // Llamar al listener original de dnd-kit
    if (listeners?.onMouseMove) {
      listeners.onMouseMove(e as any);
    }
  };

  // Manejar mouse up para detectir click vs drag
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDownPos.current && !isDragStarted) {
      // Es un click, no un drag
      onEdit(task);
    }
    
    mouseDownPos.current = null;
    setIsDragStarted(false);
    
    // Llamar al listener original de dnd-kit
    if (listeners?.onMouseUp) {
      listeners.onMouseUp(e as any);
    }
  };

  // Combinar los listeners
  const combinedListeners = {
    ...listeners,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      title="Clic para editar • Arrastra para mover"
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 py-3",
        (isSortableDragging || isDragging) && "shadow-xl rotate-2 z-50 cursor-grabbing",
        !isSortableDragging && !isDragging && "hover:scale-[1.02]",
        isCompleted && "border-l-green-400 bg-green-50/50",
        task.estado === 'TASKLIST' && "border-l-gray-400",
        task.estado === 'TODO' && "border-l-blue-400",
        task.estado === 'DOING' && "border-l-yellow-400",
        task.estado === 'DONE' && "border-l-green-400"
      )}
      {...attributes}
      {...combinedListeners}
    >
      <CardHeader className="pb-0 pt-0 px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <CardTitle className="text-xs font-medium line-clamp-2 flex-1">
                {task.proyecto}
              </CardTitle>
              <Edit className="h-3 w-3 text-gray-400 opacity-60 hover:opacity-100 transition-opacity" />
            </div>
            {task.sprint && (
              <CardDescription className="text-xs mt-0.5">
                {task.sprint}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-5 w-5 p-0 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
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
      
      <CardContent className="pt-0 px-3 pb-0 space-y-1.5">
        {/* Desarrollador */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <User className="h-3 w-3" />
          <span className="truncate">{task.desarrollador}</span>
        </div>

        {/* Etiquetas */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map(tag => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs px-1.5 py-0.5 h-4"
                style={{
                  backgroundColor: tag.color + '20',
                  color: tag.color,
                  borderColor: tag.color,
                  border: '1px solid'
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Progreso del Checklist */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="py-0.5">
            <ChecklistProgress checklist={task.checklist} />
          </div>
        )}

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

        {/* Comentarios (disponibles para todos los estados) */}
        {task.comentarios && (
          <div className={cn(
            "text-xs p-1.5 rounded border-l-2 relative",
            isCompleted 
              ? "text-gray-600 bg-gray-50 border-green-300" 
              : task.estado === 'DOING'
              ? "text-blue-700 bg-yellow-50 border-yellow-400"
              : task.estado === 'TODO'
              ? "text-blue-700 bg-blue-50 border-blue-400"
              : "text-gray-600 bg-gray-50 border-gray-400"
          )}>
            <p className="line-clamp-2">{task.comentarios}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
