"use client";

import { withAuth } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, RefreshCw, Table2, Edit3, Grid3X3 } from 'lucide-react';
import { DataTable } from './components/data-table';
import { EditableDataTable } from './components/editable-data-table';
import { DevExpressBatchTable } from './components/devexpress-batch-table';
import { createColumns } from './columns';
import { ProveedorModal } from './components/proveedor-modal';
import { ProveedorDetailModal } from './components/proveedor-detail-modal';
import { CliPro } from '@/store/types/cliPro';
import { useGetCliProQuery, useDeleteCliProMutation } from '@/store/services/cliPro';
import { useState } from 'react';
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
import { toast } from "sonner";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

function ProveedoresPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState<CliPro | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<CliPro | null>(null);
  const [editMode, setEditMode] = useState(false); // Toggle entre vista normal y editable
  const [devExpressMode, setDevExpressMode] = useState(false); // Modo DevExpress batch
  
  // Obtener proveedores de la API con tipo "P"
  const { 
    data: cliProData, 
    error, 
    isLoading,
    refetch 
  } = useGetCliProQuery({ tipo: 'P' });

  const [deleteProveedor, { isLoading: isDeleting }] = useDeleteCliProMutation();

  // Los proveedores ya vienen en el formato correcto de CliPro
  const proveedores: CliPro[] = cliProData?.data || [];

  const handleNuevoProveedor = () => {
    setSelectedProveedor(null);
    setModalOpen(true);
  };

  const handleEditProveedor = (proveedor: CliPro) => {
    setSelectedProveedor(proveedor);
    setModalOpen(true);
  };

  const handleViewProveedor = (proveedor: CliPro) => {
    setSelectedProveedor(proveedor);
    setShowDetailModal(true);
  };

  const handleDeleteProveedor = (proveedor: CliPro) => {
    setProveedorToDelete(proveedor);
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = async () => {
    if (!proveedorToDelete) return;

    try {
      await deleteProveedor(proveedorToDelete.id).unwrap();
      toast.success("Proveedor eliminado correctamente");
      refetch();
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      toast.error("Error al eliminar el proveedor");
    } finally {
      setShowDeleteAlert(false);
      setProveedorToDelete(null);
    }
  };

  const handleModalSuccess = () => {
    refetch(); // Refrescar la lista después de crear/editar
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

  // Crear columnas con las funciones necesarias
  const columns = createColumns({
    onEdit: handleEditProveedor,
    onRefresh: refetch,
  });

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
          <Button 
            variant={editMode ? "default" : "outline"} 
            onClick={() => {
              if (devExpressMode) setDevExpressMode(false);
              setEditMode(!editMode);
            }}
            className={editMode ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {editMode ? <Table2 className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
            {editMode ? "Vista Normal" : "Modo Edición"}
          </Button>
          <Button 
            variant={devExpressMode ? "default" : "outline"} 
            onClick={() => {
              if (editMode) setEditMode(false);
              setDevExpressMode(!devExpressMode);
            }}
            className={devExpressMode ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            {devExpressMode ? <Grid3X3 className="mr-2 h-4 w-4" /> : <Grid3X3 className="mr-2 h-4 w-4" />}
            {devExpressMode ? "DevExpress ON" : "DevExpress Batch"}
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Lista de Proveedores
                {editMode && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Modo Edición
                  </Badge>
                )}
                {devExpressMode && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    <Grid3X3 className="w-3 h-3 mr-1" />
                    DevExpress Batch
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {devExpressMode 
                  ? "Tabla profesional con batch editing. Acumula cambios y guárdalos todos de una vez."
                  : editMode 
                    ? "Click en las celdas para editar. Usa Enter para guardar o Escape para cancelar."
                    : "Visualiza y gestiona todos los proveedores registrados en el sistema."
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {devExpressMode ? (
            <DevExpressBatchTable
              data={proveedores}
              onEdit={handleEditProveedor}
              onView={handleViewProveedor}
              onDelete={handleDeleteProveedor}
              onRefresh={refetch}
            />
          ) : editMode ? (
            <EditableDataTable
              data={proveedores}
              onEdit={handleEditProveedor}
              onView={handleViewProveedor}
              onDelete={handleDeleteProveedor}
              onRefresh={refetch}
            />
          ) : (
            <DataTable 
              columns={columns} 
              data={proveedores}
              searchPlaceholder="Buscar por razón social..."
              searchKey="razonSocial"
            />
          )}
        </CardContent>
      </Card>

      {/* Modal para crear/editar proveedor */}
      <ProveedorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        proveedor={selectedProveedor}
        onSuccess={handleModalSuccess}
      />

      {/* Modal de detalles del proveedor */}
      <ProveedorDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        proveedor={selectedProveedor}
        onEdit={handleEditProveedor}
      />

      {/* Alert Dialog para confirmación de eliminación */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proveedor{" "}
              <strong>{proveedorToDelete?.razonSocial || proveedorToDelete?.nombre}</strong> y todos sus datos asociados.
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
    </div>
  );
}

export default withAuth(ProveedoresPage);
