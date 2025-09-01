"use client";

import { withAuth } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ClienteDialog, DeleteClienteDialog, ClientesTable } from './components';
import { 
  useGetClientesPagedQuery 
} from '@/store/services/clientes';
import { Cliente } from '@/store/types/cliPro';
import { useState } from 'react';
import { 
  Search,
  Plus,
  Users,
  RefreshCw,
  Filter
} from 'lucide-react';

function ClientesPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  
  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  const { 
    data: clientesResponse, 
    isLoading, 
    error, 
    refetch 
  } = useGetClientesPagedQuery({
    page: currentPage,
    pagesize: pageSize,
    search: search.trim() || undefined,
  });

  const clientes = clientesResponse?.data || [];
  const total = clientesResponse?.total || 0;
  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = clientesResponse?.hasNextPage || false;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCreateCliente = () => {
    setSelectedCliente(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteCliente = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="space-y-3 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">Error al cargar los clientes</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona la lista de clientes del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={handleCreateCliente}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Página Actual</p>
                <p className="text-2xl font-bold">{currentPage} de {totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Search className="h-4 w-4 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resultados</p>
                <p className="text-2xl font-bold">{clientes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar cliente</label>
              <Input
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            <ClientesTable
              clientes={clientes}
              onEdit={handleEditCliente}
              onDelete={handleDeleteCliente}
            />
          </div>
          
          {search && clientes.length === 0 && (
            <div className="text-center py-4">
              <Button 
                variant="outline" 
                onClick={() => setSearch('')}
              >
                Limpiar búsqueda
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, total)} de {total} clientes
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Cliente Dialog */}
      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={selectedCliente}
        mode={dialogMode}
      />

      {/* Delete Cliente Dialog */}
      <DeleteClienteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        cliente={clienteToDelete}
      />
    </div>
  );
}

export default withAuth(ClientesPage);
