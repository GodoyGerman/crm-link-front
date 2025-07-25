import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generarPDF } from "./generarPDF";
import {
    crearCotizacion,
    actualizarCotizacion,
    getCotizacionById,
} from "../../services/cotizacionesService";
import { getClientes, Cliente, buscarClientePorDocumento } from "../../services/clientesService";
import { getServicios, Servicio } from "../../services/serviciosService";

interface Item {
    id?: number;
    servicio: string;
    cantidad: number;
    unidad: string;
    precio_unitario: number;  // Precio sin descuento
    descuento_porcentaje: number;  // Nuevo campo
    subtotal: number;  // Ya con descuento aplicado
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
    const isEditar = Boolean(id); // Saber si estamos editando o creando

    // Estado principal del formulario con todos los campos
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
                descuento_porcentaje: 0,  // inicializar en 0
                subtotal: 0,
            },
        ],
    });

    // Estado para la lista de clientes cargados y su estado de carga
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loadingClientes, setLoadingClientes] = useState(true);

    // Estado para la lista de servicios cargados y su estado de carga
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loadingServicios, setLoadingServicios] = useState(true);

    // Estados para búsqueda de cliente por documento
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
    const [usandoBusquedaDocumento, setUsandoBusquedaDocumento] = useState(false);
    const [numeroDocumento, setNumeroDocumento] = useState("");
    const [errorBusqueda, setErrorBusqueda] = useState("");

    // Función para buscar cliente por número de documento
    const handleBuscarCliente = async () => {
        if (!numeroDocumento.trim()) {
            setErrorBusqueda("Ingrese un número de documento");
            return;
        }

        try {
            const cliente = await buscarClientePorDocumento(numeroDocumento.trim());
            setClienteSeleccionado(cliente);
            setUsandoBusquedaDocumento(true);
            setErrorBusqueda("");

            // Actualiza el formulario con los datos del cliente encontrado
            setForm((prev) => ({
                ...prev,
                nombre_cliente: cliente.nombre,
                tipo_identificacion: cliente.tipo_identificacion,
                identificacion: cliente.numero_identificacion,
                correo: cliente.correo,
                direccion: cliente.direccion || "",
                telefono: cliente.telefono || "",
                ciudad: cliente.ciudad || "",
                contacto: cliente.nombre,
            }));
        } catch (error) {
            setClienteSeleccionado(null);
            setUsandoBusquedaDocumento(false);
            setErrorBusqueda("Cliente no encontrado");
        }
    };

    // Limpia los datos de búsqueda y formulario relacionados al cliente
    const limpiarBusquedaCliente = () => {
        setClienteSeleccionado(null);
        setUsandoBusquedaDocumento(false);
        setNumeroDocumento("");
        setErrorBusqueda("");

        setForm((prev) => ({
            ...prev,
            nombre_cliente: "",
            tipo_identificacion: "",
            identificacion: "",
            correo: "",
            direccion: "",
            telefono: "",
            ciudad: "",
            contacto: "",
        }));
    };

    // Carga la lista de clientes al montar el componente
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

    // Carga la lista de servicios al montar el componente
    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const data = await getServicios();
                setServicios(data);
            } catch (error) {
                console.error("Error cargando servicios:", error);
            } finally {
                setLoadingServicios(false);
            }
        };
        fetchServicios();
    }, []);

    // Si es edición, carga la cotización existente para editar
    useEffect(() => {
        if (isEditar && id) {
            (async () => {
                try {
                    const cotizacionExistente = await getCotizacionById(Number(id));
                    if (cotizacionExistente) {
                        const items = cotizacionExistente.items.length
                            ? cotizacionExistente.items.map((item: Item) => {
                                const descuento = item.descuento_porcentaje || 0;
                                const precioConDescuento = item.precio_unitario * (1 - descuento / 100);
                                const subtotal = item.cantidad * precioConDescuento;

                                return {
                                    ...item,
                                    subtotal,
                                };
                            })
                            : [
                                {
                                    id: cotizacionExistente.id,
                                    servicio: "",
                                    cantidad: 0,
                                    unidad: "",
                                    precio_unitario: 0,
                                    descuento_porcentaje: 0,
                                    subtotal: 0,
                                },
                            ];

                        const subtotalTotal = items.reduce((acc, item) => acc + item.subtotal, 0);
                        const iva = subtotalTotal * 0.19;
                        const total = subtotalTotal + iva;

                        setForm({
                            ...cotizacionExistente,
                            items,
                            subtotal: subtotalTotal,
                            iva,
                            total,
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


    // Maneja cambios simples en inputs (texto, textarea)
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Maneja cambios en items (servicio, cantidad, precio, etc.) y recalcula subtotales, IVA y total
    const handleItemChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const newItems = [...prev.items];

            if (name === "servicio") {
                const servicioSeleccionado = servicios.find((s) => s.nombre_servicio === value);

                newItems[index].servicio = value;
                newItems[index].unidad = servicioSeleccionado?.unidad_medida || "";
                newItems[index].precio_unitario = servicioSeleccionado?.precio_unitario || 0;
                newItems[index].descuento_porcentaje = servicioSeleccionado?.descuento_porcentaje || 0;

                // Cantidad debe tener valor numérico
                newItems[index].cantidad = newItems[index].cantidad || 0;

                // Calcula subtotal con descuento
                const descuento = newItems[index].descuento_porcentaje;
                const precioConDescuento =
                    newItems[index].precio_unitario * (1 - descuento / 100);

                newItems[index].subtotal = newItems[index].cantidad * precioConDescuento;
            } else if (name === "cantidad") {
                newItems[index].cantidad = Number(value);
                const descuento = newItems[index].descuento_porcentaje || 0;
                const precioConDescuento =
                    newItems[index].precio_unitario * (1 - descuento / 100);
                newItems[index].subtotal = newItems[index].cantidad * precioConDescuento;
            } else if (name === "precio_unitario") {
                newItems[index].precio_unitario = Number(value);
                const descuento = newItems[index].descuento_porcentaje || 0;
                const precioConDescuento =
                    newItems[index].precio_unitario * (1 - descuento / 100);
                newItems[index].subtotal = newItems[index].cantidad * precioConDescuento;
            }

            // Calcular totales
            const subtotalTotal = newItems.reduce((acc, item) => acc + item.subtotal, 0);
            const iva = subtotalTotal * 0.19;
            const total = subtotalTotal + iva;

            // 👉 Aquí pones los logs para revisar el estado
            console.log("---- DEBUG ----");
            newItems.forEach((item, idx) => {
                console.log(`Item ${idx + 1}:`, item);
            });
            console.log("Subtotal total:", subtotalTotal);
            console.log("IVA:", iva);
            console.log("Total:", total);
            console.log("---------------");

            return {
                ...prev,
                items: newItems,
                subtotal: subtotalTotal,
                iva,
                total,
            };
        });
    };

    // Añade un nuevo item vacío a la lista de items
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
                    descuento_porcentaje: 0,
                    subtotal: 0,
                },
            ],
        }));
    };

    // Elimina un item por índice y recalcula totales
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

    // Cuando se selecciona un cliente del select, carga sus datos en el formulario
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

    // Guarda la cotización (crear o actualizar)
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

    // Guarda y envía la cotización por correo con PDF adjunto
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

            // Genera PDF (blob)
            const pdfBlob = await generarPDF(cotizacionGuardada);

            // Envía el PDF por correo a la API
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

    const formatearPrecio = (valor: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor);
    };

    // JSX: Formulario completo
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEditar ? "Editar Cotización" : "Crear Nueva Cotización"}
            </h2>

            <form className="space-y-6">
                {/* Buscar cliente */}
                <fieldset className="border border-gray-200 rounded p-4">
                    <legend className="text-lg font-semibold text-gray-700">Buscar Cliente por Documento</legend>
                    <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                        <input
                            type="text"
                            placeholder="Número de documento"
                            value={numeroDocumento}
                            onChange={(e) => setNumeroDocumento(e.target.value)}
                            className="flex-grow px-3 py-2 border rounded w-full sm:w-auto"
                        />
                        <button
                            type="button"
                            onClick={handleBuscarCliente}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Buscar
                        </button>
                        <button
                            type="button"
                            onClick={limpiarBusquedaCliente}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Limpiar
                        </button>
                    </div>
                    {errorBusqueda && <p className="text-red-600 mt-2">{errorBusqueda}</p>}

                    {clienteSeleccionado && (
                        <div className="mt-4 bg-gray-50 p-4 rounded border text-sm text-gray-700">
                            <p><strong>Cliente:</strong> {clienteSeleccionado.nombre}</p>
                            <p>Correo: {clienteSeleccionado.correo}</p>
                            <p>Teléfono: {clienteSeleccionado.telefono || "N/A"}</p>
                        </div>
                    )}
                </fieldset>

                {/* Datos cliente */}
                <fieldset className="border border-gray-200 rounded p-4">
                    <legend className="text-lg font-semibold text-gray-700">Datos del Cliente</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <select
                            name="nombre_cliente"
                            value={form.nombre_cliente}
                            onChange={handleClienteChange}
                            required
                            disabled={usandoBusquedaDocumento}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="">-- Seleccione un cliente --</option>
                            {clientes.map((c) => (
                                <option key={c.id} value={c.nombre}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
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
                    </div>
                </fieldset>

                {/* Fechas */}
                <fieldset className="border border-gray-200 rounded p-4">
                    <legend className="text-lg font-semibold text-gray-700">Fechas y Condiciones</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Emisión</label>
                            <input
                                type="date"
                                name="fecha_emision"
                                value={form.fecha_emision}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Valida Hasta</label>
                            <input
                                type="date"
                                name="valida_hasta"
                                value={form.valida_hasta}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                    </div>
                    <textarea
                        name="condiciones"
                        placeholder="Condiciones"
                        value={form.condiciones}
                        onChange={handleChange}
                        className="mt-4 w-full border rounded p-2"
                        rows={3}
                    />
                </fieldset>

                {/* Items */}
                <fieldset className="border border-gray-200 rounded p-4">
                    <legend className="text-lg font-semibold text-gray-700">Items</legend>

                    {form.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center mt-4 border-b pb-2">
                            <select
                                name="servicio"
                                value={item.servicio}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                className="col-span-2 px-2 py-1 border rounded"
                            >
                                <option value="">-- Seleccione un servicio --</option>
                                {servicios.map((s) => (
                                    <option key={s.id} value={s.nombre_servicio}>
                                        {s.nombre_servicio}
                                    </option>
                                ))}
                            </select>

                            <input
                                name="cantidad"
                                type="number"
                                min={0}
                                value={item.cantidad}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                className="px-2 py-1 border rounded"
                                placeholder="Cantidad"
                            />

                            <input
                                name="unidad"
                                value={item.unidad}
                                readOnly
                                className="px-2 py-1 border rounded bg-gray-100"
                                placeholder="Unidad"
                            />

                            <input
                                name="precio_unitario"
                                type="number"
                                min={0}
                                value={item.precio_unitario}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                className="px-2 py-1 border rounded"
                                placeholder="Precio Unitario"
                            />

                            <input
                                name="descuento_porcentaje"
                                type="number"
                                min={0}
                                max={100}
                                value={item.descuento_porcentaje}
                                readOnly
                                className="px-2 py-1 border rounded bg-gray-100"
                                placeholder="% Descuento"
                            />

                            <input
                                name="subtotal"
                                value={formatearPrecio(item.subtotal)}
                                readOnly
                                className="px-2 py-1 border rounded bg-gray-100"
                                placeholder="Subtotal"
                            />

                            <button
                                type="button"
                                onClick={() => eliminarItem(index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={agregarItem}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Agregar Item
                    </button>
                </fieldset>

                {/* Totales */}
                <fieldset className="border border-gray-200 rounded p-4 mt-4">
                    <div className="flex justify-end space-x-6 text-lg font-semibold">
                        <div>
                            <span>Subtotal:</span> {formatearPrecio(form.subtotal)}
                        </div>
                        <div>
                            <span>IVA (19%):</span> {formatearPrecio(form.iva)}
                        </div>
                        <div>
                            <span>Total:</span> {formatearPrecio(form.total)}
                        </div>
                    </div>
                </fieldset>

                {/* Botones */}
                <div className="flex space-x-4 justify-end mt-6">
                    <button
                        type="submit"
                        onClick={handleGuardar}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Guardar
                    </button>
                    <button
                        type="submit"
                        onClick={handleGuardarYEnviar}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Guardar y Enviar
                    </button>
                </div>
            </form>
        </div>
    );
}

