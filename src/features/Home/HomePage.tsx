import React from "react";
import { useNavigate } from "react-router-dom";

const modules = [
    { label: "Clientes", path: "/clientes" },
    { label: "Servicios", path: "/servicios" },
    { label: "Productos", path: "/productos" },
    { label: "Cotizaciones", path: "/cotizaciones" },
    { label: "Facturas", path: "/facturas" },
    { label: "Service Desk", path: "/servicedesk" },
    { label: "Ventas", path: "/ventas" },
    { label: "Encuestas", path: "/Encuestas" },
];

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "2rem" }}>
            <h1>CRM Link - Inicio</h1>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "1rem",
                    marginTop: "2rem",
                }}
            >
                {modules.map((mod) => (
                    <button
                        key={mod.path}
                        onClick={() => navigate(mod.path)}
                        style={{
                            padding: "1rem",
                            fontSize: "1rem",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            cursor: "pointer",
                            background: "#f9f9f9",
                            transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "#e6f0ff")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "#f9f9f9")}
                    >
                        {mod.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
