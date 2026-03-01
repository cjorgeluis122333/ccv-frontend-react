import {z} from "zod";

export const familiarSchema = z.object({
    nombre: z.string().min(1, {message: "El nombre es requerido."}),
    cedula: z.string(),
    carnet: z.string().min(1, {message: "El carnet es requerido"}),
    celular: z.string(),
    telefono: z.string(),
    direccion: z.string().min(1, {message: "El parentesco con el socio es requerido."}),
    nacimiento: z.date(),
});

export type FamiliarFormValues = z.infer<typeof familiarSchema>;
