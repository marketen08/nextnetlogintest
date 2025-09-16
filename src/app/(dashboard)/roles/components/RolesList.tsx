"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Shield, Users } from 'lucide-react';

import { useGetRolesQuery } from '@/store/services/roles';
import { Role } from '@/store/types/roles';
import { CreateRoleDialog } from './CreateRoleDialog';

export function RolesList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { 
    data: rolesData, 
    isLoading, 
    error,
    refetch 
  } = useGetRolesQuery();

  const roles = rolesData?.roles || [];

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre del Rol',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{role.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'normalizedName',
      header: 'Nombre Normalizado',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <Badge variant="outline" className="font-mono text-xs">
            {role.normalizedName}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        const role = row.original;
        return (
          <span className="text-xs text-muted-foreground font-mono">
            {role.id}
          </span>
        );
      },
    },
  ];

  const handleCreateSuccess = () => {
    refetch(); // Refrescar la lista de roles
  };

  if (error) {
    console.error('Error loading roles:', error);
    const errorStatus = (error as any)?.status;
    
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error cargando roles</p>
          <p className="text-sm text-muted-foreground">Status: {errorStatus}</p>
          {errorStatus === 403 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Error 403 - Forbidden:</strong> No tienes permisos para acceder a los roles.
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                Solo los administradores pueden gestionar roles.
              </p>
            </div>
          )}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Ver detalles del error
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Gestión de Roles
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Administra los roles del sistema y asígnalos a usuarios
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden xs:inline">Crear Rol</span>
          <span className="xs:hidden">Crear</span>
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              Roles definidos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              Todos los roles están activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">✓</div>
            <p className="text-xs text-muted-foreground">
              Sistema funcionando correctamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de roles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Roles del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <DataTable
            columns={columns}
            data={roles}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Dialog para crear rol */}
      <CreateRoleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}