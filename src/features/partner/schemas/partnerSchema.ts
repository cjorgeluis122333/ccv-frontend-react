import {z} from "zod";

export const partnerSchema = z.object({
    acc: z.coerce.number("Debe ser un número").int(),
    cedula: z.string(),
    carnet: z.string().min(1, {message: "El carnet es requerido"}),
    nombre: z.string().min(1, {message: "El nombre es requerido."}),
    celular: z.string(),
    telefono: z.string(),
    correo: z.string().min(1, {message: "El email es requerido"}),
    direccion: z.string(),
    nacimiento: z.date(),
    ingreso: z.string(),
    ocupacion: z.string(),
    cobrador: z.string(),
});



// El tipo de los datos de los inputs (strings/unknown que el form maneja)
export type PartnerFormInputs = z.input<typeof partnerSchema>;

// El tipo de los datos YA validados (con números)
export type PartnerFormValues = z.output<typeof partnerSchema>;  //When the date are validated
