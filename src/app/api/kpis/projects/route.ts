import { NextRequest, NextResponse } from 'next/server';
import { ProjectKpi } from '@/store/types/kpi';

// Datos de proyectos basados en los datos de ejemplo de las métricas
const mockProjectKpis: ProjectKpi[] = [
  {
    proyecto: "Sistema de Ventas",
    totalStoryPoints: 13,
    totalBugs: 7, // bugs encontrados + resueltos
    avgCycleTime: 3,
    deploymentSuccessRate: 100, // 2 exitosos, 0 fallidos
    teamSize: 1,
    avgSatisfaccionCliente: 4.0
  },
  {
    proyecto: "Portal Cliente", 
    totalStoryPoints: 8,
    totalBugs: 4,
    avgCycleTime: 2,
    deploymentSuccessRate: 75, // 3 exitosos, 1 fallido
    teamSize: 1,
    avgSatisfaccionCliente: 5.0
  },
  {
    proyecto: "API Gateway",
    totalStoryPoints: 21,
    totalBugs: 5,
    avgCycleTime: 4,
    deploymentSuccessRate: 100, // 1 exitoso, 0 fallidos
    teamSize: 1,
    avgSatisfaccionCliente: 3.0
  }
];

// GET /api/kpis/projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const proyecto = searchParams.get('proyecto');
    const limit = parseInt(searchParams.get('limit') || '10');

    let result = mockProjectKpis;

    if (proyecto) {
      result = result.filter(proj => 
        proj.proyecto.toLowerCase().includes(proyecto.toLowerCase())
      );
    }

    // Limitar resultados
    result = result.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al obtener KPIs de proyectos',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
