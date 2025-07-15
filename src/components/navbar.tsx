import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const navStyle = {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#333",
        color: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    };

    const linkStyle = {
        color: "#fff",
        textDecoration: "none",
        fontWeight: "500",
        fontSize: "16px",
        padding: "8px 16px",
        borderRadius: "4px",
        transition: "background-color 0.3s ease",
        cursor: "pointer"
    };

    const linkHoverStyle = {
        backgroundColor: "#555"
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav style={navStyle}>
            <Link
                to="/"
                style={linkStyle}
                onMouseOver={e => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseOut={e => Object.assign(e.currentTarget.style, linkStyle)}
            >
                Inicio
            </Link>
            <Link
                to="/clientes"
                style={linkStyle}
                onMouseOver={e => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseOut={e => Object.assign(e.currentTarget.style, linkStyle)}
            >
                Clientes
            </Link>
            <Link
                to="/servicios"
                style={linkStyle}
                onMouseOver={e => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseOut={e => Object.assign(e.currentTarget.style, linkStyle)}
            >
                Servicios
            </Link>
            <Link
                to="/cotizaciones"
                style={linkStyle}
                onMouseOver={e => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseOut={e => Object.assign(e.currentTarget.style, linkStyle)}
            >
                Cotizaciones
            </Link>

            <span
                style={linkStyle}
                onClick={handleLogout}
                onMouseOver={e => Object.assign(e.currentTarget.style, linkHoverStyle)}
                onMouseOut={e => Object.assign(e.currentTarget.style, linkStyle)}
            >
                Cerrar Sesión
            </span>
        </nav>
    );
};

export default Navbar;