import { NextRequest, NextResponse } from 'next/server';
import { DeveloperKpi } from '@/store/types/kpi';

// Mock data para desarrolladores - en producción calcularías esto desde la DB
const mockDeveloperKpis: DeveloperKpi[] = [
  {
    desarrollador: "Juan Pérez",
    totalStoryPoints: 125,
    avgCommitsPerDay: 3.2,
    bugsCreados: 2,
    bugsResueltos: 8,
    avgCodeCoverage: 94.2,
    avgCycleTime: 3.1,
    deploymentsExitosos: 15,
    satisfaccionPromedio: 4.5
  },
  {
    desarrollador: "María García", 
    totalStoryPoints: 138,
    avgCommitsPerDay: 4.1,
    bugsCreados: 1,
    bugsResueltos: 12,
    avgCodeCoverage: 96.8,
    avgCycleTime: 2.8,
    deploymentsExitosos: 18,
    satisfaccionPromedio: 4.7
  },
  {
    desarrollador: "Carlos Rodriguez",
    totalStoryPoints: 119,
    avgCommitsPerDay: 2.9,
    bugsCreados: 3,
    bugsResueltos: 7,
    avgCodeCoverage: 89.3,
    avgCycleTime: 4.2,
    deploymentsExitosos: 13,
    satisfaccionPromedio: 4.2
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
