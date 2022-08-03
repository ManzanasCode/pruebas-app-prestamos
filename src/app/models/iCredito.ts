export interface iCredito {
    $key: string;
    montoCredito: number;
    utilidad: number;
    interes: number;
    tipoCredito: string;
    numeroPagos: number;
    fechaPrestamo: string;
    diaPago?:string;
    flagDetail?:boolean;
    idCliente: string;
    nombreCliente: string;
    montoLiquidado: number;
    montoPago: number;
    estado: string; //abierto | liquidado
    listaPagos?:iPagos[];
    evidencias?: any[];
    pagoActual: number;
}

export interface iPagos {
    id: string;
    fechaPago: string;
    monto: number;
    estado: string; // vencido, pendiente, completo
}

export interface iCreditoVencido {
    idCredito: string;
    flagDetail: boolean
    fechaPrestamo: string;
    montoCredito: number;
    idCliente: string;
    nombreCliente: string;
    pagosVencidos?: iPagos[]
}
