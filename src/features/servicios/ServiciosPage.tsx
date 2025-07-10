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

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Servicios</h2>
            {loading ? (
                <p>Cargando servicios...</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Nombre Servicio</th>
                            <th style={thStyle}>Categoría</th>
                            <th style={thStyle}>Precio Unitario</th>
                            <th style={thStyle}>Unidad de Medida</th>
                            <th style={thStyle}>Duración Estimada</th>
                            <th style={thStyle}>Descuento</th>
                            <th style={thStyle}>Estado</th>
                            <th style={thStyle}>Fecha de Creación</th>
                            <th style={thStyle}>descripcion</th>
                            <th style={thStyle}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {servicios.map(servicio => (
                            <tr key={servicio.id}>
                                <td style={tdStyle}>{servicio.id}</td>
                                <td style={tdStyle}>{servicio.nombre_servicio}</td>
                                <td style={tdStyle}>{getNombreCategoria(servicio.categoria_id)}</td>
                                <td style={tdStyle}>${servicio.precio_unitario}</td>
                                <td style={tdStyle}>{servicio.unidad_medida}</td>
                                <td style={tdStyle}>{servicio.duracion_estimada}</td>
                                <td style={tdStyle}>{(servicio.descuento_porcentaje ?? 0) + "%"}</td>
                                <td style={tdStyle}>{servicio.estado ? "Activo" : "Inactivo"}</td>
                                <td style={tdStyle}>{new Date(servicio.fecha_creacion).toLocaleDateString()}</td>
                                <td style={tdStyle}>{servicio.descripcion}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleEditar(servicio.id)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(servicio.id)} // si vas a implementarlo luego
                                        style={{ backgroundColor: 'red', color: 'white' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div style={{ marginTop: "20px" }}>
                <button onClick={handleNuevoServicio}>Nuevo Servicio</button>
                {/* resto */}
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
