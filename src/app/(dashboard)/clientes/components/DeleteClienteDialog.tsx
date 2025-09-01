"use client";

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteClienteMutation } from '@/store/services/clientes';
import { Cliente } from '@/store/types/cliPro';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
}

export function DeleteClienteDialog({ 
  open, 
  onOpenChange, 
  cliente 
}: DeleteClienteDialogProps) {
  const [deleteCliente, { isLoading }] = useDeleteClienteMutation();

  const handleDelete = async () => {
    if (!cliente) return;

    try {
      await deleteCliente(cliente.id).unwrap();
      toast.success('Cliente eliminado exitosamente');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error al eliminar cliente:', error);
      toast.error(
        error?.data?.message || 
        error?.message || 
        'Error al eliminar el cliente'
      );
    }
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>¿Estás seguro?</DialogTitle>
              <DialogDescription className="mt-1">
                Esta acción no se puede deshacer.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Se eliminará permanentemente el cliente{' '}
            <span className="font-semibold text-foreground">{cliente.nombre}</span>{' '}
            del sistema.
          </p>
        </div>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
