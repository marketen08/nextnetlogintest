"use client";

import { withAuth } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, RefreshCw } from 'lucide-react';
import { DataTable } from './components/data-table';
import { columns } from './columns';
import { CliPro } from '@/store/types/cliPro';
import { useGetCliProQuery } from '@/store/services/cliPro';

function ProveedoresPage() {
  // Obtener proveedores de la API con tipo "P"
  const { 
    data: cliProData, 
    error, 
    isLoading,
    refetch 
  } = useGetCliProQuery({ tipo: 'P' });

  // Convertir los datos de la API al formato esperado por la tabla
  const proveedores: CliPro[] = cliProData?.data?.map((item: any) => ({
    id: item.id?.toString() || '',
    nombre: item.razonSocial || item.nombre || 'Sin nombre',
    razonSocial: item.razonSocial || '', // Agregado para cumplir con CliPro
    tipo: item.tipo || 'P', // Agregado para cumplir con CliPro, por defecto 'P'
    email: item.email || undefined,
    telefono: item.telefono || undefined,
    direccion: item.domicilio || undefined,
    cuit: item.numero || undefined, // El número del documento (CUIT/DNI)
    activo: true, // Por defecto activo, ya que la API no tiene este campo
    fechaCreacion: new Date().toISOString(), // La API no tiene este campo
    fechaActualizacion: undefined,
  })) || [];

  const handleNuevoProveedor = () => {
    console.log("Crear nuevo proveedor");
    // Aquí podrías navegar a una página de creación o abrir un modal
  };

  const handleImportar = () => {
    console.log("Importar proveedores");
    // Aquí podrías abrir un modal de importación
  };

  const handleExportar = () => {
    console.log("Exportar proveedores");
    // Aquí podrías generar un archivo Excel/CSV
  };

  const handleRefresh = () => {
    refetch();
  };

  // Mostrar error si hay problemas con la API
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error al cargar proveedores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {error && 'data' in error 
                  ? `Error: ${(error as any).data?.message || 'Error desconocido'}`
                  : 'Error al conectar con el servidor'}
              </p>
              <div className="flex gap-2">
                <Button onClick={handleRefresh}>
                  Reintentar
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Recargar página
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Cargando proveedores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona todos los proveedores de tu empresa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline" onClick={handleImportar}>
            Importar
          </Button>
          <Button variant="outline" onClick={handleExportar}>
            Exportar
          </Button>
          <Button onClick={handleNuevoProveedor}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proveedor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proveedores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proveedores.length}</div>
            <p className="text-xs text-muted-foreground">
              En el sistema
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Proveedores Activos
            </CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proveedores.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponibles para pedidos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Con Email
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proveedores.filter(p => p.email).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tienen email registrado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de proveedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos los proveedores registrados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={proveedores}
            searchPlaceholder="Buscar por nombre..."
            searchKey="nombre"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(ProveedoresPage);
