import api from "./api";

export interface Cliente {
    id?: number; // antes: id: number;
    nombre: string;
    tipo_identificacion: string;
    numero_identificacion: string;
    correo: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    nombre_empresa: string;
    segmento: string;
    redes_sociales: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        otro?: string;
    };
    medio_adquisicion: string;
    activo: boolean;
}

export const getClientes = async (): Promise<Cliente[]> => {
    const response = await api.get("/clientes/");
    return response.data;
};

export const crearCliente = async (cliente: Cliente) => {
    const response = await api.post("/clientes/", cliente);
    return response.data;
};
export const getClientePorId = async (id: number): Promise<Cliente> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
};
export const actualizarCliente = async (id: number, cliente: Cliente) => {
    const response = await api.put(`/clientes/${id}`, cliente);
    return response.data;
};
export const borrarCliente = async (id: number) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
};
export const buscarClientePorDocumento = async (numero: string): Promise<Cliente> => {
    const response = await api.get(`/clientes/clientes/buscar/`, {
        params: { numero_identificacion: numero },
    });
    return response.data;
};