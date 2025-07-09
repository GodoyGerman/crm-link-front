import React, { useEffect, useState } from "react";
import { getCategorias, Categoria } from "../../services/categoriasService";
import { crearServicio } from "../../services/serviciosService";

const ServicioForm = () => {
    // Estados del formulario
    const [nombreServicio, setNombreServicio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoriaId, setCategoriaId] = useState<number | null>(null);
    const [precioUnitario, setPrecioUnitario] = useState(0);
    const [unidadMedida, setUnidadMedida] = useState("");
    const [duracionEstimada, setDuracionEstimada] = useState("");
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

    // Estado para las categorías
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    // Cargar categorías al montar el componente
    useEffect(() => {
        async function cargarCategorias() {
            try {
                const data = await getCategorias();
                setCategorias(data);
                if (data.length > 0) {
                    setCategoriaId(data[0].id); // Asignar primera categoría por defecto
                }
            } catch (error) {
                console.error("Error al cargar categorías", error);
            }
        }
        cargarCategorias();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (categoriaId === null) {
            alert("Por favor selecciona una categoría");
            return;
        }

        try {
            await crearServicio({
                nombre_servicio: nombreServicio,
                descripcion,
                categoria_id: categoriaId,
                precio_unitario: precioUnitario,
                unidad_medida: unidadMedida,
                duracion_estimada: duracionEstimada,
                descuento_porcentaje: descuentoPorcentaje,
                activo: true, // o estado según tu backend
            });
            alert("Servicio creado con éxito");
            // Opcional: resetear formulario o redirigir
        } catch (error) {
            console.error("Error al crear servicio", error);
            alert("Hubo un error al crear el servicio");
        }
    };

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

            <button type="submit">Crear Servicio</button>
        </form>
    );
};

export default ServicioForm;
