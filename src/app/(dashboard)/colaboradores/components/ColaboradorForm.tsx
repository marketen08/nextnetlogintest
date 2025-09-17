"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useCreateColaboradorMutation, 
  useUpdateColaboradorMutation 
} from "@/store/services/colaboradores";
import { useGetTiposDocumentosListQuery } from "@/store/services/tiposDocumentos";
import { Colaborador, ColaboradorRequest } from "@/store/types/colaborador";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const colaboradorSchema = z.object({
  numeroLegajo: z.string().optional(),
  apellido: z.string().min(1, "Apellido es requerido"),
  nombre: z.string().min(1, "Nombre es requerido"),
  tipoDocumento: z.string().optional(),
  numeroDocumento: z.string().min(1, "Número de documento es requerido"),
  cuit: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  sexo: z.string().optional(),
  estadoCivil: z.string().optional(),
  nacionalidad: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  celular: z.string().optional(),
  profileImageUrl: z.string().url("URL de imagen inválida").optional().or(z.literal("")),
  activo: z.boolean(),
  observaciones: z.string().optional(),
  // Agregar más campos según sea necesario
});

type ColaboradorFormData = z.infer<typeof colaboradorSchema>;

interface ColaboradorFormProps {
  colaborador?: Colaborador;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ColaboradorForm({ colaborador, onSuccess, onCancel }: ColaboradorFormProps) {
  const [createColaborador, { isLoading: isCreating }] = useCreateColaboradorMutation();
  const [updateColaborador, { isLoading: isUpdating }] = useUpdateColaboradorMutation();
  const { data: tiposDocumentos, isLoading: isLoadingTipos } = useGetTiposDocumentosListQuery();
  
  // Debug: Ver qué datos de colaborador estamos recibiendo
  console.log('Colaborador recibido:', colaborador);
  console.log('Fecha de nacimiento original:', colaborador?.fechaNacimiento);
  
  const [sectionsOpen, setSectionsOpen] = useState({
    personal: true,
    contact: false,
    work: false,
    documents: false,
    health: false,
    family: false,
    academic: false,
    other: false,
  });

  const isEditing = !!colaborador;
  const isSubmitting = isCreating || isUpdating;

  // Función para formatear fecha al formato requerido por input date (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const formatted = date.toISOString().split('T')[0];
      console.log('Formateo de fecha:', { original: dateString, formatted });
      return formatted;
    } catch {
      return "";
    }
  };

  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      numeroLegajo: colaborador?.legajo || "",
      apellido: colaborador?.apellido || "",
      nombre: colaborador?.nombre || "",
      tipoDocumento: colaborador?.tipoDocumentoId || "",
      numeroDocumento: colaborador?.numeroDocumento || "",
      cuit: colaborador?.cuil || "",
      fechaNacimiento: formatDateForInput(colaborador?.fechaNacimiento),
      sexo: colaborador?.sexo || "",
      estadoCivil: colaborador?.estadoCivil || "",
      nacionalidad: colaborador?.nacionalidad || "",
      email: colaborador?.mailPersonal || "",
      telefono: colaborador?.telefono || "",
      celular: colaborador?.celular || "",
      profileImageUrl: colaborador?.profileImageUrl || "",
      activo: colaborador?.activo ?? true,
      observaciones: colaborador?.observaciones || "",
    },
  });

  const onSubmit = async (data: ColaboradorFormData) => {
    try {
      // Buscar el nombre del tipo de documento
      const tipoDocumentoId = data.tipoDocumento || colaborador?.tipoDocumentoId || "";
      const tipoDocumento = tiposDocumentos?.data.find(tipo => tipo.id === tipoDocumentoId);
      
      const colaboradorData: Partial<ColaboradorRequest> = {
        legajo: data.numeroLegajo || colaborador?.legajo || "",
        apellido: data.apellido,
        nombre: data.nombre,
        tipoDocumentoId: tipoDocumentoId,
        tipoDocumentoNombre: tipoDocumento?.nombre || colaborador?.tipoDocumentoNombre || "",
        numeroDocumento: data.numeroDocumento,
        cuil: data.cuit || "",
        fechaNacimiento: data.fechaNacimiento || new Date().toISOString().split('T')[0],
        sexo: data.sexo || "",
        estadoCivil: data.estadoCivil || "",
        nacionalidad: data.nacionalidad || "",
        mailPersonal: data.email || "",
        telefono: data.telefono || "",
        celular: data.celular || "",
        profileImageUrl: data.profileImageUrl || "",
        activo: data.activo,
        observaciones: data.observaciones || "",
        // Campos requeridos con valores por defecto o del colaborador existente
        empresaId: colaborador?.empresaId || "default-empresa",
        empresaNombre: colaborador?.empresaNombre || "Empresa Default",
        empresaTrabajaId: colaborador?.empresaTrabajaId || "default-empresa-trabaja",
        empresaTrabajaNombre: colaborador?.empresaTrabajaNombre || "Empresa Trabaja Default",
        iniciales: `${data.nombre.charAt(0)}${data.apellido.charAt(0)}`,
        fechaIngreso: colaborador?.fechaIngreso || new Date().toISOString().split('T')[0],
        sectorId: colaborador?.sectorId || "default-sector",
        mailEmpresa: data.email || colaborador?.mailEmpresa || "",
        pasaporte: colaborador?.pasaporte || false,
        registro: colaborador?.registro || false,
        proyectoId: colaborador?.proyectoId || "default-proyecto",
        sucursalId: colaborador?.sucursalId || "default-sucursal",
        sucursalNombre: colaborador?.sucursalNombre || "Sucursal Default"
      };

      console.log('Datos que se van a enviar:', {
        isEditing,
        tipoDocumentoId: colaboradorData.tipoDocumentoId,
        tipoDocumentoNombre: colaboradorData.tipoDocumentoNombre,
        colaboradorData
      });

      if (isEditing && colaborador?.id) {
        await updateColaborador({ 
          id: colaborador.id, 
          data: colaboradorData 
        }).unwrap();
      } else {
        await createColaborador(colaboradorData as ColaboradorRequest).unwrap();
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving colaborador:', error);
    }
  };

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Sección Información Personal */}
      <Collapsible 
        open={sectionsOpen.personal} 
        onOpenChange={() => toggleSection('personal')}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                Información Personal
                {sectionsOpen.personal ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numeroLegajo">Número de Legajo</Label>
                  <Input
                    id="numeroLegajo"
                    {...form.register("numeroLegajo")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    {...form.register("apellido")}
                    className={form.formState.errors.apellido ? "border-red-500" : ""}
                  />
                  {form.formState.errors.apellido && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.apellido.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    {...form.register("nombre")}
                    className={form.formState.errors.nombre ? "border-red-500" : ""}
                  />
                  {form.formState.errors.nombre && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.nombre.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                  <Select
                    value={form.watch("tipoDocumento")}
                    onValueChange={(value) => form.setValue("tipoDocumento", value)}
                    disabled={isLoadingTipos}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingTipos ? "Cargando..." : "Seleccionar tipo de documento"} />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDocumentos?.data.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
                          {tipo.nombre} - {tipo.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                  <Input
                    id="numeroDocumento"
                    {...form.register("numeroDocumento")}
                    className={form.formState.errors.numeroDocumento ? "border-red-500" : ""}
                  />
                  {form.formState.errors.numeroDocumento && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.numeroDocumento.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuit">CUIT</Label>
                  <Input
                    id="cuit"
                    {...form.register("cuit")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    {...form.register("fechaNacimiento")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={form.watch("sexo")}
                    onValueChange={(value) => form.setValue("sexo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoCivil">Estado Civil</Label>
                  <Input
                    id="estadoCivil"
                    {...form.register("estadoCivil")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nacionalidad">Nacionalidad</Label>
                  <Input
                    id="nacionalidad"
                    {...form.register("nacionalidad")}
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sección Información de Contacto */}
      <Collapsible 
        open={sectionsOpen.contact} 
        onOpenChange={() => toggleSection('contact')}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                Información de Contacto
                {sectionsOpen.contact ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className={form.formState.errors.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    {...form.register("telefono")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    {...form.register("celular")}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <ImageUpload
                    currentImageUrl={form.watch("profileImageUrl")}
                    colaboradorId={colaborador?.id}
                    iniciales={`${form.watch("nombre")?.charAt(0) || ""}${form.watch("apellido")?.charAt(0) || ""}`}
                    onImageUploaded={(imageUrl) => {
                      console.log('Imagen subida:', imageUrl);
                      form.setValue("profileImageUrl", imageUrl);
                    }}
                  />
                  {/* Debug: Mostrar el valor actual */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-gray-500">
                      profileImageUrl: {form.watch("profileImageUrl") || "No asignada"}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Estado y Observaciones */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="activo"
              checked={form.watch("activo")}
              onCheckedChange={(checked) => form.setValue("activo", !!checked)}
            />
            <Label htmlFor="activo">Activo</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <textarea
              id="observaciones"
              {...form.register("observaciones")}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Observaciones adicionales..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting 
            ? (isEditing ? "Actualizando..." : "Creando...") 
            : (isEditing ? "Actualizar" : "Crear")
          }
        </Button>
      </div>
    </form>
  );
}