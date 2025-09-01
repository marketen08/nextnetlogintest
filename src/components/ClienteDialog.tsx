"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  useCreateClienteMutation,
  useUpdateClienteMutation
} from '@/store/services/clientes';
import { Cliente } from '@/store/types/cliPro';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente | null;
  mode: 'create' | 'edit';
}

export function ClienteDialog({ 
  open, 
  onOpenChange, 
  cliente, 
  mode 
}: ClienteDialogProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    urlLogo: '',
    esContratista: false,
  });

  const [createCliente, { isLoading: isCreating }] = useCreateClienteMutation();
  const [updateCliente, { isLoading: isUpdating }] = useUpdateClienteMutation();

  const isLoading = isCreating || isUpdating;

  // Reset form when dialog opens/closes or cliente changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && cliente) {
        setFormData({
          nombre: cliente.nombre || '',
          urlLogo: cliente.urlLogo || '',
          esContratista: cliente.esContratista || false,
        });
      } else {
        setFormData({
          nombre: '',
          urlLogo: '',
          esContratista: false,
        });
      }
    }
  }, [open, cliente, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    try {
      if (mode === 'create') {
        await createCliente({
          nombre: formData.nombre.trim(),
          urlLogo: formData.urlLogo.trim() || undefined,
          esContratista: formData.esContratista,
        }).unwrap();
        toast.success('Cliente creado exitosamente');
      } else if (mode === 'edit' && cliente) {
        await updateCliente({
          id: cliente.id,
          nombre: formData.nombre.trim(),
          urlLogo: formData.urlLogo.trim() || undefined,
          esContratista: formData.esContratista,
        }).unwrap();
        toast.success('Cliente actualizado exitosamente');
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error al guardar cliente:', error);
      toast.error(
        error?.data?.message || 
        error?.message || 
        `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el cliente`
      );
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' 
                ? 'Completa los datos para crear un nuevo cliente.' 
                : 'Modifica los datos del cliente.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="col-span-3"
                placeholder="Nombre del cliente"
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="urlLogo" className="text-right">
                URL Logo
              </Label>
              <Input
                id="urlLogo"
                value={formData.urlLogo}
                onChange={(e) => handleInputChange('urlLogo', e.target.value)}
                className="col-span-3"
                placeholder="URL del logo (opcional)"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="esContratista" className="text-right">
                Es Contratista
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="esContratista"
                  checked={formData.esContratista}
                  onCheckedChange={(checked) => 
                    handleInputChange('esContratista', checked === true)
                  }
                  disabled={isLoading}
                />
                <Label 
                  htmlFor="esContratista" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Marcar como contratista
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
