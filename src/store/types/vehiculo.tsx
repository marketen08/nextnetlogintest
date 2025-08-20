import { ColumnCallback, State } from "@/lib/utils";
import { Cubierta } from "@/store/types/cubierta";

type VehiculoType = 'T' | 'S' | 'E';

type Vehiculo = {
    id: string,
    codigo: string,
    marca: string,
    anio: number,
    patente: string,
    tipoEquipoMovimiento?: string,
    energia?: string,  
    tipo: VehiculoType,
    cubiertas: Cubierta[] | null,
}

type VehiculoState = State<Vehiculo>;

type VehiculosDTO = {
    data: Vehiculo[]
}

type VehiculoDTO = {
    data: Vehiculo
}

type VehiculoColumn = ColumnCallback<Vehiculo>;

export type { VehiculoType, Vehiculo, VehiculoState, VehiculoDTO, VehiculosDTO, VehiculoColumn }