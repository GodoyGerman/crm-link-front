import React, { useEffect, useState } from "react";
import { getServicios, Servicio, deleteServicio } from "../../services/serviciosService";
import { getCategorias, Categoria } from "../../services/categoriasService";
import { useNavigate } from "react-router-dom";


const ServiciosPage = () => {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleNuevoServicio = () => {
        navigate("/servicios/nuevo");


    };
    const handleEditar = (id: number) => {
        navigate(`/servicios/${id}/editar`);
    };

    const handleEliminar = async (id: number) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este servicio?");
        if (!confirmar) return;

        try {
            await deleteServicio(id); // ahora usa el servicio
            setServicios(servicios.filter(servicio => servicio.id !== id));
            alert("Servicio eliminado correctamente");
        } catch (error) {
            console.error("Error eliminando servicio:", error);
            alert("No se pudo eliminar el servicio");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviciosData, categoriasData] = await Promise.all([
                    getServicios(),
                    getCategorias()
                ]);
                console.log("IDs de servicios recibidos:", serviciosData.map(s => s.id));
                setServicios(serviciosData);
                setCategorias(categoriasData);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getNombreCategoria = (id: number) => {
        const categoria = categorias.find(cat => cat.id === id);
        return categoria ? categoria.nombre : "Sin categoría";
    };

    const formatearPrecio = (valor: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Servicios</h2>

            {loading ? (
                <p className="text-gray-600">Cargando servicios...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre Servicio</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Categoría</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Precio Unitario</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unidad de Medida</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Duración Estimada</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descuento</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha de Creación</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Descripción</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {servicios.map((servicio) => (
                                <tr key={servicio.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-800">{servicio.id}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{servicio.nombre_servicio}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{getNombreCategoria(servicio.categoria_id)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {formatearPrecio(servicio.precio_unitario * (1 - servicio.descuento_porcentaje / 100))}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{servicio.unidad_medida}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{servicio.duracion_estimada}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {(servicio.descuento_porcentaje ?? 0) + "%"}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {servicio.estado ? "Activo" : "Inactivo"}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {new Date(servicio.fecha_creacion).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{servicio.descripcion}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800 space-x-2">
                                        <button
                                            onClick={() => handleEditar(servicio.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(servicio.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={handleNuevoServicio}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
                >
                    Nuevo Servicio
                </button>
            </div>
        </div>
    );
};

const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f2f2f2",
};

const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
};

export default ServiciosPage;
