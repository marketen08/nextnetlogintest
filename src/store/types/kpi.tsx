export interface KpiMetric {
  id: number;
  fecha: string;
  desarrollador: string;
  proyecto: string;
  sprint?: string;
  
  // Productividad
  storyPoints?: number;
  commits?: number;
  lineasCodigo?: number;
  horasTrabajadas?: number;
  
  // Calidad
  bugsEncontrados?: number;
  bugsResueltos?: number;
  codeReviewTime?: number; // en horas
  codeCoverage?: number; // porcentaje
  
  // Tiempo
  cycleTime?: number; // en días
  leadTime?: number; // en días
  tiempoResolucionBugs?: number; // en horas
  
  // Entregas
  featuresCompletados?: number;
  deploymentsExitosos?: number;
  deploymentsFallidos?: number;
  
  // Satisfacción (1-5)
  satisfaccionCliente?: number;
  satisfaccionEquipo?: number;
  
  // Metadata
  comentarios?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KpiSummary {
  periodo: string;
  totalStoryPoints: number;
  avgCodeCoverage: number;
  avgCycleTime: number;
  totalBugs: number;
  bugsResueltos: number;
  deploymentSuccessRate: number;
  avgSatisfaccionCliente: number;
  avgSatisfaccionEquipo: number;
  desarrolladoresActivos: number;
}

export interface DeveloperKpi {
  desarrollador: string;
  totalStoryPoints: number;
  avgCommitsPerDay: number;
  bugsCreados: number;
  bugsResueltos: number;
  avgCodeCoverage: number;
  avgCycleTime: number;
  deploymentsExitosos: number;
  satisfaccionPromedio: number;
}

export interface ProjectKpi {
  proyecto: string;
  totalStoryPoints: number;
  totalBugs: number;
  avgCycleTime: number;
  deploymentSuccessRate: number;
  teamSize: number;
  avgSatisfaccionCliente: number;
}
