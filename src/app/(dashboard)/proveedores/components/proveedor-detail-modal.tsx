"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CliPro } from "@/store/types/cliPro";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard, 
  FileText,
  Copy,
  Edit
} from "lucide-react";
import { toast } from "sonner";

interface ProveedorDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proveedor: CliPro | null;
  onEdit?: (proveedor: CliPro) => void;
}

export function ProveedorDetailModal({
  open,
  onOpenChange,
  proveedor,
  onEdit,
}: ProveedorDetailModalProps) {
  if (!proveedor) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(proveedor.id.toString());
    toast.success("ID copiado al portapapeles");
  };

  const handleEdit = () => {
    if (onEdit) {
      // Primero cerramos el modal de detalles
      onOpenChange(false);
      // Luego, después de un pequeño delay para permitir que se cierre,
      // abrimos el modal de edición
      setTimeout(() => {
        onEdit(proveedor);
      }, 100);
    }
  };

  const InfoItem = ({ 
    icon: Icon, 
    label, 
    value, 
    copyable = false 
  }: { 
    icon: any, 
    label: string, 
    value?: string, 
    copyable?: boolean 
  }) => (
    <div className="flex items-center space-x-3">
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm truncate">
            {value || <span className="text-muted-foreground">No especificado</span>}
          </p>
          {copyable && value && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                navigator.clipboard.writeText(value);
                toast.success(`${label} copiado al portapapeles`);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl">
                {proveedor.razonSocial || proveedor.nombre}
              </DialogTitle>
              <DialogDescription>
                Información detallada del proveedor
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="cursor-pointer" onClick={handleCopyId}>
                ID: {proveedor.id}
              </Badge>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={Building2}
                  label="Razón Social"
                  value={proveedor.razonSocial}
                  copyable
                />
                <InfoItem
                  icon={User}
                  label="Nombre"
                  value={proveedor.nombre}
                  copyable
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={proveedor.email}
                  copyable
                />
                <InfoItem
                  icon={Phone}
                  label="Teléfono"
                  value={proveedor.telefono}
                  copyable
                />
              </div>
            </CardContent>
          </Card>

          {/* Información Fiscal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={CreditCard}
                  label="Tipo de Documento"
                  value={proveedor.tipoDoc}
                />
                <InfoItem
                  icon={CreditCard}
                  label="Número de Documento"
                  value={proveedor.numero}
                  copyable
                />
              </div>
              
              <InfoItem
                icon={FileText}
                label="Condición IVA"
                value={proveedor.condicionIVA}
              />
            </CardContent>
          </Card>

          {/* Información de Ubicación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={MapPin}
                label="Domicilio"
                value={proveedor.domicilio}
                copyable
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoItem
                  icon={MapPin}
                  label="Localidad"
                  value={proveedor.localidad}
                />
                <InfoItem
                  icon={MapPin}
                  label="Provincia"
                  value={proveedor.provincia}
                />
                <InfoItem
                  icon={MapPin}
                  label="Código Postal"
                  value={proveedor.codigoPostal}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <Badge variant="outline">
                      {proveedor.tipo === 'P' ? 'Proveedor' : 'Cliente'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID del Sistema</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {proveedor.id}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleCopyId}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
