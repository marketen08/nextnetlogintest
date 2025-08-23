import { NextRequest, NextResponse } from 'next/server';
import { KpiSummary } from '@/store/types/kpi';

// Datos de resumen calculados desde las métricas reales
const mockSummary: KpiSummary = {
  periodo: '2024-08',
  totalStoryPoints: 42, // Suma de los story points de los datos de ejemplo
  avgCodeCoverage: 85.0, // Promedio del coverage
  avgCycleTime: 3.0, // Promedio del cycle time
  totalBugs: 6, // Total bugs encontrados
  bugsResueltos: 10, // Total bugs resueltos
  deploymentSuccessRate: 85.7, // Porcentaje de deployments exitosos
  avgSatisfaccionCliente: 4.0, // Promedio satisfacción cliente
  avgSatisfaccionEquipo: 4.0, // Promedio satisfacción equipo
  desarrolladoresActivos: 3 // Número de desarrolladores con datos
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
