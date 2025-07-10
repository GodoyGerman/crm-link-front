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

export interface ServicioUpdate {
    id: number;
    nombre_servicio?: string;
    categoria_id?: number;
    precio_unitario?: number;
    unidad_medida?: string;
    duracion_estimada?: string;
    descuento_porcentaje?: number;
    activo?: boolean;
    fecha_creacion?: string;
}

export const getServicios = async (): Promise<Servicio[]> => {
    const response = await api.get("/servicios/");
    console.log("Datos recibidos en getServicios:", response.data);
    return response.data;
};

export const crearServicio = async (data: any): Promise<Servicio> => {
    const response = await api.post("/servicios/", data);
    return response.data;
};

export const deleteServicio = async (id: number): Promise<void> => {
    try {
        await api.delete(`/servicios/${id}`);
    } catch (error) {
        throw new Error("Error al eliminar el servicio");
    }
};

export const actualizarServicio = async (data: ServicioUpdate): Promise<Servicio> => {
    const { id, ...updateData } = data;
    const response = await api.put(`/servicios/${id}`, updateData);
    return response.data;
};

export const getServicioPorId = async (id: number): Promise<Servicio> => {
    const response = await api.get(`/servicios/${id}`);
    return response.data;
};