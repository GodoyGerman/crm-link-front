// src/features/clientes/ClienteForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearCliente } from "../../services/clientesService";

const ClienteForm = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        tipo_identificacion: "",
        numero_identificacion: "",
        correo: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        nombre_empresa: "",
        segmento: "",
        redes_sociales: {
            facebook: "",
            linkedin: "",
            instagram: "",
        },
        medio_adquisicion: "",
        activo: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in form.redes_sociales) {
            setForm(prev => ({
                ...prev,
                redes_sociales: {
                    ...prev.redes_sociales,
                    [name]: value,
                },
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await crearCliente(form);
            alert("Cliente creado con éxito");
            navigate("/clientes");
        } catch (error) {
            console.error("Error al crear cliente:", error);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Nuevo Cliente</h2>
            <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} /><br />
                <input name="tipo_identificacion" placeholder="Tipo ID" value={form.tipo_identificacion} onChange={handleChange} /><br />
                <input name="numero_identificacion" placeholder="Número ID" value={form.numero_identificacion} onChange={handleChange} /><br />
                <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} /><br />
                <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} /><br />
                <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} /><br />
                <input name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} /><br />
                <input name="nombre_empresa" placeholder="Empresa" value={form.nombre_empresa} onChange={handleChange} /><br />
                <input name="segmento" placeholder="Segmento" value={form.segmento} onChange={handleChange} /><br />
                <input name="facebook" placeholder="Facebook" value={form.redes_sociales.facebook} onChange={handleChange} /><br />
                <input name="linkedin" placeholder="LinkedIn" value={form.redes_sociales.linkedin} onChange={handleChange} /><br />
                <input name="instagram" placeholder="Instagram" value={form.redes_sociales.instagram} onChange={handleChange} /><br />
                <input name="medio_adquisicion" placeholder="Medio de adquisición" value={form.medio_adquisicion} onChange={handleChange} /><br />
                <label>
                    Activo:
                    <input type="checkbox" name="activo" checked={form.activo} onChange={(e) => setForm(prev => ({ ...prev, activo: e.target.checked }))} />
                </label><br />
                <button type="submit">Guardar Cliente</button>
            </form>
        </div>
    );
};

export default ClienteForm;

