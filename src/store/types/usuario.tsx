import { State } from "@/lib/utils";
import { Vehiculo } from "@/store/types/vehiculo";

type UsuarioType = 'Admin'| 'Administrativo' | 'Chofer' | 'Mecanico' | 'Panol';

type Usuario = {
    id: number,
    nombre: string,
    apellido: string,
    nombreCompleto: string, // Computed property
    tipoDocumento: string,
    numeroDocumento: number,
    fechaIngreso?: Date,
    legajo: string,
    telefono?: string,
    especialidad: string, // Para tipo mec�nico
    role: UsuarioType, // 'Admin'| 'Administrativo' | 'Chofer' | 'Mecanico' | 'Panol';
    tractor?: Vehiculo,
    tractorId?: number,
    semi?: Vehiculo,
    semiId?: number,
    email: string,
    password?: string
}

type UsuarioState = State<Usuario>;

type UsuariosDTO = {
    data: Usuario[]
}

export type { UsuarioType, Usuario, UsuarioState, UsuariosDTO }