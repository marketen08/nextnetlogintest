export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  pais?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

export interface ClienteListResponse {
  data: Cliente[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateClienteRequest {
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  pais?: string;
  activo?: boolean;
}

export interface UpdateClienteRequest extends CreateClienteRequest {
  id: string;
}
