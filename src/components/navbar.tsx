import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
        transition: "background-color 0.3s ease"
    };

    const linkHoverStyle = {
        backgroundColor: "#555"
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={linkStyle} onMouseOver={e => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={e => Object.assign(e.target.style, linkStyle)}>Inicio</Link>
            <Link to="/clientes" style={linkStyle} onMouseOver={e => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={e => Object.assign(e.target.style, linkStyle)}>Clientes</Link>
            <Link to="/servicios" style={linkStyle} onMouseOver={e => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={e => Object.assign(e.target.style, linkStyle)}>Servicios</Link>
            <Link to="/Cotizaciones" style={linkStyle} onMouseOver={e => Object.assign(e.target.style, linkHoverStyle)} onMouseOut={e => Object.assign(e.target.style, linkStyle)}>Cotizaciones</Link>
        </nav>
    );
};

export default Navbar;