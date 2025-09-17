import { api } from "./api";
import { TiposDocumentosListResponse } from "../types/tipoDocumento";

export const tiposDocumentosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTiposDocumentosList: builder.query<TiposDocumentosListResponse, void>({
      query: () => ({
        url: "/tiposdocumentos/list",
        method: "GET",
      }),
      providesTags: ["TipoDocumento"],
    }),
  }),
});

export const {
  useGetTiposDocumentosListQuery,
} = tiposDocumentosApi;