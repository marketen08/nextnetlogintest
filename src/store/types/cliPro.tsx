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

export type { CliPro, CliProDTO, CliProState, TipoDocType, TipoType }