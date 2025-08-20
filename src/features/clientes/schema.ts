import { z } from "zod";

/** Helpers */
const optStr = z.string().optional().nullable();

/**
 * Equivalente a CliProBaseDTO tal como se serializa a JSON.
 * (Incluye `id`; `Tipo` está [JsonIgnore] y no forma parte del JSON.)
 */



export const cliProBaseSchema = z.object({
  id: z.number().int(),
  tipoDoc: optStr,
  numero: optStr,

  razonSocial: optStr,
  nombre: optStr,

  // OJO: en el DTO está escrito "CodicionIVA"
  CodicionIVA: optStr,

  domicilio: optStr,
  localidad: optStr,
  provincia: optStr,
  codigoPostal: optStr,
  telefono: optStr,

  email: z.string().email().optional().nullable(),
}).strict();

export const cliProRespuestaSchema = z.object({
  data: z.array(cliProBaseSchema),
});

/**
 * Equivalente a CliProPostDTO:
 * - Requiere: razonSocial, nombre, email, tipo
 * - Acepta opcionales heredados del base
 * - NO permite `id` en el body (strict)
 */
export const cliProPostSchema = z.object({
  razonSocial: z.string().trim().min(1, "razonSocial es requerido"),
  nombre: z.string().trim().min(1, "nombre es requerido"),
  email: z.string().trim().email("email inválido"),

  // Regex "^(C|P)$"
  tipo: z.enum(["C", "P"], {
    error: "tipo debe ser 'C' o 'P'",
  }),

  // Opcionales del base:
  tipoDoc: optStr,
  numero: optStr,
  CodicionIVA: optStr,
  domicilio: optStr,
  localidad: optStr,
  provincia: optStr,
  codigoPostal: optStr,
  telefono: optStr,
}).strict();

/**
 * Equivalente a CliProPutDTO:
 * - Requiere: razonSocial, nombre, email
 * - NO incluye `tipo` (en el base está [JsonIgnore] y no se redefine aquí)
 * - NO permite `id` en el body (strict)
 */
export const cliProPutSchema = z.object({
  razonSocial: z.string().trim().min(1, "razonSocial es requerido"),
  nombre: z.string().trim().min(1, "nombre es requerido"),
  email: z.string().trim().email("email inválido"),

  // Opcionales del base:
  tipoDoc: optStr,
  numero: optStr,
  CodicionIVA: optStr,
  domicilio: optStr,
  localidad: optStr,
  provincia: optStr,
  codigoPostal: optStr,
  telefono: optStr,
}).strict();

export const tipoCliProSchema = z.enum(["C", "P"], {
  error: "tipo debe ser 'C' o 'P'",
});

// (Opcional) Tipos inferidos
export type CliProBase = z.infer<typeof cliProBaseSchema>;
export type CliProRespuesta = z.infer<typeof cliProRespuestaSchema>;
export type CliProPost = z.infer<typeof cliProPostSchema>;
export type CliProPut = z.infer<typeof cliProPutSchema>;
export type TipoCliPro = z.infer<typeof tipoCliProSchema>;
