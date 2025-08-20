"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CliPro } from "@/store/types/cliPro";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ProveedorActions } from "./actions";

interface ColumnsProps {
  onEdit: (proveedor: CliPro) => void;
  onRefresh?: () => void;
}

export const createColumns = ({ onEdit, onRefresh }: ColumnsProps): ColumnDef<CliPro>[] => [
  {
    accessorKey: "razonSocial",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Razón Social
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("razonSocial")}
        </div>
      );
    },
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 p-0 hover:bg-transparent"
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("nombre")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return email ? (
        <div className="text-sm">{email}</div>
      ) : (
        <div className="text-sm text-muted-foreground">-</div>
      );
    },
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
    cell: ({ row }) => {
      const telefono = row.getValue("telefono") as string;
      return telefono ? (
        <div className="text-sm">{telefono}</div>
      ) : (
        <div className="text-sm text-muted-foreground">-</div>
      );
    },
  },
  {
    accessorKey: "numero",
    header: "CUIT/DNI",
    cell: ({ row }) => {
      const numero = row.getValue("numero") as string;
      return numero ? (
        <div className="text-sm font-mono">{numero}</div>
      ) : (
        <div className="text-sm text-muted-foreground">-</div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const proveedor = row.original;
      return <ProveedorActions proveedor={proveedor} onEdit={onEdit} onRefresh={onRefresh} />;
    },
  },
];
