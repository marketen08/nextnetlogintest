import { ColumnCallback, State } from "@/lib/utils";

type Cubierta = {
    id: number,
    codigo: string,
    marca?: string,
    modelo?: string,
    medida?: string,
    banda: number,
    vehiculoId?: string,
    posicion?: number
}

type CubiertaState = State<Cubierta>;

type CubiertasDTO = {
    data: Cubierta[]
}

type CubiertaColumn = ColumnCallback<Cubierta>;

type CubiertaAssign = {
    cubiertaId: number,
    posicion: number
}

type CubiertaAssignDTO = {
    vehiculoId: string,
    cubiertas: CubiertaAssign[]
}

export type {
    Cubierta,
    CubiertasDTO,
    CubiertaState,
    CubiertaColumn,
    CubiertaAssign,
    CubiertaAssignDTO
}