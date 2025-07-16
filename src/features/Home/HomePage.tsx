import React from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaCogs,
    FaBoxOpen,
    FaFileInvoice,
    FaComments,
    FaChartLine,
    FaPoll,
    FaTools,
} from "react-icons/fa";

const modules = [
    { label: "Clientes", path: "/clientes", icon: <FaUsers size={28} /> },
    { label: "Servicios", path: "/servicios", icon: <FaCogs size={28} /> },
    { label: "Productos", path: "/productos", icon: <FaBoxOpen size={28} /> },
    { label: "Cotizaciones", path: "/cotizaciones", icon: <FaFileInvoice size={28} /> },
    { label: "Facturas", path: "/facturas", icon: <FaFileInvoice size={28} /> },
    { label: "Service Desk", path: "/servicedesk", icon: <FaTools size={28} /> },
    { label: "Ventas", path: "/ventas", icon: <FaChartLine size={28} /> },
    { label: "Encuestas", path: "/encuestas", icon: <FaPoll size={28} /> },
];

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
                Panel Principal - CRM Link
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {modules.map((mod) => (
                    <div
                        key={mod.path}
                        onClick={() => navigate(mod.path)}
                        className="bg-white rounded-2xl shadow-md border hover:shadow-lg p-6 flex flex-col items-center cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:scale-[1.03]"
                    >
                        <div className="text-blue-600 mb-4">{mod.icon}</div>
                        <span className="text-lg font-medium text-gray-700 text-center">{mod.label}</span>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default HomePage;