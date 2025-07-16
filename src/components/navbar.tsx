import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link
                        to="/"
                        className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/clientes"
                        className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                        Clientes
                    </Link>
                    <Link
                        to="/servicios"
                        className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                        Servicios
                    </Link>
                    <Link
                        to="/cotizaciones"
                        className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                        Cotizaciones
                    </Link>
                    <Link
                        to="/usuarios"
                        className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                        Usuarios
                    </Link>
                </div>

                <button
                    onClick={handleLogout}
                    className="text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
