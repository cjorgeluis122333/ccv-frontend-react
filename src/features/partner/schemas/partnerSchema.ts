import { z } from "zod";

export const partnerSchema = z.object({
    acc: z.number().int(),
    cedula: z.string().min(5, "La cédula debe tener al menos 5 caracteres"),
    carnet: z.string().min(1, "El carnet es requerido"),
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    celular: z.string().min(10, "El celular debe tener 10 dígitos"),
    telefono: z.string().optional().or(z.literal('')), // Permite string vacío o string
    correo: z.string().email().or(z.literal('')).nullable(),
    direccion: z.string().min(5, "La dirección es muy corta"),
    nacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
    ingreso: z.string().min(1, "La fecha de ingreso es requerida"),
    ocupacion: z.string().min(1, "La ocupación es requerida"),
    cobrador: z.number().min(1, "El cobrador es requerido"),
});

// Extraemos el tipo automáticamente del esquema
export type PartnerFormValues = z.infer<typeof partnerSchema>;