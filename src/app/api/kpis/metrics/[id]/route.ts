import { NextRequest, NextResponse } from 'next/server';
import { getMetricById, updateMetric, deleteMetric } from '../../storage';

// GET /api/kpis/metrics/[id] - Obtener métrica específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const metric = getMetricById(id);

    if (!metric) {
      return NextResponse.json({
        success: false,
        message: 'Métrica no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: metric
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al obtener métrica',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/kpis/metrics/[id] - Actualizar métrica
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const updatedMetric = updateMetric(id, body);

    if (!updatedMetric) {
      return NextResponse.json({
        success: false,
        message: 'Métrica no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedMetric,
      message: 'Métrica actualizada exitosamente'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al actualizar métrica',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/kpis/metrics/[id] - Eliminar métrica
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const success = deleteMetric(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Métrica no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Métrica eliminada exitosamente'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al eliminar métrica',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
