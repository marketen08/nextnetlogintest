import { NextRequest, NextResponse } from 'next/server';
import { getTaskStats } from '../storage';

// GET /api/tasks/stats
export async function GET(request: NextRequest) {
  try {
    const stats = getTaskStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al obtener estadísticas de tareas',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
