export interface PartnerInfo {
    nombre: string;
    acc: number;
    categoria: string;
}

export interface Debt {
    mes: string;
    cuota_aplicada: number;
    impuesto: number;
    total_pagado: number;
    deuda_pendiente: number;
    efectivo_restante: number;
    factor_conversion: number;
    tiene_descuento: boolean;
    estado: string;
}

export interface PartnerDebtsBaseData {
    socio: PartnerInfo;
    resumen_deudas: Debt[];
    total_a_pagar: number;
}

export interface PartnerDebtsData extends PartnerDebtsBaseData {
    hijos_mayores_30: string[];
}

export type PartnerAdvanceDebtsData = PartnerDebtsBaseData

export interface PartnerDebtsResponse {
    message: string;
    data: PartnerDebtsData;
}

export interface PartnerAdvanceDebtsResponse {
    message: string;
    data: PartnerAdvanceDebtsData;
}

export interface PaymentItemPayload {
    mes: string;
    monto: number;
}

export interface PaymentPayload {
    acc: number;
    time: string;
    oper: "pago" | "descuento";
    resibo: string;
    control: string | null;
    factura: string | null;
    descript: string;
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
