export interface TipoDocumento {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface TiposDocumentosListResponse {
  data: TipoDocumento[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}