import { Task, TaskStatus, TaskTag, ChecklistItem } from '@/store/types/task';

// Mock data para desarrollo
let tasks: Task[] = [
  {
    id: 1,
    fecha: '2024-12-01',
    estado: 'DONE',
    desarrollador: 'Juan Pérez',
    proyecto: 'E-Commerce',
    sprint: 'Sprint 23',
    storyPoints: 8,
    horasEstimadas: 16,
    horasTrabajadas: 18,
    satisfaccionEquipo: 4,
    comentarios: 'Implementación exitosa del carrito de compras',
    tags: [
      { id: 'frontend', name: 'Frontend', color: '#3B82F6' },
      { id: 'critical', name: 'Crítico', color: '#EF4444' }
    ],
    checklist: [
      {
        id: 'check-1-1',
        text: 'Diseñar wireframes del carrito',
        completed: true,
        createdAt: new Date('2024-12-01T09:00:00').toISOString(),
        completedAt: new Date('2024-12-01T11:30:00').toISOString()
      },
      {
        id: 'check-1-2',
        text: 'Implementar funcionalidad de agregar productos',
        completed: true,
        createdAt: new Date('2024-12-01T09:00:00').toISOString(),
        completedAt: new Date('2024-12-02T10:15:00').toISOString()
      },
      {
        id: 'check-1-3',
        text: 'Pruebas unitarias',
        completed: true,
        createdAt: new Date('2024-12-01T09:00:00').toISOString(),
        completedAt: new Date('2024-12-03T14:20:00').toISOString()
      },
      {
        id: 'check-1-4',
        text: 'Integración con pasarela de pago',
        completed: true,
        createdAt: new Date('2024-12-01T09:00:00').toISOString(),
        completedAt: new Date('2024-12-03T16:45:00').toISOString()
      }
    ],
    createdAt: new Date('2024-12-01').toISOString(),
    updatedAt: new Date('2024-12-03').toISOString(),
    fechaCompletado: '2024-12-03',
  },
  {
    id: 2,
    fecha: '2024-12-02',
    estado: 'DOING',
    desarrollador: 'María García',
    proyecto: 'CRM',
    sprint: 'Sprint 15',
    storyPoints: 5,
    horasEstimadas: 12,
    comentarios: 'Trabajando en la integración con el sistema de notificaciones. Progreso al 70%.',
    tags: [
      { id: 'backend', name: 'Backend', color: '#10B981' },
      { id: 'integration', name: 'Integración', color: '#8B5CF6' }
    ],
    checklist: [
      {
        id: 'check-2-1',
        text: 'Configurar conexión con API de Salesforce',
        completed: true,
        createdAt: new Date('2024-12-02T08:00:00').toISOString(),
        completedAt: new Date('2024-12-02T12:30:00').toISOString()
      },
      {
        id: 'check-2-2',
        text: 'Mapear campos entre sistemas',
        completed: true,
        createdAt: new Date('2024-12-02T08:00:00').toISOString(),
        completedAt: new Date('2024-12-03T10:00:00').toISOString()
      },
      {
        id: 'check-2-3',
        text: 'Implementar sincronización bidireccional',
        completed: false,
        createdAt: new Date('2024-12-02T08:00:00').toISOString()
      },
      {
        id: 'check-2-4',
        text: 'Pruebas de integración',
        completed: false,
        createdAt: new Date('2024-12-02T08:00:00').toISOString()
      }
    ],
    createdAt: new Date('2024-12-02').toISOString(),
    updatedAt: new Date('2024-12-02').toISOString(),
  },
  {
    id: 3,
    fecha: '2024-12-03',
    estado: 'TODO',
    desarrollador: 'Carlos Rodriguez',
    proyecto: 'API Gateway',
    sprint: 'Sprint 8',
    storyPoints: 13,
    horasEstimadas: 24,
    comentarios: 'Pendiente: Definir especificaciones de autenticación y rate limiting.',
    tags: [
      { id: 'security', name: 'Seguridad', color: '#F59E0B' },
      { id: 'architecture', name: 'Arquitectura', color: '#6366F1' }
    ],
    createdAt: new Date('2024-12-03').toISOString(),
    updatedAt: new Date('2024-12-03').toISOString(),
  },
  {
    id: 4,
    fecha: '2024-12-04',
    estado: 'DONE_BACKUP',
    desarrollador: 'Ana López',
    proyecto: 'Dashboard Analytics',
    sprint: 'Sprint 12',
    storyPoints: 3,
    horasEstimadas: 8,
    horasTrabajadas: 6,
    satisfaccionEquipo: 5,
    comentarios: 'Optimización exitosa de consultas',
    tags: [
      { id: 'performance', name: 'Performance', color: '#EC4899' },
      { id: 'database', name: 'Base de Datos', color: '#14B8A6' }
    ],
    createdAt: new Date('2024-12-04').toISOString(),
    updatedAt: new Date('2024-12-05').toISOString(),
    fechaCompletado: '2024-12-05',
  },
  {
    id: 5,
    fecha: '2024-12-05',
    estado: 'TASKLIST',
    desarrollador: 'Pedro Martínez',
    proyecto: 'Mobile App',
    sprint: 'Sprint 20',
    storyPoints: 21,
    horasEstimadas: 40,
    comentarios: 'Requiere análisis de arquitectura React Native. Evaluar dependencias.',
    tags: [
      { id: 'mobile', name: 'Mobile', color: '#8B5CF6' },
      { id: 'research', name: 'Investigación', color: '#F97316' }
    ],
    checklist: [
      {
        id: 'check-5-1',
        text: 'Investigar bibliotecas de navegación',
        completed: false,
        createdAt: new Date('2024-12-05T09:00:00').toISOString()
      },
      {
        id: 'check-5-2',
        text: 'Evaluar React Navigation vs Expo Router',
        completed: false,
        createdAt: new Date('2024-12-05T09:00:00').toISOString()
      },
      {
        id: 'check-5-3',
        text: 'Configurar estructura base del proyecto',
        completed: false,
        createdAt: new Date('2024-12-05T09:00:00').toISOString()
      },
      {
        id: 'check-5-4',
        text: 'Definir arquitectura de estado global',
        completed: false,
        createdAt: new Date('2024-12-05T09:00:00').toISOString()
      }
    ],
    createdAt: new Date('2024-12-05').toISOString(),
    updatedAt: new Date('2024-12-05').toISOString(),
  }
];

