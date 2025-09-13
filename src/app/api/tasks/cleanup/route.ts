import { NextResponse } from 'next/server';
import { cleanInvalidTasks } from '../storage';

// POST /api/tasks/cleanup - Limpiar tareas con estados inválidos
export async function POST() {
  try {
    const result = cleanInvalidTasks();
    
    return NextResponse.json({
      success: true,
      message: `Se corrigieron ${result.fixed} tareas con estados inválidos`,
      data: {
        fixed: result.fixed,
        totalTasks: result.tasks.length
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al limpiar tareas',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/tasks/cleanup - Obtener información sobre tareas con problemas
export async function GET() {
  try {
    const validStates = ['TASKLIST', 'TODO', 'DOING', 'DONE', 'DONE_BACKUP'];
    const { getAllTasks } = await import('../storage');
    const allTasks = getAllTasks();
    
    const invalidTasks = allTasks.filter(task => 
      !validStates.includes(task.estado) || task.estado === undefined
    );
    
    return NextResponse.json({
      success: true,
      data: {
        totalTasks: allTasks.length,
        invalidTasks: invalidTasks.length,
        invalidTasksDetails: invalidTasks.map(t => ({
          id: t.id,
          desarrollador: t.desarrollador,
          proyecto: t.proyecto,
          estado: t.estado
        }))
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al verificar tareas',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
