"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CliPro } from "@/store/types/cliPro";
import { 
  Edit3, 
  Save, 
  X, 
  RotateCcw,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateCliProMutation } from "@/store/services/cliPro";
import { toast } from "sonner";

interface EditableDataTableProps {
  data: CliPro[];
  onEdit: (proveedor: CliPro) => void;
  onView: (proveedor: CliPro) => void;
  onDelete: (proveedor: CliPro) => void;
  onRefresh: () => void;
}

interface EditingState {
  [key: string]: Partial<CliPro>;
}

// Componente para celda editable
interface EditableCellProps {
  value: any;
  row: Row<CliPro>;
  column: { id: string };
  table: any;
  type?: "text" | "select" | "email";
  options?: { value: string; label: string }[];
}

function EditableCell({ 
  value: initialValue, 
  row, 
  column, 
  table,
  type = "text",
  options = []
}: EditableCellProps) {
  const tableMeta = table.options.meta;
  const isEditing = tableMeta?.editingRows[row.id];
  
  if (!isEditing) {
    if (type === "select" && options.length > 0) {
      const option = options.find(opt => opt.value === initialValue);
      return <span className="px-2 py-1">{option?.label || initialValue || "-"}</span>;
    }
    return <span className="px-2 py-1">{initialValue || "-"}</span>;
  }

  const value = tableMeta?.editingData[row.id]?.[column.id] ?? initialValue;

  const onChange = (newValue: any) => {
    tableMeta?.updateData(row.id, column.id, newValue);
  };

  if (type === "select") {
    return (
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Seleccionar..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      type={type === "email" ? "email" : "text"}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 text-xs"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          tableMeta?.saveRow(row.id);
        } else if (e.key === "Escape") {
          tableMeta?.cancelEdit(row.id);
        }
      }}
    />
  );
}

export function EditableDataTable({ 
  data, 
  onEdit, 
  onView, 
  onDelete, 
  onRefresh 
}: EditableDataTableProps) {
  const [editingRows, setEditingRows] = useState<{ [key: string]: boolean }>({});
  const [editingData, setEditingData] = useState<EditingState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  
  const [updateProveedor, { isLoading: isUpdating }] = useUpdateCliProMutation();

  const startEdit = useCallback((rowId: string) => {
    // Esta función se definirá después de crear la tabla
    const rowData = data.find((_, index) => index.toString() === rowId);
    if (rowData) {
      setEditingRows(prev => ({ ...prev, [rowId]: true }));
      setEditingData(prev => ({ ...prev, [rowId]: { ...rowData } }));
    }
  }, [data]);

  const cancelEdit = useCallback((rowId: string) => {
    setEditingRows(prev => {
      const newState = { ...prev };
      delete newState[rowId];
      return newState;
    });
    setEditingData(prev => {
      const newState = { ...prev };
      delete newState[rowId];
      return newState;
    });
  }, []);

  const saveRow = useCallback(async (rowId: string) => {
    const rowData = data.find((_, index) => index.toString() === rowId);
    const updatedData = editingData[rowId];
    
    if (!updatedData || !rowData) return;

    try {
      const payload = {
        ...rowData,
        ...updatedData,
      };
      
      await updateProveedor({ id: rowData.id, data: payload }).unwrap();
      
      // Limpiar estado de edición
      setEditingRows(prev => {
        const newState = { ...prev };
        delete newState[rowId];
        return newState;
      });
      setEditingData(prev => {
        const newState = { ...prev };
        delete newState[rowId];
        return newState;
      });
      
      toast.success("Proveedor actualizado correctamente");
      onRefresh();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      toast.error("Error al actualizar el proveedor");
    }
  }, [editingData, updateProveedor, onRefresh, data]);

  // Opciones para los selects
  const tipoDocOptions = [
    { value: "CUIT", label: "CUIT" },
    { value: "DNI", label: "DNI" },
  ];

  const condicionIVAOptions = [
    { value: "Responsable Inscripto", label: "Responsable Inscripto" },
    { value: "Monotributo", label: "Monotributo" },
    { value: "Exento", label: "Exento" },
    { value: "Consumidor Final", label: "Consumidor Final" },
  ];

  const columns = useMemo<ColumnDef<CliPro>[]>(() => [
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const proveedor = row.original;
        const isEditing = editingRows[row.id];
        
        if (isEditing) {
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => saveRow(row.id)}
                disabled={isUpdating}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => cancelEdit(row.id)}
                disabled={isUpdating}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEdit(row.id)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(proveedor)}
              className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(proveedor)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "razonSocial",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Razón Social
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="text"
        />
      ),
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Nombre
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="text"
        />
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="email"
        />
      ),
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="text"
        />
      ),
    },
    {
      accessorKey: "tipoDoc",
      header: "Tipo Doc",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="select"
          options={tipoDocOptions}
        />
      ),
    },
    {
      accessorKey: "numero",
      header: "Número",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="text"
        />
      ),
    },
    {
      accessorKey: "condicionIVA",
      header: "Condición IVA",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="select"
          options={condicionIVAOptions}
        />
      ),
    },
    {
      accessorKey: "localidad",
      header: "Localidad",
      cell: ({ getValue, row, column, table }) => (
        <EditableCell
          value={getValue()}
          row={row}
          column={column}
          table={table}
          type="text"
        />
      ),
    },
  ], [editingRows, isUpdating, startEdit, saveRow, cancelEdit, onView, onDelete]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    meta: {
      editingRows,
      editingData,
      updateData: (rowId: string, columnId: string, value: any) => {
        setEditingData(prev => ({
          ...prev,
          [rowId]: {
            ...prev[rowId],
            [columnId]: value,
          },
        }));
      },
      saveRow: saveRow,
      cancelEdit: cancelEdit,
    },
  });

  const hasEditingRows = Object.keys(editingRows).length > 0;

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar proveedores..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          {hasEditingRows && (
            <Badge variant="secondary" className="ml-2">
              {Object.keys(editingRows).length} fila{Object.keys(editingRows).length !== 1 ? 's' : ''} en edición
            </Badge>
          )}
        </div>
        
        {hasEditingRows && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingRows({});
                setEditingData({});
              }}
              className="text-red-600 hover:text-red-700"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Cancelar todos
            </Button>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "hover:bg-muted/50",
                    editingRows[row.id] && "bg-blue-50 border-blue-200"
                  )}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Información de la tabla */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} de{" "}
          {table.getCoreRowModel().rows.length} fila(s) mostradas.
        </div>
      </div>
    </div>
  );
}
