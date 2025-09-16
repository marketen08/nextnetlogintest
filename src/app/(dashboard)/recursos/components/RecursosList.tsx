"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { 
  useGetRecursosPagedQuery,
  useDeleteRecursoMutation 
} from "@/store/services/recursos";
import { Recurso } from "@/store/types/recurso";
import { RecursoForm } from "./RecursoForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RecursosList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Get user info for debugging
  const user = useSelector((state: RootState) => state.user);
  console.log('Current user:', user);

  const { data, isLoading, error } = useGetRecursosPagedQuery({ 
    page, 
    pageSize 
  });

  // Debug logging
  console.log('Recursos API call:', { data, isLoading, error });
  
  if (error) {
    console.error('Error details:', {
      status: (error as any)?.status,
      data: (error as any)?.data,
      error: (error as any)?.error
    });
  }
  
  const [deleteRecurso] = useDeleteRecursoMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteRecurso(id).unwrap();
    } catch (error) {
      console.error('Error deleting recurso:', error);
    }
  };

  const columns: ColumnDef<Recurso>[] = [
    {
      accessorKey: "legajo",
      header: "Legajo",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("legajo") || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "numeroDocumento",
      header: "Documento",
    },
    {
      accessorKey: "mailPersonal",
      header: "Email",
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.getValue("activo") ? "default" : "secondary"}>
          {row.getValue("activo") ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const recurso = row.original;
        return (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedRecurso(recurso);
                setIsEditOpen(true);
              }}
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:ml-2 sm:inline">Editar</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Eliminar</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente
                    el recurso {recurso.nombre} {recurso.apellido}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(recurso.id!)}
                    className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const filteredData = data?.data?.filter((recurso) =>
    `${recurso.nombre} ${recurso.apellido} ${recurso.numeroDocumento} ${recurso.mailPersonal || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  ) || [];

  if (error) {
    console.error('Error loading recursos:', error);
    const errorStatus = (error as any)?.status;
    const errorData = (error as any)?.data;
    
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error cargando recursos</p>
          <p className="text-sm text-muted-foreground">Status: {errorStatus}</p>
          {errorStatus === 403 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Error 403 - Forbidden:</strong> El usuario no tiene permisos para acceder a este recurso.
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                Roles requeridos: Admin o User
              </p>
              <p className="text-xs text-yellow-600">
                Roles actuales: {user.roles ? JSON.stringify(user.roles) : 'No definidos'}
              </p>
            </div>
          )}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-xs text-muted-foreground cursor-pointer">
                Ver detalles del error
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify({ error, user: { roles: user.roles, email: user.email } }, null, 2)}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recursos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gestión de recursos humanos
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Agregar Recurso</span>
              <span className="xs:hidden">Agregar</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Recurso</DialogTitle>
            </DialogHeader>
            <RecursoForm
              onSuccess={() => setIsCreateOpen(false)}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl">Lista de Recursos</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar recursos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            pagination={{
              page,
              pageSize,
              total: data?.total || 0,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>Editar Recurso</DialogTitle>
          </DialogHeader>
          {selectedRecurso && (
            <RecursoForm
              recurso={selectedRecurso}
              onSuccess={() => {
                setIsEditOpen(false);
                setSelectedRecurso(null);
              }}
              onCancel={() => {
                setIsEditOpen(false);
                setSelectedRecurso(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
