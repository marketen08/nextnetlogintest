import { State } from "@/lib/utils";

type TipoType = 'P' | 'C';
type TipoDocType = 'CUIT' | 'DNI';

type CliPro = {
    id: number,
    email: string,
    razonSocial: string,
    nombre: string,
    tipoDoc?: TipoDocType,
    numero?: string,
    condicionIVA?: string,
    domicilio?: string,
    localidad?: string,
    provincia?: string,
    codigoPostal?: string,
    telefono?: string,
    tipo: TipoType,
}

type CliProState = State<CliPro>;

type CliProDTO = {
    data: CliPro[]
}

// Nuevos tipos para clientes paginados
export interface Cliente {
  id: string;
  nombre: string;
  urlLogo: string;
  esContratista: boolean;
  createdAt: string;
  createdByNombre: string;
  updatedAt: string;
  updatedByNombre: string;
  isActive: boolean;
}

export interface PagedClientesResponse {
  data: Cliente[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ClientesQueryParams {
  page?: number;
  pagesize?: number;
  search?: string;
}

export interface CreateClienteRequest {
  nombre: string;
  urlLogo?: string;
  esContratista?: boolean;
}

export interface UpdateClienteRequest {
  id: string;
  nombre?: string;
  urlLogo?: string;
  esContratista?: boolean;
}

export type { CliPro, CliProDTO, CliProState, TipoDocType, TipoType }