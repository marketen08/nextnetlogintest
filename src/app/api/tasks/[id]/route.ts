import { NextRequest, NextResponse } from 'next/server';
import { updateTask, deleteTask, getTaskById } from '../storage';

// GET /api/tasks/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de tarea inválido'
      }, { status: 400 });
    }

    const task = getTaskById(id);
    if (!task) {
      return NextResponse.json({
        success: false,
        message: 'Tarea no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: task
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al obtener tarea',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/tasks/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de tarea inválido'
      }, { status: 400 });
    }

    const body = await request.json();
    const updatedTask = updateTask(id, body);
    
    if (!updatedTask) {
      return NextResponse.json({
        success: false,
        message: 'Tarea no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: 'Tarea actualizada exitosamente'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'ID de tarea inválido'
      }, { status: 400 });
    }

    const deleted = deleteTask(id);
    if (!deleted) {
      return NextResponse.json({
        success: false,
        message: 'Tarea no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
