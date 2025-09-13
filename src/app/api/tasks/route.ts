import { NextRequest, NextResponse } from 'next/server';
import { Task, TaskStatus } from '@/store/types/task';
import { getAllTasks, addTask } from './storage';

// GET /api/tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const desarrollador = searchParams.get('desarrollador');
    const proyecto = searchParams.get('proyecto');
    const estado = searchParams.get('estado') as TaskStatus;
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    let filteredTasks = getAllTasks();

    // Aplicar filtros
    if (desarrollador) {
      filteredTasks = filteredTasks.filter((t: Task) => t.desarrollador === desarrollador);
    }
    if (proyecto) {
      filteredTasks = filteredTasks.filter((t: Task) => t.proyecto === proyecto);
    }
    if (estado) {
      filteredTasks = filteredTasks.filter((t: Task) => t.estado === estado);
    }
    if (fechaInicio) {
      filteredTasks = filteredTasks.filter((t: Task) => t.fecha >= fechaInicio);
    }
    if (fechaFin) {
      filteredTasks = filteredTasks.filter((t: Task) => t.fecha <= fechaFin);
    }

    return NextResponse.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al obtener tareas',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validaciones básicas
    if (!body.fecha || !body.estado || !body.desarrollador || !body.proyecto) {
      return NextResponse.json({
        success: false,
        message: 'Campos requeridos: fecha, estado, desarrollador, proyecto'
      }, { status: 400 });
    }

    const newTask = addTask(body);
    
    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Tarea creada exitosamente'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al crear tarea',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
