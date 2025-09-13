"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/store/types/task";
import { KanbanCard } from "./kanban-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Archive, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onMoveAllToBackup?: () => void;
  isMovingToBackup?: boolean;
}

export function KanbanColumn({ 
  id, 
  title, 
  color, 
  tasks, 
  onEdit, 
  onDelete,
  onMoveAllToBackup,
  isMovingToBackup = false
}: KanbanColumnProps) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "relative flex flex-col",
        isOver && "bg-blue-50/30"
      )}
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <Card className={cn(
        "h-full shadow-sm border-t-4 relative flex flex-col",
        isOver && "ring-2 ring-blue-500 ring-opacity-50",
        id === 'TASKLIST' && "border-t-gray-500",
        id === 'TODO' && "border-t-blue-500", 
        id === 'DOING' && "border-t-yellow-500",
        id === 'DONE' && "border-t-green-500"
      )}>
      <CardHeader className={cn("pb-1 pt-2 px-4", color)}>
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="font-semibold truncate">{title}</span>
          <Badge variant="secondary" className="bg-white/90 text-gray-700 font-medium text-xs px-2 py-1 h-5">
            {tasks.length}
          </Badge>
        </CardTitle>
        
        {/* Botón para mover todas las tareas DONE a BACKUP */}
        {id === 'DONE' && tasks.length > 0 && onMoveAllToBackup && (
          <div className="mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onMoveAllToBackup}
              disabled={isMovingToBackup}
              className="w-full gap-1 text-xs h-7 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300"
            >
              <Archive className="h-3 w-3" />
              {isMovingToBackup ? 'Moviendo...' : `Mover ${tasks.length} a Backup`}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 pt-1 px-3 pb-3 overflow-y-auto min-h-0">
        <div className="space-y-2">
          <SortableContext 
            items={tasks.map(task => task.id.toString())} 
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
          
          {tasks.length === 0 && (
            <div className={cn(
              "flex flex-col items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed rounded-lg transition-colors",
              isOver ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200"
            )}>
              <div className="text-center">
                <div className="text-lg mb-1">📋</div>
                <div>Arrastra tareas aquí</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
