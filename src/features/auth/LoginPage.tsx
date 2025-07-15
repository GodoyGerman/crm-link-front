import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/login", {
                correo: correo,
                contraseña: contrasena
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const { access_token } = response.data;
            localStorage.setItem("token", access_token);  // Aquí está correcto

            navigate("/");  // Navegas a la página principal
        } catch (err) {
            setError("Credenciales inválidas");
            console.error(err);
        }
    };


    return (
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Correo:</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default LoginPage;
