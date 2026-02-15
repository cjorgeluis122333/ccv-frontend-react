import { z } from 'zod';

export const loginSchema = z.object({
    acc: z.string().min(1, "El número de acción es requerido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Exportamos el tipo TypeScript inferido del esquema
export type LoginFormValues = z.infer<typeof loginSchema>;