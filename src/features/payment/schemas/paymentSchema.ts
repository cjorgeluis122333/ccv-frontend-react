import { z } from "zod";

export const paymentSchema = z.object({
    monto_pagado: z.number().min(0.01, "El monto pagado debe ser mayor a 0"),
    abono: z.number().optional(), // Solo visual, no se envía, pero puede estar en el form
    recibo: z.string().min(1, "El recibo es obligatorio"),
    operacion: z.enum(["pago", "descuento"]),
    observaciones: z.string().nullable().optional(),
    fecha_pago: z.string().min(1, "La fecha de pago es obligatoria"), // yyyy-mm en realidad o guardamos yyyy-mm-dd y lo parseamos
    descripcion: z.string().min(1, "La descripción es obligatoria"),
}).superRefine((data, ctx) => {
    if (data.operacion === "descuento" && (!data.observaciones || data.observaciones.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Las observaciones son obligatorias cuando la operación es 'descuento'",
            path: ["observaciones"],
        });
    }
    
    // Validar que monto pagado no sea excesivamente absurdo, aunque la lógica lo maneje.
    // También podríamos validar que monto_pagado no exceda monto_total en caso de deudas múltiples, pero el Backend lo hará.
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
