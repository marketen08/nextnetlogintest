"use client";

import React, { useState, useCallback, useRef } from "react";
import DataGrid, {
  Column,
  Editing,
  Lookup,
  ValidationRule,
  SearchPanel,
  Paging,
  FilterRow,
  HeaderFilter,
  Selection,
  Toolbar,
  Item,
  Export,
  StateStoring,
  Summary,
  TotalItem,
} from "devextreme-react/data-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CliPro } from "@/store/types/cliPro";
import { 
  Save, 
  X, 
  RotateCcw,
  Eye,
  Trash2,
  Edit3,
  Table2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateCliProMutation, useDeleteCliProMutation } from "@/store/services/cliPro";
import { toast } from "sonner";

// Importar estilos de DevExtreme
import "devextreme/dist/css/dx.light.css";
import "../devextreme-custom.css";

interface DevExpressBatchTableProps {
  data: CliPro[];
  onEdit: (proveedor: CliPro) => void;
  onView: (proveedor: CliPro) => void;
  onDelete: (proveedor: CliPro) => void;
  onRefresh: () => void;
}

export function DevExpressBatchTable({ 
  data, 
  onEdit, 
  onView, 
  onDelete, 
  onRefresh 
}: DevExpressBatchTableProps) {
  const [batchMode, setBatchMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const dataGridRef = useRef<any>(null);
  
  const [updateProveedor, { isLoading: isUpdating }] = useUpdateCliProMutation();
  const [deleteProveedor, { isLoading: isDeleting }] = useDeleteCliProMutation();

  // Opciones para los lookups
  const tipoDocOptions = [
    { value: "CUIT", text: "CUIT" },
    { value: "DNI", text: "DNI" },
  ];

  const condicionIVAOptions = [
    { value: "Responsable Inscripto", text: "Responsable Inscripto" },
    { value: "Monotributo", text: "Monotributo" },
    { value: "Exento", text: "Exento" },
    { value: "Consumidor Final", text: "Consumidor Final" },
  ];

  // Manejar cambios en el grid
  const handleRowUpdated = useCallback((e: any) => {
    if (!batchMode) {
      // Modo normal: guardar inmediatamente
      handleSingleUpdate(e.key, e.data);
    } else {
      // Modo batch: solo actualizar estado
      setHasChanges(true);
      setChangeCount(prev => prev + 1);
    }
  }, [batchMode]);

  const handleRowRemoved = useCallback(async (e: any) => {
    try {
      await deleteProveedor(e.key).unwrap();
      toast.success("Proveedor eliminado correctamente");
      onRefresh();
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      toast.error("Error al eliminar el proveedor");
      // Revertir el cambio en caso de error
      dataGridRef.current?.instance.refresh();
    }
  }, [deleteProveedor, onRefresh]);

  // Guardar un cambio individual (modo normal)
  const handleSingleUpdate = async (key: number, data: Partial<CliPro>) => {
    try {
      await updateProveedor({ id: key, data }).unwrap();
      toast.success("Proveedor actualizado correctamente");
      onRefresh();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      toast.error("Error al actualizar el proveedor");
      // Revertir el cambio en caso de error
      dataGridRef.current?.instance.refresh();
    }
  };

  // Guardar todos los cambios (modo batch)
  const handleSaveAllChanges = async () => {
    const instance = dataGridRef.current?.instance;
    if (!instance) return;

    try {
      const changes = instance.getDataSource().items().filter((item: any) => 
        item.__KEY__ !== item.id || instance.hasEditData()
      );

      // Obtener todos los cambios pendientes
      const editData = instance.option("editing.changes") || [];
      
      if (editData.length === 0) {
        toast.info("No hay cambios para guardar");
        return;
      }

      // Procesar cada cambio
      const promises = editData.map(async (change: any) => {
        if (change.type === "update") {
          return updateProveedor({ id: change.key, data: change.data }).unwrap();
        } else if (change.type === "remove") {
          return deleteProveedor(change.key).unwrap();
        }
        // Nota: Para "insert" necesitarías usar una mutación de creación
      });

      await Promise.all(promises);
      
      // Limpiar cambios y actualizar UI
      instance.saveEditData();
      setHasChanges(false);
      setChangeCount(0);
      toast.success(`${editData.length} cambio(s) guardado(s) correctamente`);
      onRefresh();
      
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al guardar algunos cambios");
    }
  };

  // Cancelar todos los cambios
  const handleCancelAllChanges = () => {
    const instance = dataGridRef.current?.instance;
    if (!instance) return;

    instance.cancelEditData();
    setHasChanges(false);
    setChangeCount(0);
    toast.info("Cambios cancelados");
  };

  // Alternar modo batch
  const toggleBatchMode = () => {
    if (hasChanges) {
      toast.warning("Guarda o cancela los cambios antes de cambiar de modo");
      return;
    }
    setBatchMode(!batchMode);
  };

  // Manejar cambios en tiempo real
  const handleDataChanged = useCallback(() => {
    if (batchMode) {
      const instance = dataGridRef.current?.instance;
      if (instance) {
        const changes = instance.option("editing.changes") || [];
        setHasChanges(changes.length > 0);
        setChangeCount(changes.length);
      }
    }
  }, [batchMode]);

  // Renderizar botones de acción personalizados
  const renderActionsCell = (cellData: any) => {
    const proveedor = cellData.data;
    
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onView(proveedor)}
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
        </Button>
        {!batchMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(proveedor)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant={batchMode ? "default" : "outline"} 
            onClick={toggleBatchMode}
            disabled={hasChanges}
            className={batchMode ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            {batchMode ? <Table2 className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}
            {batchMode ? "Modo Batch" : "Activar Batch"}
          </Button>
          
          {batchMode && hasChanges && (
            <Badge variant="destructive" className="bg-orange-100 text-orange-700 border-orange-300">
              {changeCount} cambio{changeCount !== 1 ? 's' : ''} pendiente{changeCount !== 1 ? 's' : ''}
            </Badge>
          )}
          
          {!batchMode && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Save className="w-3 h-3 mr-1" />
              Auto-guardado
            </Badge>
          )}
        </div>
        
        {batchMode && hasChanges && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelAllChanges}
              className="text-red-600 hover:text-red-700"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveAllChanges}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Todo
            </Button>
          </div>
        )}
      </div>

      {/* Información del modo */}
      <Card className={cn(
        "border-l-4",
        batchMode ? "border-l-orange-500 bg-orange-50/50" : "border-l-blue-500 bg-blue-50/50"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {batchMode ? (
              <>
                <Edit3 className="w-4 h-4 text-orange-600" />
                Modo Batch Edit Activo
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-blue-600" />
                Modo Auto-guardado
              </>
            )}
          </CardTitle>
          <CardDescription className="text-xs">
            {batchMode 
              ? "Los cambios se acumulan hasta hacer click en 'Guardar Todo'. Puedes editar múltiples filas y campos simultáneamente."
              : "Cada cambio se guarda automáticamente en la base de datos al confirmar la edición."
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* DevExtreme DataGrid */}
      <div className="rounded-md border bg-white">
        <DataGrid
          ref={dataGridRef}
          dataSource={data}
          keyExpr="id"
          showBorders={true}
          showRowLines={true}
          showColumnLines={false}
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          onRowUpdated={handleRowUpdated}
          onRowRemoved={handleRowRemoved}
          onOptionChanged={handleDataChanged}
          height={600}
        >
          {/* Configuración de edición */}
          <Editing
            mode={batchMode ? "batch" : "cell"}
            allowUpdating={true}
            allowDeleting={true}
            useIcons={true}
            confirmDelete={true}
            texts={{
              confirmDeleteMessage: "¿Estás seguro de que deseas eliminar este proveedor?",
              saveRowChanges: "Guardar",
              cancelRowChanges: "Cancelar",
              deleteRow: "Eliminar",
              undeleteRow: "Recuperar"
            }}
          />

          {/* Panel de búsqueda */}
          <SearchPanel 
            visible={true} 
            width={300} 
            placeholder="Buscar proveedores..." 
          />

          {/* Paginación */}
          <Paging 
            enabled={true} 
            pageSize={20}
          />

          {/* Filtros */}
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />

          {/* Selección */}
          <Selection mode="multiple" showCheckBoxesMode="always" />

          {/* Toolbar */}
          <Toolbar>
            <Item name="searchPanel" />
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
          </Toolbar>

          {/* Export */}
          <Export 
            enabled={true}
            allowExportSelectedData={true}
          />

          {/* State storing */}
          <StateStoring 
            enabled={true} 
            type="localStorage" 
            storageKey="proveedoresGrid"
          />

          {/* Summary */}
          <Summary>
            <TotalItem
              column="razonSocial"
              summaryType="count"
              displayFormat="Total: {0} proveedores"
            />
          </Summary>

          {/* Columnas */}
          <Column
            dataField="id"
            caption="ID"
            width={80}
            allowEditing={false}
            visible={false}
          />

          <Column
            dataField="razonSocial"
            caption="Razón Social"
            width={200}
          >
            <ValidationRule type="required" message="La razón social es requerida" />
          </Column>

          <Column
            dataField="nombre"
            caption="Nombre"
            width={150}
          >
            <ValidationRule type="required" message="El nombre es requerido" />
          </Column>

          <Column
            dataField="email"
            caption="Email"
            width={180}
          >
            <ValidationRule type="email" message="Formato de email inválido" />
          </Column>

          <Column
            dataField="telefono"
            caption="Teléfono"
            width={120}
          />

          <Column
            dataField="tipoDoc"
            caption="Tipo Doc"
            width={100}
          >
            <Lookup
              dataSource={tipoDocOptions}
              valueExpr="value"
              displayExpr="text"
            />
          </Column>

          <Column
            dataField="numero"
            caption="Número"
            width={120}
          />

          <Column
            dataField="condicionIVA"
            caption="Condición IVA"
            width={150}
          >
            <Lookup
              dataSource={condicionIVAOptions}
              valueExpr="value"
              displayExpr="text"
            />
          </Column>

          <Column
            dataField="domicilio"
            caption="Domicilio"
            width={200}
          />

          <Column
            dataField="localidad"
            caption="Localidad"
            width={120}
          />

          <Column
            dataField="provincia"
            caption="Provincia"
            width={120}
          />

          <Column
            dataField="codigoPostal"
            caption="Código Postal"
            width={100}
          />

          {/* Columna de acciones */}
          <Column
            caption="Acciones"
            width={100}
            allowSorting={false}
            allowFiltering={false}
            allowExporting={false}
            cellRender={renderActionsCell}
            allowEditing={false}
          />
        </DataGrid>
      </div>
    </div>
  );
}
