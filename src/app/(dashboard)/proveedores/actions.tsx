"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { CliPro } from "@/store/types/cliPro";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProveedorActionsProps {
  proveedor: CliPro;
}

export function ProveedorActions({ proveedor }: ProveedorActionsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleView = () => {
    console.log("Ver proveedor:", proveedor.id);
    // router.push(`/proveedores/${proveedor.id}`);
    setOpen(false);
  };

  const handleEdit = () => {
    console.log("Editar proveedor:", proveedor.id);
    // router.push(`/proveedores/${proveedor.id}/edit`);
    setOpen(false);
  };

  const handleDelete = () => {
    console.log("Eliminar proveedor:", proveedor.id);
    // Aquí podrías abrir un modal de confirmación
    setOpen(false);
  };

  return (
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
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente para acciones rápidas en línea
interface QuickActionsProps {
  proveedor: CliPro;
}

export function QuickActions({ proveedor }: QuickActionsProps) {
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
        onClick={() => console.log("Editar", proveedor.id)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <ProveedorActions proveedor={proveedor} />
    </div>
  );
}
