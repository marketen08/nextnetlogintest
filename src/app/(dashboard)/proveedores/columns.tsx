"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CliPro } from "@/store/types/cliPro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ProveedorActions } from "./actions";

export const columns: ColumnDef<CliPro>[] = [
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
    accessorKey: "cuit",
    header: "CUIT/DNI",
    cell: ({ row }) => {
      const cuit = row.getValue("cuit") as string;
      return cuit ? (
        <div className="text-sm font-mono">{cuit}</div>
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
      return <ProveedorActions proveedor={proveedor} />;
    },
  },
];
