import React, { useEffect, useState } from "react";
import { getCotizaciones, Cotizacion } from "../../services/cotizacionesService";
import { useParams, useNavigate } from "react-router-dom";

const CotizacionesPage = () => {
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);

    const handleNuevaCotizacion = () => {
        navigate("/cotizaciones/nuevo");


    };

    useEffect(() => {
        async function cargarCotizaciones() {
            try {
                const data = await getCotizaciones();
                console.log("Cotizaciones recibidas:", data); // Para debug
                setCotizaciones(data);
            } catch (error) {
                console.error("Error al cargar cotizaciones", error);
            } finally {
                setLoading(false);
            }
        }
        cargarCotizaciones();
    }, []);

    if (loading) return <p>Cargando cotizaciones...</p>;

    return (
        <div>
            <h1>Lista de Cotizaciones</h1>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f0f0f0" }}>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Id</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Nombre Cliente</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Tipo Identificación</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Identificación</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Fecha Emisión</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Valida Hasta</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Estado</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Condiciones</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cotizaciones.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ textAlign: "center", padding: "8px" }}>
                                No hay cotizaciones para mostrar.
                            </td>
                        </tr>
                    ) : (
                        cotizaciones.map((cot) => (
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
                                        onClick={() => handleEditar(cotizacion.id)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Editar
                                    </button>
                                    <button onClick={() => descargarPdf(cot.id)}>Descargar PDF</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div style={{ marginTop: "20px" }}>
                <button onClick={handleNuevaCotizacion}>Nuevo Servicio</button>
                {/* resto */}
            </div>
        </div>
    );
};

function descargarPdf(id: number) {
    const url = `http://localhost:8000/cotizaciones/${id}/pdf`;
    window.open(url, "_blank");
}

export default CotizacionesPage;
