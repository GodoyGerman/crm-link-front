import api from "./api"; // tu instancia de axios ya configurada con baseURL

export interface Usuario {
    id?: number;
    nombre: string;
    correo: string;
    contraseña?: string;
    rol: string;
    activo: boolean;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: token ? `Bearer ${token}` : "",
    };
};

export const getUsuarios = async (): Promise<Usuario[]> => {
    const response = await api.get("/usuarios/", {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const getUsuarioPorId = async (id: number): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const crearUsuario = async (usuario: Usuario): Promise<Usuario> => {
    const response = await api.post("/usuarios/registrar", usuario, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const actualizarUsuario = async (id: number, usuario: Usuario): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}`, usuario, {
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const eliminarUsuario = async (id: number): Promise<{ mensaje: string }> => {
    const response = await api.delete(`/usuarios/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};