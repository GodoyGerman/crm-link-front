import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientesPage from "../features/clientes/ClientesPage";
import MainLayout from "../layout/MainLayout";
import HomePage from "../features/home/HomePage";
import ClienteForm from "../features/clientes/ClienteForm";
import ServiciosPage from "../features/servicios/ServiciosPage";
import ServicioForm from "../features/servicios/ServicioForm";
import CotizacionesPage from "../features/cotizaciones/CotizacionesPage";
import CotizacionForm from "../features/cotizaciones/CotizacionForm";
import LoginPage from "../features/auth/LoginPage"; // <-- asegúrate de tenerlo

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta login independiente del layout */}
                <Route path="/login" element={<LoginPage />} />

                {/* Rutas protegidas dentro del layout */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="clientes" element={<ClientesPage />} />
                    <Route path="clientes/nuevo" element={<ClienteForm />} />
                    <Route path="clientes/:id/editar" element={<ClienteForm />} />
                    <Route path="servicios" element={<ServiciosPage />} />
                    <Route path="servicios/nuevo" element={<ServicioForm />} />
                    <Route path="servicios/:id/editar" element={<ServicioForm />} />
                    <Route path="cotizaciones" element={<CotizacionesPage />} />
                    <Route path="cotizaciones/nueva" element={<CotizacionForm />} />
                    <Route path="cotizaciones/editar/:id" element={<CotizacionForm modo="editar" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


