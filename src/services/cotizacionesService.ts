import api from "./api";

export interface Cotizacion {
    id: number;
    nombre_cliente: string;
    tipo_identificacion: string;
    identificacion: string;
    fecha_emision: string;
    valida_hasta: string;
    estado: string;
    condiciones: string;
}



export const getCotizaciones = async (): Promise<Cotizacion[]> => {
    const response = await api.get("/cotizacion/cotizaciones/");
    return response.data;
};
