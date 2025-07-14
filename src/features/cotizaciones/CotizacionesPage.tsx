import React, { useEffect, useState } from "react";
import { getCotizaciones, Cotizacion, enviarCotizacionPorCorreo, actualizarEstadoCotizacion } from "../../services/cotizacionesService";
import { useNavigate } from "react-router-dom";
import { generarPDF } from "./generarPDF";


export default function CotizacionesPage() {
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleEditarCotizacion = (id: number) => {
        navigate(`/cotizaciones/editar/${id}`);
    };

    const handleEnviarCorreo = async (cotizacion: Cotizacion) => {
        if (!cotizacion.id || !cotizacion.correo) {
            alert("Falta ID o correo en la cotización");
            return;
        }
        try {
            const pdfBlob = await generarPDF(cotizacion); // Debe devolver Blob o File
            const pdfFile = new File([pdfBlob], `cotizacion_${cotizacion.id}.pdf`, { type: "application/pdf" });

            await enviarCotizacionPorCorreo(cotizacion.correo, cotizacion.id, pdfFile);
            await actualizarEstadoCotizacion(cotizacion.id, "enviado");

            // Actualizar estado local para reflejar cambio inmediato en UI
            setCotizaciones(prev =>
                prev.map(c =>
                    c.id === cotizacion.id ? { ...c, estado: "enviado" } : c
                )
            );

            alert("Correo enviado y estado actualizado");
        } catch (err) {
            console.error("Error enviando correo:", err);
            alert("No se pudo enviar el correo");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCotizaciones();
                setCotizaciones(data);
            } catch (error) {
                console.error("Error al obtener cotizaciones:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Cargando cotizaciones...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Listado de Cotizaciones</h1>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Id</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Nombre Cliente</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tipo Identificación</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Identificación</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Fecha Emisión</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Valida Hasta</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Estado</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Condiciones</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Acciones</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Enviar</th>
                    </tr>
                </thead>
                <tbody>
                    {cotizaciones.map((cot) => (
                        <tr key={cot.id}>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{cot.id}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{cot.nombre_cliente}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{cot.tipo_identificacion}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{cot.identificacion}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {new Date(cot.fecha_emision).toLocaleDateString()}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {new Date(cot.valida_hasta).toLocaleDateString()}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{cot.estado}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{cot.condiciones}</td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                <button
                                    onClick={() => handleEditarCotizacion(cot.id!)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Editar
                                </button>
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                <button
                                    onClick={() => handleEnviarCorreo(cot)}
                                    className="bg-blue-600 text-white px-2 py-1 rounded"
                                >
                                    Enviar por correo
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={() => navigate("/cotizaciones/nueva")}
                style={{
                    marginTop: "1rem",
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                + Nueva Cotización
            </button>
        </div>
    );
}



