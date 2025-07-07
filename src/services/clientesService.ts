import api from "./api";

export interface Cliente {
    id: number;
    nombre: string;
    tipo_identificacion?: string;
    numero_identificacion?: string;
    correo: string;
    telefono: string;
    direccion?: string;
    ciudad?: string;
    nombre_empresa?: string;
    segmento?: string;
    redes_sociales?: {
        facebook?: string;
        linkedin?: string;
        instagram?: string;
    };
    medio_adquisicion?: string;
    activo?: boolean;
}

export const getClientes = async (): Promise<Cliente[]> => {
    const response = await api.get("/clientes/");
    return response.data;
};

export const crearCliente = async (cliente: Cliente) => {
    const response = await api.post("/clientes/", cliente);
    return response.data;
};
