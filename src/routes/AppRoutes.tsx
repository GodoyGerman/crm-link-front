import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientesPage from "../features/clientes/ClientesPage";
import MainLayout from "../layout/MainLayout";
import HomePage from "../features/home/HomePage";

<Route path="/clientes/nuevo" element={<ClienteForm />} />


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="clientes" element={<ClientesPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}



