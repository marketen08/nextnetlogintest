"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import * as z from "zod";
import { useAddKpiMetricMutation } from "@/store/services/kpis";
import { KpiMetric } from "@/store/types/kpi";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fecha: z.date(),
  desarrollador: z.string().min(1, "El desarrollador es requerido"),
  proyecto: z.string().min(1, "El proyecto es requerido"),
  sprint: z.string().optional(),
  
  // Productividad
  storyPoints: z.number().min(0).optional(),
  commits: z.number().min(0).optional(),
  lineasCodigo: z.number().min(0).optional(),
  horasTrabajadas: z.number().min(0).max(24).optional(),
  
  // Calidad
  bugsEncontrados: z.number().min(0).optional(),
  bugsResueltos: z.number().min(0).optional(),
  codeReviewTime: z.number().min(0).optional(),
  codeCoverage: z.number().min(0).max(100).optional(),
  
  // Tiempo
  cycleTime: z.number().min(0).optional(),
  leadTime: z.number().min(0).optional(),
  tiempoResolucionBugs: z.number().min(0).optional(),
  
  // Entregas
  featuresCompletados: z.number().min(0).optional(),
  deploymentsExitosos: z.number().min(0).optional(),
  deploymentsFallidos: z.number().min(0).optional(),
  
  // Satisfacción
  satisfaccionCliente: z.number().min(1).max(5).optional(),
  satisfaccionEquipo: z.number().min(1).max(5).optional(),
  
  comentarios: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface KpiFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function KpiForm({ open, onOpenChange, onSuccess }: KpiFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addKpiMetric] = useAddKpiMetricMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: new Date(),
      desarrollador: "",
      proyecto: "",
      sprint: "",
    },
  });

  // Lista de desarrolladores (esto podría venir de una API)
  const desarrolladores = [
    "Juan Pérez",
    "María García", 
    "Carlos Rodriguez",
    "Ana López",
    "Pedro Martínez",
    "Laura González",
    "Diego Fernández",
    "Sofía Torres"
  ];

  // Lista de proyectos
  const proyectos = [
    "Sistema de Ventas",
    "Portal Cliente",
    "API Gateway",
    "Dashboard Analytics",
    "Mobile App",
    "Sistema ERP",
    "Plataforma E-commerce",
    "Sistema de Inventario"
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Convertir los datos del formulario al formato de la API
      const kpiMetric: KpiMetric = {
        id: Date.now(),
        fecha: format(data.fecha, 'yyyy-MM-dd'),
        desarrollador: data.desarrollador,
        proyecto: data.proyecto,
        sprint: data.sprint,
        
        // Productividad
        storyPoints: data.storyPoints,
        commits: data.commits,
        lineasCodigo: data.lineasCodigo,
        horasTrabajadas: data.horasTrabajadas,
        
        // Calidad
        bugsEncontrados: data.bugsEncontrados,
        bugsResueltos: data.bugsResueltos,
        codeReviewTime: data.codeReviewTime,
        codeCoverage: data.codeCoverage,
        
        // Tiempo
        cycleTime: data.cycleTime,
        leadTime: data.leadTime,
        tiempoResolucionBugs: data.tiempoResolucionBugs,
        
        // Entregas
        featuresCompletados: data.featuresCompletados,
        deploymentsExitosos: data.deploymentsExitosos,
        deploymentsFallidos: data.deploymentsFallidos,
        
        // Satisfacción
        satisfaccionCliente: data.satisfaccionCliente,
        satisfaccionEquipo: data.satisfaccionEquipo,
        
        // Metadata
        comentarios: data.comentarios,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Llamar a la API para guardar los datos
      await addKpiMetric(kpiMetric).unwrap();
      
      toast.success("Métricas registradas correctamente");
      onSuccess?.();
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar métricas:", error);
      toast.error("Error al guardar las métricas");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Métricas KPI</DialogTitle>
          <DialogDescription>
            Captura las métricas de rendimiento del equipo de desarrollo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecciona una fecha</span>
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

              <FormField
                control={form.control}
                name="desarrollador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desarrollador</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona desarrollador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {desarrolladores.map((dev) => (
                          <SelectItem key={dev} value={dev}>
                            {dev}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="proyecto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proyecto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona proyecto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {proyectos.map((proyecto) => (
                          <SelectItem key={proyecto} value={proyecto}>
                            {proyecto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sprint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sprint (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="ej: Sprint 2024-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Métricas en Tabs */}
            <Tabs defaultValue="productividad" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="productividad">Productividad</TabsTrigger>
                <TabsTrigger value="calidad">Calidad</TabsTrigger>
                <TabsTrigger value="entregas">Entregas</TabsTrigger>
                <TabsTrigger value="satisfaccion">Satisfacción</TabsTrigger>
              </TabsList>

              <TabsContent value="productividad" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commits</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lineasCodigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Líneas de Código</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horasTrabajadas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horas Trabajadas</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.5"
                            min="0"
                            max="24"
                            placeholder="8"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="calidad" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bugsEncontrados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bugs Encontrados</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bugsResueltos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bugs Resueltos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="codeCoverage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code Coverage (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            max="100"
                            placeholder="85"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="codeReviewTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code Review Time (horas)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.5"
                            placeholder="2"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="entregas" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="featuresCompletados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features Completados</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deploymentsExitosos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deployments Exitosos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deploymentsFallidos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deployments Fallidos</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cycleTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cycle Time (días)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.5"
                            placeholder="3.5"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="satisfaccion" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="satisfaccionCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Satisfacción Cliente (1-5)</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona calificación" />
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

                  <FormField
                    control={form.control}
                    name="satisfaccionEquipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Satisfacción Equipo (1-5)</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona calificación" />
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

                <FormField
                  control={form.control}
                  name="comentarios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comentarios</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observaciones, notas adicionales..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Botones */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Guardando..." : "Guardar Métricas"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
