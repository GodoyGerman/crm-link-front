import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { crearUsuario, getUsuarioPorId, actualizarUsuario, Usuario } from "../../services/usuariosService";

const formStyle = {
    maxWidth: "400px",
    margin: "2rem auto",
    padding: "2rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600,
    color: "#333"
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    boxSizing: "border-box" as "border-box"
};

const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "16px",
    transition: "background-color 0.3s ease"
};

const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    marginLeft: 8
};

const UsuarioForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario>({
        nombre: "",
        correo: "",
        contraseña: "",
        rol: "usuario",
        activo: true
    });

    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (id) {
            getUsuarioPorId(parseInt(id))
                .then(data => {
                    setUsuario({ ...data, contraseña: "" }); // no mostrar contraseña
                })
                .catch(() => setError("No se pudo cargar el usuario"));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUsuario(prev => ({
            ...prev,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await actualizarUsuario(parseInt(id), usuario);
                alert("Usuario actualizado");
            } else {
                await crearUsuario(usuario);
                alert("Usuario creado");
            }
            navigate("/usuarios");
        } catch {
            setError("Error al guardar el usuario");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>{id ? "Editar Usuario" : "Crear Usuario"}</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form style={formStyle} onSubmit={handleSubmit} autoComplete="off">
                <label style={labelStyle}>Nombre:</label>
                <input
                    style={inputStyle}
                    type="text"
                    name="nombre"
                    value={usuario.nombre}
                    onChange={handleChange}
                    required
                />

                <label style={labelStyle}>Correo:</label>
                <input
                    style={inputStyle}
                    type="email"
                    name="correo"
                    value={usuario.correo}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />

                <label style={labelStyle}>Contraseña:</label>
                <input
                    style={inputStyle}
                    type="password"
                    name="contraseña"
                    value={usuario.contraseña}
                    onChange={handleChange}
                    required={!id}
                    autoComplete="new-password"
                />

                <label style={labelStyle}>Rol:</label>
                <select
                    style={inputStyle}
                    name="rol"
                    value={usuario.rol}
                    onChange={handleChange}
                    required
                >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                </select>

                <label style={{ ...labelStyle, display: "flex", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        name="activo"
                        checked={usuario.activo}
                        onChange={handleChange}
                        style={{ marginRight: 8 }}
                    />
                    Activo
                </label>

                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#007bff")}
                >
                    {id ? "Actualizar" : "Crear"}
                </button>

                <button
                    type="button"
                    style={cancelButtonStyle}
                    onClick={() => navigate("/usuarios")}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#5a6268")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#6c757d")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default UsuarioForm;

