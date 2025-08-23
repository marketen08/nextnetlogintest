import { NextRequest, NextResponse } from 'next/server';
import { KpiSummary } from '@/store/types/kpi';

// Mock data para el resumen - en producción calcularías esto desde la DB
const mockSummary: KpiSummary = {
  periodo: '2024-08',
  totalStoryPoints: 420,
  avgCodeCoverage: 87.5,
  avgCycleTime: 4.2,
  totalBugs: 23,
  bugsResueltos: 20,
  deploymentSuccessRate: 92.3,
  avgSatisfaccionCliente: 4.3,
  avgSatisfaccionEquipo: 4.1,
  desarrolladoresActivos: 8
};

// GET /api/kpis/summary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'mes';
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    // Aquí calcularías el resumen real desde tus métricas
    // Por ahora devolvemos datos mock
    
    return NextResponse.json({
      success: true,
      data: {
        ...mockSummary,
        periodo: `${periodo}-actual`
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al obtener resumen de KPIs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
