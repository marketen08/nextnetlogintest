import { ColumnCallback, State } from "@/lib/utils";
import { Usuario } from "@/store/types/usuario";

type Turno = {
    id: string,
    description?: string,
    fechaHora: Date,
    box: number,
    choferId: number,
    chofer: Usuario
    done: boolean,
    uuid: string
}

type TurnoState = State<Turno>;

type TurnosDTO = {
    data: Turno[]
}

type TurnoDTO = {
    data: Turno
}

type TurnoColumn = ColumnCallback<Turno>;

export type { Turno, TurnoState, TurnoDTO, TurnosDTO, TurnoColumn }