let nextId = 6;

// Funciones para manejar los datos
export function getAllTasks(): Task[] {
  return [...tasks];
}

export function getTaskById(id: number): Task | undefined {
  return tasks.find(t => t.id === id);
}

export function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const newTask: Task = {
    ...task,
    id: nextId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  return newTask;
}

export function updateTask(id: number, updates: Partial<Task>): Task | null {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  // Si se está completando la tarea (cambiando a DONE o DONE_BACKUP)
  const isCompleting = updates.estado && 
    ['DONE', 'DONE_BACKUP'].includes(updates.estado) && 
    !['DONE', 'DONE_BACKUP'].includes(tasks[index].estado);
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    id, // Mantener el ID original
    updatedAt: new Date().toISOString(),
    ...(isCompleting && { fechaCompletado: new Date().toISOString().split('T')[0] }),
  };
  
  return tasks[index];
}

export function deleteTask(id: number): boolean {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  return true;
}

// Funciones de utilidad para filtros
export function getTasksByDeveloper(desarrollador: string): Task[] {
  return tasks.filter(t => t.desarrollador === desarrollador);
}

export function getTasksByProject(proyecto: string): Task[] {
  return tasks.filter(t => t.proyecto === proyecto);
}

export function getTasksByStatus(estado: TaskStatus): Task[] {
  return tasks.filter(t => t.estado === estado);
}

export function getTasksByDateRange(fechaInicio: string, fechaFin: string): Task[] {
  return tasks.filter(t => t.fecha >= fechaInicio && t.fecha <= fechaFin);
}

// Estadísticas
export function getTaskStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => ['DONE', 'DONE_BACKUP'].includes(t.estado)).length;
  const inProgress = tasks.filter(t => t.estado === 'DOING').length;
  const pending = tasks.filter(t => ['TASKLIST', 'TODO'].includes(t.estado)).length;
  
  const completedTasks = tasks.filter(t => ['DONE', 'DONE_BACKUP'].includes(t.estado));
  const avgHorasTrabajadas = completedTasks.length > 0 
    ? completedTasks.reduce((sum, t) => sum + (t.horasTrabajadas || 0), 0) / completedTasks.length 
    : 0;
  
  const avgSatisfaccion = completedTasks.length > 0
    ? completedTasks.reduce((sum, t) => sum + (t.satisfaccionEquipo || 0), 0) / completedTasks.length
    : 0;

  const desarrolladores = [...new Set(tasks.map(t => t.desarrollador))].length;

  return {
    total,
    completed,
    inProgress,
    pending,
    avgHorasTrabajadas: Math.round(avgHorasTrabajadas * 100) / 100,
    avgSatisfaccion: Math.round(avgSatisfaccion * 100) / 100,
    desarrolladores,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Función para limpiar tareas con estados inválidos
export function cleanInvalidTasks(): { fixed: number; tasks: Task[] } {
  const validStates: TaskStatus[] = ['TASKLIST', 'TODO', 'DOING', 'DONE', 'DONE_BACKUP'];
  let fixedCount = 0;

  tasks = tasks.map(task => {
    // Verificar si el estado es válido
    if (!validStates.includes(task.estado as TaskStatus) || task.estado === undefined) {
      fixedCount++;
      return {
        ...task,
        estado: 'TASKLIST' as TaskStatus,
        updatedAt: new Date().toISOString(),
      };
    }
    return task;
  });

  return { fixed: fixedCount, tasks: [...tasks] };
}

export function recoverDoneBackupTasks(): { fixed: number; tasks: Task[] } {
  const validStates: TaskStatus[] = ['TASKLIST', 'TODO', 'DOING', 'DONE'];
  let fixedCount = 0;

  tasks = tasks.map(task => {
    // Verificar si el estado es válido
    console.log('Revisando tarea ID:', task.id, 'Estado:', task.estado);
    if (!validStates.includes(task.estado as TaskStatus) || task.estado === undefined || task.estado === 'DONE_BACKUP') {
      fixedCount++;
      return {
        ...task,
        estado: 'TASKLIST' as TaskStatus,
        updatedAt: new Date().toISOString(),
      };
    }
    return task;
  });

  return { fixed: fixedCount, tasks: [...tasks] };
}

// Ejecutar limpieza automáticamente al cargar el módulo
const cleanup = cleanInvalidTasks();
if (cleanup.fixed > 0) {
  console.log(`Se corrigieron ${cleanup.fixed} tareas con estados inválidos, movidas a TASKLIST`);
}
