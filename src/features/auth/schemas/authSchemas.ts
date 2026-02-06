import { z } from 'zod';

export const loginSchema = z.object({
    acc: z.string().min(1, "El número de acción es requerido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
    acc: z.coerce.number().int().min(1, { message: "Acción requerida" }),
    cedula: z.coerce.number().int().min(1000, { message: "Cédula inválida" }),
    correo: z.string()
        .email({ message: "Correo inválido" }) // ✅ correcto
        .transform((s) => s.toLowerCase()),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    password_confirmation: z.string(),
}).refine(
    (data) => data.password === data.password_confirmation,
    {
        message: "Las contraseñas no coinciden",
        path: ["password_confirmation"],
    }
);
