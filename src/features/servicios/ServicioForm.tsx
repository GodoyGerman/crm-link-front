import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategorias, Categoria } from "../../services/categoriasService";
import { crearServicio, getServicioPorId, actualizarServicio } from "../../services/serviciosService";

const ServicioForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estados del formulario
    const [nombreServicio, setNombreServicio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [unidadMedida, setUnidadMedida] = useState("");
    const [duracionEstimada, setDuracionEstimada] = useState("");
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
    const [activo, setActivo] = useState(true);

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar categorías y, si hay id, cargar servicio para editar
    useEffect(() => {
        async function cargarDatos() {
            try {
                const cats = await getCategorias();
                setCategorias(cats);
                if (cats.length > 0 && categoriaId === null) {
                    setCategoriaId(cats[0].id);
                }

                if (id) {
                    const servicioEdit = await getServicioPorId(parseInt(id));
                    setNombreServicio(servicioEdit.nombre_servicio);
                    setDescripcion(servicioEdit.descripcion ?? "");
                    setCategoriaId(servicioEdit.categoria_id);
                    setPrecioUnitario(Number(servicioEdit.precio_unitario));
                    setUnidadMedida(servicioEdit.unidad_medida ?? "");
                    setDuracionEstimada(servicioEdit.duracion_estimada ?? "");
                    setDescuentoPorcentaje(Number(servicioEdit.descuento_porcentaje ?? 0));
                    setActivo(servicioEdit.estado ?? true);
                }
            } catch (error) {
                console.error("Error cargando datos", error);
            } finally {
                setLoading(false);
            }
        }
        cargarDatos();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (categoriaId === null) {
            alert("Por favor selecciona una categoría");
            return;
        }

        const data = {
            nombre_servicio: nombreServicio,
            descripcion,
            categoria_id: categoriaId,
            precio_unitario: precioUnitario,
            unidad_medida: unidadMedida,
            duracion_estimada: duracionEstimada,
            descuento_porcentaje: descuentoPorcentaje,
            estado: activo,
        };

        console.log("Datos a enviar:", data);

        try {
            if (id) {
                // Editar servicio
                await actualizarServicio({ id: parseInt(id), ...data });
                alert("Servicio actualizado con éxito");
            } else {
                // Crear nuevo servicio
                await crearServicio(data);
                alert("Servicio creado con éxito");
            }
            navigate("/servicios");
        } catch (error) {
            console.error("Error al guardar servicio", error);
            alert("Hubo un error al guardar el servicio");
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre del Servicio</label>
                <input
                    type="text"
                    value={nombreServicio}
                    onChange={(e) => setNombreServicio(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Descripción</label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div>
                <label>Categoría</label>
                <select
                    value={categoriaId ?? ""}
                    onChange={(e) => setCategoriaId(Number(e.target.value))}
                    required
                >
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Precio Unitario</label>
                <input
                    type="number"
                    value={precioUnitario}
                    onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                    required
                    min={0}
                    step={0.01}
                />
            </div>

            <div>
                <label>Unidad de Medida</label>
                <input
                    type="text"
                    value={unidadMedida}
                    onChange={(e) => setUnidadMedida(e.target.value)}
                />
            </div>

            <div>
                <label>Duración Estimada</label>
                <input
                    type="text"
                    value={duracionEstimada}
                    onChange={(e) => setDuracionEstimada(e.target.value)}
                />
            </div>

            <div>
                <label>Descuento (%)</label>
                <input
                    type="number"
                    value={descuentoPorcentaje}
                    onChange={(e) => setDescuentoPorcentaje(Number(e.target.value))}
                    min={0}
                    max={100}
                />
            </div>

            <div>
                <label htmlFor="activo">{activo ? "Activo" : "Inactivo"}</label>
                <input
                    id="activo"
                    type="checkbox"
                    checked={activo}
                    onChange={(e) => setActivo(e.target.checked)}
                />
            </div>


            <button type="submit">{id ? "Guardar Cambios" : "Crear Servicio"}</button>
        </form>
    );
};

export default ServicioForm;
