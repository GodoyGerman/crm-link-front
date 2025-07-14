import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generarPDF } from "./generarPDF";
import {
    crearCotizacion,
    actualizarCotizacion,
    getCotizacionById,
} from "../../services/cotizacionesService";
import { getClientes, Cliente } from "../../services/clientesService";

interface Item {
    id?: number;
    servicio: string;
    cantidad: number;
    unidad: string;
    precio_unitario: number;
    subtotal: number;
}

interface FormData {
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

export default function CotizacionForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditar = Boolean(id);

    const [form, setForm] = useState<FormData>({
        nombre_cliente: "",
        tipo_identificacion: "",
        identificacion: "",
        correo: "",
        direccion: "",
        telefono: "",
        ciudad: "",
        contacto: "",
        condiciones: "",
        fecha_emision: "",
        valida_hasta: "",
        estado: "",
        pdf_url: "",
        subtotal: 0,
        iva: 0,
        total: 0,
        items: [
            {
                servicio: "",
                cantidad: 0,
                unidad: "",
                precio_unitario: 0,
                subtotal: 0,
            },
        ],
    });

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loadingClientes, setLoadingClientes] = useState(true);

    // Cargar clientes para selección
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await getClientes();
                setClientes(data);
            } catch (error) {
                console.error("Error cargando clientes:", error);
            } finally {
                setLoadingClientes(false);
            }
        };

        fetchClientes();
    }, []);

    // Cargar cotización existente si es edición
    useEffect(() => {
        if (isEditar && id) {
            (async () => {
                try {
                    const cotizacionExistente = await getCotizacionById(Number(id));
                    if (cotizacionExistente) {
                        setForm({
                            ...cotizacionExistente,
                            items: cotizacionExistente.items.length
                                ? cotizacionExistente.items
                                : [
                                    {
                                        id: cotizacionExistente.id,
                                        servicio: "",
                                        cantidad: 0,
                                        unidad: "",
                                        precio_unitario: 0,
                                        subtotal: 0,
                                    },
                                ],
                            tipo_identificacion: cotizacionExistente.tipo_identificacion || "",
                            estado: cotizacionExistente.estado || "",
                            correo: cotizacionExistente.correo || "",
                            condiciones: cotizacionExistente.condiciones || "",
                            direccion: cotizacionExistente.direccion || "",
                            telefono: cotizacionExistente.telefono || "",
                            ciudad: cotizacionExistente.ciudad || "",
                            contacto: cotizacionExistente.contacto || "",
                            pdf_url: cotizacionExistente.pdf_url || "",
                        });
                    } else {
                        alert("Cotización no encontrada");
                        navigate("/cotizaciones");
                    }
                } catch (error) {
                    alert("Error cargando cotización");
                    navigate("/cotizaciones");
                }
            })();
        }
    }, [id, isEditar, navigate]);

    // Actualiza campos simples
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Actualiza items y recalcula totales
    const handleItemChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const newItems = [...prev.items];
            if (name === "cantidad" || name === "precio_unitario") {
                newItems[index][name] = Number(value);
            } else {
                newItems[index][name] = value;
            }
            newItems[index].subtotal =
                newItems[index].cantidad * newItems[index].precio_unitario;

            const subtotalTotal = newItems.reduce((acc, item) => acc + item.subtotal, 0);
            const iva = subtotalTotal * 0.19;
            const total = subtotalTotal + iva;

            return {
                ...prev,
                items: newItems,
                subtotal: subtotalTotal,
                iva,
                total,
            };
        });
    };

    // Agrega un item vacío
    const agregarItem = () => {
        setForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    servicio: "",
                    cantidad: 0,
                    unidad: "",
                    precio_unitario: 0,
                    subtotal: 0,
                },
            ],
        }));
    };

    // Elimina un item y recalcula totales
    const eliminarItem = (index: number) => {
        setForm((prev) => {
            const newItems = prev.items.filter((_, i) => i !== index);
            const subtotalTotal = newItems.reduce((acc, item) => acc + item.subtotal, 0);
            const iva = subtotalTotal * 0.19;
            const total = subtotalTotal + iva;
            return {
                ...prev,
                items: newItems,
                subtotal: subtotalTotal,
                iva,
                total,
            };
        });
    };

    // Cuando se selecciona un cliente, cargar sus datos en el formulario
    const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nombreSeleccionado = e.target.value;
        const clienteSeleccionado = clientes.find((c) => c.nombre === nombreSeleccionado);

        setForm((prev) => ({
            ...prev,
            nombre_cliente: nombreSeleccionado,
            tipo_identificacion: clienteSeleccionado?.tipo_identificacion || "",
            identificacion: clienteSeleccionado?.numero_identificacion || "",
            correo: clienteSeleccionado?.correo || "",
            direccion: clienteSeleccionado?.direccion || "",
            telefono: clienteSeleccionado?.telefono || "",
            ciudad: clienteSeleccionado?.ciudad || "",
        }));
    };

    // Guardar cotización
    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const datosLimpios = {
                ...form,
                estado: "pendiente",
                items: form.items
                    .filter((item) => item.servicio && item.cantidad > 0)
                    .map(({ id, ...rest }) => rest),
            };

            if (isEditar && id) {
                await actualizarCotizacion(Number(id), datosLimpios);
            } else {
                await crearCotizacion(datosLimpios);
            }

            alert("Cotización guardada con éxito.");
            navigate("/cotizaciones");
        } catch (error) {
            console.error("Error al guardar cotización:", error);
            alert("Error al guardar cotización");
        }
    };

    // Guardar y enviar por correo
    const handleGuardarYEnviar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const datosLimpios = {
                ...form,
                estado: "enviado",
                items: form.items
                    .filter((item) => item.servicio && item.cantidad > 0)
                    .map(({ id, ...rest }) => rest),
            };

            let cotizacionGuardada;

            if (isEditar && id) {
                await actualizarCotizacion(Number(id), datosLimpios);
                cotizacionGuardada = { ...datosLimpios, id: Number(id) };
            } else {
                cotizacionGuardada = await crearCotizacion(datosLimpios);
            }

            const pdfBlob = await generarPDF(cotizacionGuardada);

            const formData = new FormData();
            formData.append("pdf", pdfBlob, `cotizacion_${cotizacionGuardada.id}.pdf`);
            formData.append("correo", cotizacionGuardada.correo);

            await fetch("http://127.0.0.1:8000/cotizacion/enviar-correo", {
                method: "POST",
                body: formData,
            });

            alert("Cotización enviada por correo y guardada exitosamente.");
            navigate("/cotizaciones");
        } catch (error) {
            console.error("Error al guardar o enviar:", error);
            alert("Error al guardar o enviar la cotización");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
                {isEditar ? "Editar Cotización" : "Crear Nueva Cotización"}
            </h2>
            <form>
                {/* Datos cliente */}
                <fieldset>
                    <legend className="font-semibold mb-2">Datos Cliente</legend>

                    <label>
                        Cliente:
                        {loadingClientes ? (
                            <div>Cargando clientes...</div>
                        ) : (
                            <select
                                name="nombre_cliente"
                                value={form.nombre_cliente}
                                onChange={handleClienteChange}
                                required
                                className="input"
                            >
                                <option value="">-- Seleccione un cliente --</option>
                                {clientes.map((c) => (
                                    <option key={c.id} value={c.nombre}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>

                    <input
                        name="tipo_identificacion"
                        placeholder="Tipo Identificación"
                        value={form.tipo_identificacion}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        name="identificacion"
                        placeholder="Identificación"
                        value={form.identificacion}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        name="correo"
                        type="email"
                        placeholder="Correo"
                        value={form.correo}
                        onChange={handleChange}
                        required
                        className="input"
                    />

                    <input
                        name="direccion"
                        placeholder="Dirección"
                        value={form.direccion}
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        name="telefono"
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        name="ciudad"
                        placeholder="Ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        className="input"
                    />

                    <input
                        name="contacto"
                        placeholder="Contacto"
                        value={form.contacto}
                        onChange={handleChange}
                        className="input"
                    />
                </fieldset>

                {/* Fechas y estado */}
                <fieldset>
                    <legend className="font-semibold mb-2 mt-4">Fechas</legend>

                    <label>
                        Fecha Emisión:
                        <input
                            type="date"
                            name="fecha_emision"
                            value={form.fecha_emision}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </label>

                    <label>
                        Valida Hasta:
                        <input
                            type="date"
                            name="valida_hasta"
                            value={form.valida_hasta}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </label>

                    <textarea
                        name="condiciones"
                        placeholder="Condiciones"
                        value={form.condiciones}
                        onChange={handleChange}
                        className="textarea"
                    />
                </fieldset>

                {/* Items */}
                <fieldset>
                    <legend className="font-semibold mb-2 mt-4">Items</legend>

                    {form.items.map((item, index) => (
                        <div
                            key={index}
                            className="item-row"
                            style={{
                                marginBottom: "1rem",
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "0.5rem",
                            }}
                        >
                            <input
                                name="servicio"
                                placeholder="Servicio"
                                value={item.servicio}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                className="input"
                                style={{ marginRight: "0.5rem" }}
                            />
                            <input
                                name="cantidad"
                                type="number"
                                placeholder="Cantidad"
                                value={item.cantidad}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                min={0}
                                className="input"
                                style={{ width: "80px", marginRight: "0.5rem" }}
                            />
                            <input
                                name="unidad"
                                placeholder="Unidad"
                                value={item.unidad}
                                onChange={(e) => handleItemChange(index, e)}
                                className="input"
                                style={{ width: "80px", marginRight: "0.5rem" }}
                            />
                            <input
                                name="precio_unitario"
                                type="number"
                                placeholder="Precio Unitario"
                                value={item.precio_unitario}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                min={0}
                                className="input"
                                style={{ width: "120px", marginRight: "0.5rem" }}
                            />
                            <input
                                name="subtotal"
                                placeholder="Subtotal"
                                value={item.subtotal.toFixed(2)}
                                readOnly
                                className="input"
                                style={{
                                    width: "100px",
                                    marginRight: "0.5rem",
                                    backgroundColor: "#eee",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => eliminarItem(index)}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "4px 8px",
                                    cursor: "pointer",
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={agregarItem}
                        style={{
                            backgroundColor: "#007BFF",
                            color: "white",
                            padding: "8px 12px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginTop: "1rem",
                        }}
                    >
                        + Agregar Item
                    </button>
                </fieldset>

                {/* Totales */}
                <fieldset>
                    <legend className="font-semibold mb-2 mt-4">Totales</legend>
                    <div>Subtotal: {form.subtotal.toFixed(2)}</div>
                    <div>IVA (19%): {form.iva.toFixed(2)}</div>
                    <div>Total: {form.total.toFixed(2)}</div>
                </fieldset>

                {/* Botones de acción */}
                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={handleGuardar}
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Guardar
                    </button>

                    <button
                        type="button"
                        onClick={handleGuardarYEnviar}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Guardar y Enviar por Correo
                    </button>
                </div>
            </form>
        </div>
    );
}

