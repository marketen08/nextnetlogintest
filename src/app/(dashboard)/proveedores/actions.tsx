"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { CliPro } from "@/store/types/cliPro";
import { useState } from "react";
import { useDeleteCliProMutation } from "@/store/services/cliPro";
import { toast } from "sonner";
import { Icons } from "@/components/icons";

interface ProveedorActionsProps {
  proveedor: CliPro;
  onEdit: (proveedor: CliPro) => void;
  onRefresh?: () => void;
}

export function ProveedorActions({ proveedor, onEdit, onRefresh }: ProveedorActionsProps) {
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteProveedor, { isLoading: isDeleting }] = useDeleteCliProMutation();

  const handleView = () => {
    console.log("Ver proveedor:", proveedor.id);
    // Aquí podrías mostrar un modal de detalles o navegar a una página de detalles
    setOpen(false);
  };

  const handleEdit = () => {
    onEdit(proveedor);
    setOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProveedor(proveedor.id).unwrap();
      toast.success("Proveedor eliminado correctamente");
      onRefresh?.();
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      toast.error("Error al eliminar el proveedor");
    }
    setShowDeleteAlert(false);
  };

  const handleDelete = () => {
    setShowDeleteAlert(true);
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(proveedor.id.toString())}
          >
            Copiar ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600"
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog para confirmación de eliminación */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor{" "}
              <strong>{proveedor.razonSocial || proveedor.nombre}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Componente para acciones rápidas en línea
interface QuickActionsProps {
  proveedor: CliPro;
  onEdit: (proveedor: CliPro) => void;
  onRefresh?: () => void;
}

export function QuickActions({ proveedor, onEdit, onRefresh }: QuickActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => console.log("Ver", proveedor.id)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(proveedor)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <ProveedorActions proveedor={proveedor} onEdit={onEdit} onRefresh={onRefresh} />
    </div>
  );
}
