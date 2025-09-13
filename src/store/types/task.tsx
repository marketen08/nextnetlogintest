export type TaskStatus = 'TASKLIST' | 'TODO' | 'DOING' | 'DONE' | 'DONE_BACKUP';

export interface TaskTag {
  id: string;
  name: string;
  color: string; // Color en formato hex (#FF5733) o predefinido
}

export interface Task {
  id: number;
  fecha: string; // Fecha de creación/asignación
  estado: TaskStatus;
  desarrollador: string;
  proyecto: string;
  sprint?: string;
  storyPoints?: number;
  horasEstimadas?: number;
  tags?: TaskTag[]; // Etiquetas asignadas a la tarea
  
  // Datos completados al finalizar la tarea
  horasTrabajadas?: number;
  satisfaccionEquipo?: number; // 1-5
  comentarios?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  fechaCompletado?: string; // Cuando se marca como DONE o DONE_BACKUP
}

export interface TaskSummary {
  periodo: string;
  totalTareas: number;
  tareasCompletadas: number;
  tareasEnProgreso: number;
  tareasPendientes: number;
  avgHorasTrabajadas: number;
  avgSatisfaccionEquipo: number;
  avgStoryPoints: number;
  desarrolladoresActivos: number;
}

export interface DeveloperTaskSummary {
  desarrollador: string;
  totalTareas: number;
  tareasCompletadas: number;
  avgHorasTrabajadas: number;
  avgSatisfaccionEquipo: number;
  totalStoryPoints: number;
  eficiencia: number; // horasEstimadas vs horasTrabajadas
}

export interface ProjectTaskSummary {
  proyecto: string;
  totalTareas: number;
  tareasCompletadas: number;
  avgCycleTime: number; // tiempo promedio de completado
  teamSize: number;
  avgSatisfaccionEquipo: number;
}

// Para el formulario de tareas
export interface CreateTaskRequest {
  fecha: string;
  estado: TaskStatus;
  desarrollador: string;
  proyecto: string;
  sprint?: string;
  storyPoints?: number;
  horasEstimadas?: number;
  tags?: TaskTag[];
}

export interface UpdateTaskRequest {
  id: number;
  estado?: TaskStatus;
  desarrollador?: string;
  proyecto?: string;
  sprint?: string;
  storyPoints?: number;
  horasEstimadas?: number;
  horasTrabajadas?: number;
  satisfaccionEquipo?: number;
  comentarios?: string;
  tags?: TaskTag[];
}

// Para completar una tarea
export interface CompleteTaskRequest {
  id: number;
  horasTrabajadas: number;
  satisfaccionEquipo: number;
  comentarios?: string;
}
