import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearCotizacion } from "../../services/cotizacionesService"; // Ajusta ruta

const CotizacionForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre_cliente: "",
        tipo_identificacion: "",
        identificacion: "",
        correo: "",
        direccion: "",
        telefono: "",
        ciudad: "",
        contacto: "",
        servicio: "",
        cantidad: 0,
        unidad: "",
        precio_unitario: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
        condiciones: "",
        fecha_emision: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
        valida_hasta: "",
        estado: "pendiente",
        pdf_url: "",
    });

    // Actualiza subtotal, iva y total cuando cantidad o precio_unitario cambian
    const actualizarTotales = (cantidad: number, precioUnitario: number) => {
        const subtotal = cantidad * precioUnitario;
        const iva = subtotal * 0.19; // 19% IVA
        const total = subtotal + iva;
        setFormData((prev) => ({
            ...prev,
            subtotal,
            iva,
            total,
        }));
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        if (name === "cantidad" || name === "precio_unitario") {
            const valNum = Number(value);
            setFormData((prev) => {
                const newForm = { ...prev, [name]: valNum };
                // Actualiza totales con valores nuevos
                const cantidadActual =
                    name === "cantidad" ? valNum : prev.cantidad || 0;
                const precioActual =
                    name === "precio_unitario" ? valNum : prev.precio_unitario || 0;
                actualizarTotales(cantidadActual, precioActual);
                return newForm;
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await crearCotizacion(formData);
            alert("Cotización creada con éxito");
            navigate("/cotizaciones");
        } catch (error) {
            console.error("Error al crear cotización", error);
            alert("Error al crear la cotización");
        }
    };

    return (
        <form onSubmit= { handleSubmit } >
        <h2>Nueva Cotización </h2>

            <label>
        Nombre Cliente:
    <input
          type="text"
    name = "nombre_cliente"
    value = { formData.nombre_cliente }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
        Tipo Identificación:
    <input
          type="text"
    name = "tipo_identificacion"
    value = { formData.tipo_identificacion }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
    Identificación:
    <input
          type="text"
    name = "identificacion"
    value = { formData.identificacion }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
    Correo:
    <input
          type="email"
    name = "correo"
    value = { formData.correo }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
    Dirección:
    <input
          type="text"
    name = "direccion"
    value = { formData.direccion }
    onChange = { handleChange }
        />
        </label>

        <label>
    Teléfono:
    <input
          type="tel"
    name = "telefono"
    value = { formData.telefono }
    onChange = { handleChange }
        />
        </label>

        <label>
    Ciudad:
    <input
          type="text"
    name = "ciudad"
    value = { formData.ciudad }
    onChange = { handleChange }
        />
        </label>

        <label>
    Contacto:
    <input
          type="text"
    name = "contacto"
    value = { formData.contacto }
    onChange = { handleChange }
        />
        </label>

        <label>
    Servicio:
    <input
          type="text"
    name = "servicio"
    value = { formData.servicio }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
    Cantidad:
    <input
          type="number"
    name = "cantidad"
    value = { formData.cantidad }
    min = "0"
    onChange = { handleChange }
    required
        />
        </label>

        <label>
    Unidad:
    <input
          type="text"
    name = "unidad"
    value = { formData.unidad }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
        Precio Unitario:
    <input
          type="number"
    name = "precio_unitario"
    value = { formData.precio_unitario }
    min = "0"
    step = "0.01"
    onChange = { handleChange }
    required
        />
        </label>

        <label>
    Subtotal:
    <input type="number" value = { formData.subtotal } readOnly />
        </label>

        <label>
    IVA(19 %):
    <input type="number" value = { formData.iva } readOnly />
        </label>

        <label>
    Total:
    <input type="number" value = { formData.total } readOnly />
        </label>

        <label>
    Condiciones:
    <textarea
          name="condiciones"
    value = { formData.condiciones }
    onChange = { handleChange }
        />
        </label>

        <label>
        Fecha Emisión:
    <input
          type="date"
    name = "fecha_emision"
    value = { formData.fecha_emision }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
        Válida Hasta:
    <input
          type="date"
    name = "valida_hasta"
    value = { formData.valida_hasta }
    onChange = { handleChange }
    required
        />
        </label>

        <label>
    Estado:
    <select
          name="estado"
    value = { formData.estado }
    onChange = { handleChange }
    required
        >
        <option value="pendiente" > Pendiente </option>
            < option value = "aceptada" > Aceptada </option>
                < option value = "rechazada" > Rechazada </option>
                    </select>
                    </label>

                    < button type = "submit" > Crear Cotización </button>
                        </form>
  );
};

export default CotizacionForm;
