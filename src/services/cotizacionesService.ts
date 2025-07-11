import api from "./api";

export interface Cotizacion {
    id?: number; // id puede ser opcional para crear
    nombre_cliente: string;
    tipo_identificacion: string;
    identificacion: string;
    fecha_emision: string;
    valida_hasta: string;
    estado: string;
    condiciones: string;
}

// Obtener cotizaciones
export const getCotizaciones = async (): Promise<Cotizacion[]> => {
    const response = await api.get("/cotizacion/consulta/");
    return response.data;
};

// Crear cotización
export const crearCotizacion = async (cotizacion: Cotizacion): Promise<Cotizacion> => {
    const response = await api.post("/cotizacion/crear/", cotizacion);
    return response.data;
};
export const enviarCotizacionPorCorreo = async (
    email: string,
    cotizacionId: number,
    pdfFile: File
) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("cotizacion_id", cotizacionId.toString());
    formData.append("archivo", pdfFile);

    const response = await api.post("/cotizacion/enviar-correo/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const actualizarEstadoCotizacion = async (id: number, nuevoEstado: string) => {
    const response = await api.put(`/cotizacion/actualizar-estado/${id}?nuevo_estado=${nuevoEstado}`);
    return response.data;
};