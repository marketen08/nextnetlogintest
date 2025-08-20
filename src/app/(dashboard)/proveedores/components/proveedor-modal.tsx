"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { useAddCliProMutation, useUpdateCliProMutation } from "@/store/services/cliPro";
import { CliPro } from "@/store/types/cliPro";
import { toast } from "sonner";

const formSchema = z.object({
  razonSocial: z.string().min(1, "La razón social es requerida"),
  nombre: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  tipoDoc: z.enum(["CUIT", "DNI"]).optional(),
  numero: z.string().optional(),
  condicionIVA: z.string().optional(),
  domicilio: z.string().optional(),
  localidad: z.string().optional(),
  provincia: z.string().optional(),
  codigoPostal: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProveedorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor?: CliPro | null;
  onSuccess?: () => void;
}

export function ProveedorModal({
  open,
  onOpenChange,
  proveedor = null,
  onSuccess,
}: ProveedorModalProps) {
  const isEditing = !!proveedor;
  
  const [addProveedor, { isLoading: isAdding }] = useAddCliProMutation();
  const [updateProveedor, { isLoading: isUpdating }] = useUpdateCliProMutation();
  
  const isLoading = isAdding || isUpdating;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      razonSocial: proveedor?.razonSocial || "",
      nombre: proveedor?.nombre || "",
      email: proveedor?.email || "",
      telefono: proveedor?.telefono || "",
      tipoDoc: proveedor?.tipoDoc || "CUIT",
      numero: proveedor?.numero || "",
      condicionIVA: proveedor?.condicionIVA || "",
      domicilio: proveedor?.domicilio || "",
      localidad: proveedor?.localidad || "",
      provincia: proveedor?.provincia || "",
      codigoPostal: proveedor?.codigoPostal || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        tipo: 'P' as const,
        email: data.email || undefined,
        telefono: data.telefono || undefined,
        tipoDoc: data.tipoDoc || undefined,
        numero: data.numero || undefined,
        condicionIVA: data.condicionIVA || undefined,
        domicilio: data.domicilio || undefined,
        localidad: data.localidad || undefined,
        provincia: data.provincia || undefined,
        codigoPostal: data.codigoPostal || undefined,
      };

      if (isEditing && proveedor) {
        await updateProveedor({
          id: proveedor.id,
          ...payload,
        }).unwrap();
        toast.success("Proveedor actualizado correctamente");
      } else {
        await addProveedor(payload).unwrap();
        toast.success("Proveedor creado correctamente");
      }

      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      toast.error(
        isEditing 
          ? "Error al actualizar el proveedor" 
          : "Error al crear el proveedor"
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los datos del proveedor seleccionado." 
              : "Completa los datos para crear un nuevo proveedor."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Razón Social */}
              <FormField
                control={form.control}
                name="razonSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razón Social *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Distribuidora SRL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Nombre */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Teléfono */}
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: +54 11 1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tipo de Documento */}
              <FormField
                control={form.control}
                name="tipoDoc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CUIT">CUIT</SelectItem>
                        <SelectItem value="DNI">DNI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Número de Documento */}
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Documento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 20-12345678-9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Condición IVA */}
              <FormField
                control={form.control}
                name="condicionIVA"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Condición IVA</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Responsable Inscripto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Domicilio */}
              <FormField
                control={form.control}
                name="domicilio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Domicilio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Av. Corrientes 1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Localidad */}
              <FormField
                control={form.control}
                name="localidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: CABA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Provincia */}
              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Buenos Aires" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Código Postal */}
              <FormField
                control={form.control}
                name="codigoPostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código Postal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: C1010AAA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
