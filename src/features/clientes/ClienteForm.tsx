// src/features/clientes/ClienteForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearCliente, getClientePorId, actualizarCliente } from "../../services/clientesService";


const ClienteForm = () => {
    const navigate = useNavigate()
    const { id } = useParams();



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
    useEffect(() => {
        if (id) {
            getClientePorId(Number(id)).then((cliente) => {
                setForm({
                    ...cliente,
                    redes_sociales: {
                        facebook: cliente.redes_sociales?.facebook || "",
                        linkedin: cliente.redes_sociales?.linkedin || "",
                        instagram: cliente.redes_sociales?.instagram || "",
                    },
                });
            }).catch((error) => {
                console.error("Error cargando cliente:", error);
            });
        }
    }, [id]);

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
            if (id) {
                await actualizarCliente(Number(id), form);
                alert("Cliente actualizado con éxito");
            } else {
                await crearCliente(form);
                alert("Cliente creado con éxito");
            }
            navigate("/clientes");
        } catch (error) {
            console.error("Error al guardar cliente:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Nuevo Cliente</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="nombre"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="tipo_identificacion"
                        placeholder="Tipo ID"
                        value={form.tipo_identificacion}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="numero_identificacion"
                        placeholder="Número ID"
                        value={form.numero_identificacion}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="correo"
                        placeholder="Correo"
                        value={form.correo}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="telefono"
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="direccion"
                        placeholder="Dirección"
                        value={form.direccion}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="ciudad"
                        placeholder="Ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="nombre_empresa"
                        placeholder="Empresa"
                        value={form.nombre_empresa}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="segmento"
                        placeholder="Segmento"
                        value={form.segmento}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="facebook"
                        placeholder="Facebook"
                        value={form.redes_sociales.facebook}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="linkedin"
                        placeholder="LinkedIn"
                        value={form.redes_sociales.linkedin}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="instagram"
                        placeholder="Instagram"
                        value={form.redes_sociales.instagram}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        name="medio_adquisicion"
                        placeholder="Medio de adquisición"
                        value={form.medio_adquisicion}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div className="flex items-center space-x-3 mt-4">
                    <label className="text-sm text-gray-700 font-medium">Activo:</label>
                    <input
                        type="checkbox"
                        name="activo"
                        checked={form.activo}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, activo: e.target.checked }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow"
                >
                    Guardar Cliente
                </button>
            </form>
        </div>
    );
};

export default ClienteForm;

