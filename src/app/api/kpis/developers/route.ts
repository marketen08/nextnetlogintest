import { NextRequest, NextResponse } from 'next/server';
import { DeveloperKpi } from '@/store/types/kpi';

// Datos de desarrolladores basados en los datos de ejemplo de las métricas
const mockDeveloperKpis: DeveloperKpi[] = [
  {
    desarrollador: "Juan Pérez",
    totalStoryPoints: 13,
    avgCommitsPerDay: 25,
    bugsCreados: 2,
    bugsResueltos: 5,
    avgCodeCoverage: 85,
    avgCycleTime: 3,
    deploymentsExitosos: 2,
    satisfaccionPromedio: 4.0
  },
  {
    desarrollador: "María García", 
    totalStoryPoints: 8,
    avgCommitsPerDay: 18,
    bugsCreados: 1,
    bugsResueltos: 3,
    avgCodeCoverage: 92,
    avgCycleTime: 2,
    deploymentsExitosos: 3,
    satisfaccionPromedio: 4.5
  },
  {
    desarrollador: "Carlos Rodriguez",
    totalStoryPoints: 21,
    avgCommitsPerDay: 32,
    bugsCreados: 3,
    bugsResueltos: 2,
    avgCodeCoverage: 78,
    avgCycleTime: 4,
    deploymentsExitosos: 1,
    satisfaccionPromedio: 3.5
  }
];

// GET /api/kpis/developers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const desarrollador = searchParams.get('desarrollador');
    const limit = parseInt(searchParams.get('limit') || '10');

    let result = mockDeveloperKpis;

    if (desarrollador) {
      result = result.filter(dev => 
        dev.desarrollador.toLowerCase().includes(desarrollador.toLowerCase())
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
      message: 'Error al obtener KPIs de desarrolladores',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
