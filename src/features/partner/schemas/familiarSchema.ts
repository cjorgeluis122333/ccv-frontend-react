import { z } from "zod";

export const familiarSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    cedula: z.string().max(9, "La cédula debe tener máximo 9 dígitos").optional().or(z.literal("")),
    carnet: z.string().min(1, "El carnet es requerido"),
    celular: z.string().min(10, "El celular requiere 10 dígitos").optional().or(z.literal("")),
    telefono: z.string().optional(),
    direccion: z.string().min(2, "El parentesco es requerido"), // Según la base de datos se usa campo "direccion" para el parentesco
    nacimiento: z.string().min(10, "La fecha debe tener formato YYYY-MM-DD"),
});

export type FamiliarFormValues = z.infer<typeof familiarSchema>;
