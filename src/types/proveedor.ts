export interface Proveedor {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion?: string;
}
