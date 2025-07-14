import api from "./api";

export interface Cotizacion {
    id?: number;
    nombre_cliente: string;
    tipo_identificacion: string;
    identificacion: string;
    correo: string;
    direccion: string;
    telefono: string;
    ciudad: string;
    contacto: string;
    condiciones: string;
    fecha_emision: string;
    valida_hasta: string;
    estado: string;
    pdf_url: string;
    subtotal: number;
    iva: number;
    total: number;
    items: Item[];
}

export interface Item {
    servicio: string;
    cantidad: number;
    unidad: string;
    precio_unitario: number;
    subtotal: number;
}

// Obtener cotizaciones
export const getCotizaciones = async (): Promise<Cotizacion[]> => {
    const response = await api.get("/cotizacion/consulta/");
    return response.data;
};

// Obtener cotización por ID (ajustado a curl)
export const getCotizacionById = async (id: number): Promise<Cotizacion> => {
    const response = await api.get(`/cotizacion/${id}`);
    return response.data;
};

// Crear cotización
export const crearCotizacion = async (cotizacion: Cotizacion): Promise<Cotizacion> => {
    const response = await api.post("/cotizacion/crear/", cotizacion);
    return response.data;
};

// Actualizar cotización completa
export const actualizarCotizacion = async (id: number, cotizacion: Partial<Cotizacion>) => {
    const response = await api.put(`/cotizacion/actualizar/${id}`, cotizacion);
    return response.data;
};


// Enviar cotización por correo con archivo PDF
export const enviarCotizacionPorCorreo = async (
    correo: string,
    _cotizacionId: number, // no se usa en el backend, pero lo dejamos si lo necesitas para otras cosas
    pdfFile: File
) => {
    const formData = new FormData();
    formData.append("correo", correo);  // ✅ debe llamarse "correo"
    formData.append("pdf", pdfFile);    // ✅ debe llamarse "pdf"

    const response = await api.post("/cotizacion/enviar-correo/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

// Actualizar solo el estado de la cotización
export const actualizarEstadoCotizacion = async (id: number, nuevoEstado: string) => {
    const response = await api.put(`/cotizacion/actualizar-estado/${id}?nuevo_estado=${nuevoEstado}`);
    return response.data;
};
