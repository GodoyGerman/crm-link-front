// categoriasService.ts
import api from "./api"; // Aquí importas la instancia axios configurada

// Define la interfaz que representa una categoría
export interface Categoria {
    id: number;
    nombre: string;
}

// Función para obtener la lista de categorías desde la API
export const getCategorias = async (): Promise<Categoria[]> => {
    const response = await api.get("/categoria/categorias/");
    return response.data;
};