import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientePorId, actualizarCliente } from "../../services/clientesService";

const EditarClientePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getClientePorId(parseInt(id))
                .then(data => {
                    setForm(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error al cargar cliente", error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in form.redes_sociales) {
            setForm((prev: any) => ({
                ...prev,
                redes_sociales: {
                    ...prev.redes_sociales,
                    [name]: value,
                },
            }));
        } else {
            setForm((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await actualizarCliente(form.id, form);
            alert("Cliente actualizado con éxito");
            navigate("/clientes");
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
        }
    };

    if (loading) return <p>Cargando cliente...</p>;
    if (!form) return <p>Cliente no encontrado</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Editar Cliente</h2>
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
                    <input
                        type="checkbox"
                        name="activo"
                        checked={form.activo}
                        onChange={(e) => setForm((prev: any) => ({ ...prev, activo: e.target.checked }))}
                    />
                </label>
                <br />
                <button type="submit">Actualizar Cliente</button>
            </form>
        </div>
    );
};

export default EditarClientePage;
