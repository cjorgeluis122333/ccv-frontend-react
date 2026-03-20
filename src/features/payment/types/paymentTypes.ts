export interface PartnerInfo {
    nombre: string;
    acc: number;
    categoria: string;
}

export interface Debt {
    mes: string;
    cuota_aplicada: number;
    total_pagado: number;
    deuda_pendiente: number;
    efectivo_restante: number;
    factor_conversion: number;
    tiene_descuento: boolean;
    estado: string;
}

export interface PartnerDebtsResponse {
    message: string;
    data: {
        socio: PartnerInfo;
        resumen_deudas: Debt[];
        total_a_pagar: number;
    }
}

export interface PaymentItemPayload {
    mes: string;
    monto: number;
}

export interface PaymentPayload {
    acc: number;
    time: string; // "1738595432" timestamp
    oper: "pago" | "descuento";
    resibo: string; // "REC-88442" (en el payload original dice resibo)
    control: string | null;
    factura: string | null;
    descript: string; // "Pago mensualidad Marzo + Abril adelantado"
    observaciones: string | null;
    seniat: "si" | "no";
    operador: string;
    pagos: PaymentItemPayload[];
}

export interface APIErrorResponse {
    status: string;
    message: string;
    errors?: Record<string, string[]>;
    code?: number;
}
