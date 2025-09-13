import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateTaskMutation } from '@/store/services/tasks';
import { Task } from '@/store/types/task';

export function useBulkMoveToBackup() {
  const [isMoving, setIsMoving] = useState(false);
  const [updateTask] = useUpdateTaskMutation();

  const moveAllToBackup = async (doneTasks: Task[]): Promise<boolean> => {
    if (doneTasks.length === 0) {
      toast.info('No hay tareas para mover a backup');
      return false;
    }

    setIsMoving(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Procesar las tareas en paralelo
      const promises = doneTasks.map(async (task) => {
        try {
          await updateTask({
            ...task,
            estado: 'DONE_BACKUP',
          }).unwrap();
          successCount++;
        } catch (error) {
          console.error(`Error moviendo tarea ${task.id}:`, error);
          errorCount++;
        }
      });

      await Promise.all(promises);

      if (successCount > 0) {
        toast.success(
          `${successCount} tarea${successCount > 1 ? 's' : ''} movida${successCount > 1 ? 's' : ''} a backup exitosamente`
        );
      }

      if (errorCount > 0) {
        toast.error(
          `Error al mover ${errorCount} tarea${errorCount > 1 ? 's' : ''}`
        );
      }

      return successCount > 0;
    } catch (error) {
      toast.error('Error general al mover tareas a backup');
      return false;
    } finally {
      setIsMoving(false);
    }
  };

  return {
    moveAllToBackup,
    isMoving,
  };
}
