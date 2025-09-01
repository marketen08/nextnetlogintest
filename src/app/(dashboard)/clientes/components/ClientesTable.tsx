"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cliente } from '@/store/types/cliPro';
import { Edit, Trash2, Users } from 'lucide-react';

interface ClientesTableProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

export function ClientesTable({ clientes, onEdit, onDelete }: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No se encontraron clientes</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Logo</TableHead>
          <TableHead>Es Contratista</TableHead>
          <TableHead>Fecha Creación</TableHead>
          <TableHead>Fecha Modificación</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">
              {cliente.nombre}
            </TableCell>
            <TableCell>
              {cliente.urlLogo ? (
                <img 
                  src={cliente.urlLogo} 
                  alt={cliente.nombre}
                  className="h-8 w-8 rounded object-cover"
                />
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              <Badge variant={cliente.esContratista ? 'default' : 'secondary'}>
                {cliente.esContratista ? 'Sí' : 'No'}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(cliente.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(cliente.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit(cliente)}
                  title="Editar cliente"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDelete(cliente)}
                  title="Eliminar cliente"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
