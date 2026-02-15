import {z} from 'zod';

export const registerSchema = z.object({
    // Coerce convierte el string a número.
    // .min(1) atrapa el 0 (string vacío convertido).
    acc: z.coerce.number("Debe ser un número").int()
        .min(1, {message: "El número de acción es requerido"}),

    cedula: z.coerce.number("Debe ser un número")
        .int()
        .min(1000, {message: "Cédula inválida"}),

    correo: z.string()
        .min(1, {message: "El correo es requerido"})
        .email({message: "Formato de correo inválido"})
        .toLowerCase(), // Transformación automática a minúsculas

    password: z.string().min(6, {message: "Mínimo 6 caracteres"}),

    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
});

// El tipo de los datos de los inputs (strings/unknown que el form maneja)
export type RegisterFormInputs = z.input<typeof registerSchema>;

// El tipo de los datos YA validados (con números)
export type RegisterFormValues = z.output<typeof registerSchema>;  //When the date are validated
