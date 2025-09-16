"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AlertError } from '@/components/alerts';
import { useCreateRoleMutation } from '@/store/services/roles';

const createRoleSchema = z.object({
  roleName: z
    .string()
    .min(1, 'El nombre del rol es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras y espacios'),
});

type CreateRoleForm = z.infer<typeof createRoleSchema>;

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateRoleDialogProps) {
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateRoleForm>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      roleName: '',
    },
  });

  const onSubmit = async (data: CreateRoleForm) => {
    setError(null);
    try {
      const result = await createRole(data).unwrap();
      
      if (result.success) {
        form.reset();
        onSuccess?.();
        onOpenChange(false);
      } else {
        setError(result.message || 'Error al crear el rol');
      }
    } catch (err: any) {
      console.error('Error creating role:', err);
      setError(
        err?.data?.message || 
        err?.message || 
        'Error inesperado al crear el rol'
      );
    }
  };

  const handleCancel = () => {
    form.reset();
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Rol</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Rol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Manager, Supervisor..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertError error={error || undefined} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear Rol'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}