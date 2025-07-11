import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearCotizacion } from "../../services/cotizacionesService";


interface Item {
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

    // Actualiza campos de formulario simples
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Actualiza un campo de un item en particular y recalcula subtotal del item y totales generales
    const handleItemChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const newItems = [...prev.items];
            // Actualiza campo (cantidad y precio_unitario son números)
            if (name === "cantidad" || name === "precio_unitario") {
                newItems[index][name] = Number(value);
            } else {
                newItems[index][name] = value;
            }
            // Recalcula subtotal item
            newItems[index].subtotal =
                newItems[index].cantidad * newItems[index].precio_unitario;

            // Recalcula subtotal total
            const subtotalTotal = newItems.reduce(
                (acc, item) => acc + item.subtotal,
                0
            );
            const iva = subtotalTotal * 0.19; // IVA 19%
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

    // Agrega un nuevo item vacío
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

    // Elimina un item por índice y recalcula totales
    const eliminarItem = (index: number) => {
        setForm((prev) => {
            const newItems = prev.items.filter((_, i) => i !== index);
            const subtotalTotal = newItems.reduce(
                (acc, item) => acc + item.subtotal,
                0
            );
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

    // Envía el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await crearCotizacion(form);
            alert("Cotización creada con éxito");
            navigate("/cotizaciones");
        } catch (error) {
            console.error("Error al crear cotización:", error);
            alert("Error al crear cotización");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Crear Nueva Cotización</h2>
            <form onSubmit={handleSubmit}>

                {/* Datos cliente */}
                <fieldset>
                    <legend className="font-semibold mb-2">Datos Cliente</legend>

                    <input
                        name="nombre_cliente"
                        placeholder="Nombre Cliente"
                        value={form.nombre_cliente}
                        onChange={handleChange}
                        required
                        className="input"
                    />

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
                    <legend className="font-semibold mb-2 mt-4">Fechas y Estado</legend>

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

                    <input
                        name="estado"
                        placeholder="Estado"
                        value={form.estado}
                        onChange={handleChange}
                        required
                        className="input"
                    />
                    {/*
                    <input
                        name="pdf_url"
                        placeholder="URL PDF"
                        value={form.pdf_url}
                        onChange={handleChange}
                        className="input"
                    />
*/}
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
                        <div key={index} className="item-row" style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
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
                                style={{ width: "100px", marginRight: "0.5rem", backgroundColor: "#eee" }}
                            />
                            <button
                                type="button"
                                onClick={() => eliminarItem(index)}
                                style={{ backgroundColor: "red", color: "white", border: "none", padding: "4px 8px", cursor: "pointer" }}
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

                <button
                    type="submit"
                    style={{
                        marginTop: "1.5rem",
                        backgroundColor: "green",
                        color: "white",
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Guardar Cotización
                </button>
            </form>
        </div>
    );
}
