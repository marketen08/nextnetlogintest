"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import * as z from "zod";
import { useAddTaskMutation, useUpdateTaskMutation } from "@/store/services/tasks";
import { Task, TaskStatus } from "@/store/types/task";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

const taskStates: { value: TaskStatus; label: string }[] = [
  { value: 'TASKLIST', label: 'Task List' },
  { value: 'TODO', label: 'To Do' },
  { value: 'DOING', label: 'Doing' },
  { value: 'DONE', label: 'Done' },
  { value: 'DONE_BACKUP', label: 'Done (Backup)' },
];

const formSchema = z.object({
  fecha: z.date(),
  estado: z.enum(['TASKLIST', 'TODO', 'DOING', 'DONE', 'DONE_BACKUP']),
  desarrollador: z.string().min(1, "El desarrollador es requerido"),
  proyecto: z.string().min(1, "El proyecto es requerido"),
  sprint: z.string().optional(),
  storyPoints: z.number().min(0).optional(),
  horasEstimadas: z.number().min(0).optional(),
  
  // Campos para tareas completadas
  horasTrabajadas: z.number().min(0).optional(),
  satisfaccionEquipo: z.number().min(1).max(5).optional(),
  comentarios: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSuccess?: () => void;
}

export function TaskForm({ open, onOpenChange, task, onSuccess }: TaskFormProps) {
  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  
  const isLoading = isAdding || isUpdating;
  const isEditing = !!task;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: new Date(),
      estado: 'TASKLIST',
      desarrollador: '',
      proyecto: '',
      sprint: '',
      storyPoints: undefined,
      horasEstimadas: undefined,
      horasTrabajadas: undefined,
      satisfaccionEquipo: undefined,
      comentarios: '',
    },
  });

  const watchedEstado = form.watch('estado');
  const isCompleted = ['DONE', 'DONE_BACKUP'].includes(watchedEstado);

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      form.reset({
        fecha: new Date(task.fecha),
        estado: task.estado,
        desarrollador: task.desarrollador,
        proyecto: task.proyecto,
        sprint: task.sprint || '',
        storyPoints: task.storyPoints,
        horasEstimadas: task.horasEstimadas,
        horasTrabajadas: task.horasTrabajadas,
        satisfaccionEquipo: task.satisfaccionEquipo,
        comentarios: task.comentarios || '',
      });
    } else {
      form.reset({
        fecha: new Date(),
        estado: 'TASKLIST',
        desarrollador: '',
        proyecto: '',
        sprint: '',
        storyPoints: undefined,
        horasEstimadas: undefined,
        horasTrabajadas: undefined,
        satisfaccionEquipo: undefined,
        comentarios: '',
      });
    }
  }, [task, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        fecha: format(data.fecha, 'yyyy-MM-dd'),
        // Solo incluir campos de finalización si el estado es DONE o DONE_BACKUP
        horasTrabajadas: isCompleted ? data.horasTrabajadas : undefined,
        satisfaccionEquipo: isCompleted ? data.satisfaccionEquipo : undefined,
        comentarios: isCompleted ? data.comentarios : undefined,
      };

      if (isEditing) {
        await updateTask({ 
          id: task.id, 
          ...formattedData 
        }).unwrap();
        toast.success('Tarea actualizada exitosamente');
      } else {
        await addTask(formattedData).unwrap();
        toast.success('Tarea creada exitosamente');
      }
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al guardar tarea:', error);
      toast.error(error?.data?.message || 'Error al guardar la tarea');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los datos de la tarea'
              : 'Completa los datos para registrar una nueva tarea'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Fecha */}
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado */}
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {taskStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Desarrollador */}
              <FormField
                control={form.control}
                name="desarrollador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desarrollador</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del desarrollador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proyecto */}
              <FormField
                control={form.control}
                name="proyecto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proyecto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del proyecto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sprint */}
              <FormField
                control={form.control}
                name="sprint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprint (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ej. Sprint 23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Story Points */}
              <FormField
                control={form.control}
                name="storyPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Points</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Horas Estimadas */}
              <FormField
                control={form.control}
                name="horasEstimadas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas Estimadas</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos para tareas completadas */}
            {isCompleted && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Horas Trabajadas */}
                  <FormField
                    control={form.control}
                    name="horasTrabajadas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horas Trabajadas *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Satisfacción del Equipo */}
                  <FormField
                    control={form.control}
                    name="satisfaccionEquipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Satisfacción del Equipo (1-5) *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar satisfacción" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Muy Insatisfecho</SelectItem>
                            <SelectItem value="2">2 - Insatisfecho</SelectItem>
                            <SelectItem value="3">3 - Neutral</SelectItem>
                            <SelectItem value="4">4 - Satisfecho</SelectItem>
                            <SelectItem value="5">5 - Muy Satisfecho</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Comentarios */}
                <FormField
                  control={form.control}
                  name="comentarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentarios</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Comentarios sobre la tarea completada..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? (isEditing ? 'Actualizando...' : 'Guardando...') : (isEditing ? 'Actualizar' : 'Guardar')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
