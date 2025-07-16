
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClientes, borrarCliente, Cliente } from "../../services/clientesService";

const ClientesPage = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchClientes = async () => {
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const eliminarCliente = async (id: number) => {
        if (!window.confirm("¿Estás seguro que quieres eliminar este cliente?")) return;

        try {
            await borrarCliente(id);
            alert("Cliente eliminado con éxito");
            fetchClientes();
        } catch (error) {
            console.error("Error eliminando cliente:", error);
            alert("No se pudo eliminar el cliente");
        }
    };

    const handleEditar = (cliente: Cliente) => {
        navigate(`/clientes/${cliente.id}/editar`);
    };

    const handleNuevoCliente = () => {
        navigate("/clientes/nuevo");
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Clientes</h2>

            {loading ? (
                <p className="text-gray-600">Cargando clientes...</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nombre</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Identificación</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Empresa</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Correo</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Teléfono</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Dirección</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {clientes.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-800">{cliente.id}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{cliente.nombre}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">
                                            {cliente.tipo_identificacion} {cliente.numero_identificacion}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{cliente.nombre_empresa}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{cliente.correo}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{cliente.telefono}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800">{cliente.direccion}</td>
                                        <td className="px-4 py-2 space-x-2">
                                            <button
                                                onClick={() => eliminarCliente(cliente.id)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                            <button
                                                onClick={() => handleEditar(cliente)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleNuevoCliente}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
                        >
                            Nuevo Cliente
                        </button>
                    </div>
                </>
            )}
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

export default ClientesPage;

