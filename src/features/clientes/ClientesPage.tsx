
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
        <div style={{ padding: "2rem" }}>
            <h2>Clientes</h2>
            {loading ? (
                <p>Cargando clientes...</p>
            ) : (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Nombre</th>
                                <th style={thStyle}>Identificación</th>
                                <th style={thStyle}>Empresa</th>
                                <th style={thStyle}>Correo</th>
                                <th style={thStyle}>Teléfono</th>
                                <th style={thStyle}>Dirección</th>
                                <th style={thStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td style={tdStyle}>{cliente.id}</td>
                                    <td style={tdStyle}>{cliente.nombre}</td>
                                    <td style={tdStyle}>
                                        {cliente.tipo_identificacion} {cliente.numero_identificacion}
                                    </td>
                                    <td style={tdStyle}>{cliente.nombre_empresa}</td>
                                    <td style={tdStyle}>{cliente.correo}</td>
                                    <td style={tdStyle}>{cliente.telefono}</td>
                                    <td style={tdStyle}>{cliente.direccion}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => eliminarCliente(cliente.id!)}
                                            style={{ marginRight: 8, backgroundColor: "red", color: "white" }}
                                        >
                                            Eliminar
                                        </button>
                                        <button onClick={() => handleEditar(cliente)}>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: 20 }}>
                        <button onClick={handleNuevoCliente}>Nuevo Cliente</button>
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

