import { KpiMetric } from '@/store/types/kpi';

// Simulación de base de datos en memoria con algunos datos de ejemplo
let kpiMetrics: KpiMetric[] = [
  {
    id: 1,
    fecha: '2024-08-01',
    desarrollador: 'Juan Pérez',
    proyecto: 'Sistema de Ventas',
    sprint: 'Sprint 1',
    storyPoints: 13,
    commits: 25,
    lineasCodigo: 450,
    horasTrabajadas: 8,
    bugsEncontrados: 2,
    bugsResueltos: 5,
    codeReviewTime: 1.5,
    codeCoverage: 85,
    cycleTime: 3,
    leadTime: 5,
    tiempoResolucionBugs: 2,
    featuresCompletados: 3,
    deploymentsExitosos: 2,
    deploymentsFallidos: 0,
    satisfaccionCliente: 4,
    satisfaccionEquipo: 4,
    comentarios: 'Sprint muy productivo',
    createdAt: new Date('2024-08-01').toISOString(),
    updatedAt: new Date('2024-08-01').toISOString(),
  },
  {
    id: 2,
    fecha: '2024-08-02',
    desarrollador: 'María García',
    proyecto: 'Portal Cliente',
    sprint: 'Sprint 1',
    storyPoints: 8,
    commits: 18,
    lineasCodigo: 320,
    horasTrabajadas: 7,
    bugsEncontrados: 1,
    bugsResueltos: 3,
    codeReviewTime: 1,
    codeCoverage: 92,
    cycleTime: 2,
    leadTime: 4,
    tiempoResolucionBugs: 1,
    featuresCompletados: 2,
    deploymentsExitosos: 3,
    deploymentsFallidos: 1,
    satisfaccionCliente: 5,
    satisfaccionEquipo: 4,
    comentarios: 'Excelente trabajo en el frontend',
    createdAt: new Date('2024-08-02').toISOString(),
    updatedAt: new Date('2024-08-02').toISOString(),
  },
  {
    id: 3,
    fecha: '2024-08-05',
    desarrollador: 'Carlos Rodriguez',
    proyecto: 'API Gateway',
    sprint: 'Sprint 2',
    storyPoints: 21,
    commits: 32,
    lineasCodigo: 680,
    horasTrabajadas: 8.5,
    bugsEncontrados: 3,
    bugsResueltos: 2,
    codeReviewTime: 2,
    codeCoverage: 78,
    cycleTime: 4,
    leadTime: 6,
    tiempoResolucionBugs: 3,
    featuresCompletados: 4,
    deploymentsExitosos: 1,
    deploymentsFallidos: 0,
    satisfaccionCliente: 3,
    satisfaccionEquipo: 4,
    comentarios: 'Trabajo complejo en microservicios',
    createdAt: new Date('2024-08-05').toISOString(),
    updatedAt: new Date('2024-08-05').toISOString(),
  }
];

let nextId = 4;

// Funciones para manejar los datos
export function getAllMetrics(): KpiMetric[] {
  return [...kpiMetrics];
}

export function getMetricById(id: number): KpiMetric | undefined {
  return kpiMetrics.find(m => m.id === id);
}

export function addMetric(metric: Omit<KpiMetric, 'id' | 'createdAt' | 'updatedAt'>): KpiMetric {
  const newMetric: KpiMetric = {
    ...metric,
    id: nextId++,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  kpiMetrics.push(newMetric);
  return newMetric;
}

export function updateMetric(id: number, updates: Partial<KpiMetric>): KpiMetric | null {
  const index = kpiMetrics.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  kpiMetrics[index] = {
    ...kpiMetrics[index],
    ...updates,
    id, // Mantener el ID original
    updatedAt: new Date().toISOString(),
  };
  
  return kpiMetrics[index];
}

export function deleteMetric(id: number): boolean {
  const index = kpiMetrics.findIndex(m => m.id === id);
  if (index === -1) return false;
  
  kpiMetrics.splice(index, 1);
  return true;
}
