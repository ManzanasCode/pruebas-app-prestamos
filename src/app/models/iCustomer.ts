import { iCredito, iPagos } from '../models/iCredito';

export interface iCustomer {
    $key: string;
    nombreCompleto: string;
    genero: string;
    fecha_nac: string;
    fecha_creacion: string;
    totalCreditos?: number;
    fotoINE?: string;
    fotoPerfil?: string;
    CURP?: string;
    movil: string;
    creditos?: any[]
    extra: {
        montoCredito: number;
        montoLiquidado: number;
    }
}
