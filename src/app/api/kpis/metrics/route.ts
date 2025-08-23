import { NextRequest, NextResponse } from 'next/server';
import { KpiMetric } from '@/store/types/kpi';

// Simulación de base de datos en memoria (en producción usarías una DB real)
let kpiMetrics: KpiMetric[] = [];
let nextId = 1;

// GET /api/kpis/metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const desarrollador = searchParams.get('desarrollador');
    const proyecto = searchParams.get('proyecto');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    let filteredMetrics = kpiMetrics;

    // Aplicar filtros
    if (desarrollador) {
      filteredMetrics = filteredMetrics.filter(m => m.desarrollador === desarrollador);
    }
    if (proyecto) {
      filteredMetrics = filteredMetrics.filter(m => m.proyecto === proyecto);
    }
    if (fechaInicio) {
      filteredMetrics = filteredMetrics.filter(m => m.fecha >= fechaInicio);
    }
    if (fechaFin) {
      filteredMetrics = filteredMetrics.filter(m => m.fecha <= fechaFin);
    }

    return NextResponse.json({
      success: true,
      data: filteredMetrics,
      total: filteredMetrics.length
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al obtener métricas KPI',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/kpis/metrics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newMetric: KpiMetric = {
      ...body,
      id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    kpiMetrics.push(newMetric);

    return NextResponse.json({
      success: true,
      data: newMetric,
      message: 'Métrica KPI creada exitosamente'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al crear métrica KPI',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
