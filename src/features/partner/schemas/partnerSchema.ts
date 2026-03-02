import { z } from "zod";

export const partnerSchema = z.object({
    acc: z.coerce.number().int("Debe ser un número entero"),
    cedula: z.string().min(5, "La cédula debe tener al menos 5 caracteres"),
    carnet: z.string().min(1, "El carnet es requerido"),
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

    celular: z.string()
        .min(10, "El celular debe tener 10 dígitos (ej. 0912345678)"),
    telefono: z.string().optional(),

    correo: z.string().optional(),

    direccion: z.string().min(5, "La dirección es muy corta"),

    // En inputs type="date", el valor local es un string "YYYY-MM-DD"
    // Para editar de lado de React Hook Form, es más fácil manejarlo como string.
    nacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
    ingreso: z.string().min(1, "La fecha de ingreso es requerida"),

    ocupacion: z.string().min(1, "La ocupación es requerida"),
    cobrador: z.coerce.number().int().min(1, "El cobrador es requerido"),
});

export interface PartnerFormInputs extends z.input<typeof partnerSchema> { }
export interface PartnerFormValues extends z.output<typeof partnerSchema> { }
