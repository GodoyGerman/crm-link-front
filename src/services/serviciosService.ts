import api from "./api";

export interface Servicio {
    id: number;
    nombre_servicio: string;
    categoria_id: number;
    precio_unitario: number;
    unidad_medida: string;
    duracion_estimada: string;
    descuento_porcentaje: number;
    activo: boolean;
    fecha_creacion: string;
}

export const getServicios = async (): Promise<Servicio[]> => {
    const response = await api.get("/servicios/");
    return response.data;
};

export const crearServicio = async (data: any): Promise<Servicio> => {
    const response = await api.post("/servicios/", data);
    return response.data;
};