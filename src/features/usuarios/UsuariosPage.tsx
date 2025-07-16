// src/features/usuarios/UsuariosPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsuarios, eliminarUsuario, Usuario } from "../../services/usuariosService";




const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const navigate = useNavigate();

    const cargarUsuarios = async () => {
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const handleEditar = (id: number) => {
        navigate(`/usuarios/${id}/editar`);
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

        try {
            await eliminarUsuario(id);
            alert("Usuario eliminado correctamente");
            cargarUsuarios();
        } catch (error) {
            alert("No se pudo eliminar el usuario");
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Usuarios</h2>

            <button
                onClick={() => navigate("/usuarios/nuevo")}
                className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
            >
                Crear Usuario
            </button>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium rounded-tl-md">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Correo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Rol</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Activo</th>
                            <th className="px-4 py-3 text-left text-sm font-medium rounded-tr-md">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {usuarios.map((usuario, index) => (
                            <tr
                                key={usuario.id}
                                className={`hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                            >
                                <td className="px-4 py-2 text-sm text-gray-800">{usuario.id}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{usuario.nombre}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{usuario.correo}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{usuario.rol}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{usuario.activo ? "Sí" : "No"}</td>
                                <td className="px-4 py-2 text-sm text-gray-800 space-x-2">
                                    <button
                                        onClick={() => handleEditar(usuario.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(usuario.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsuariosPage;
