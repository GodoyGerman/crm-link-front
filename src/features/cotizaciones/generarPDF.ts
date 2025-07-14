import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Función para convertir una URL de imagen a base64
async function getBase64FromUrl(url: string): Promise<string> {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function generarPDF(cotizacion: any) {
    const doc = new jsPDF();

    // Ajusta esta ruta a donde tengas el logo en tu proyecto (puede ser public/logo.png o assets/logo.png)
    const logoBase64 = await getBase64FromUrl("/logo.png");

    // Agregar logo
    doc.addImage(logoBase64, "PNG", 10, 10, 40, 20);

    // Título
    doc.setFontSize(18);
    doc.text("Link Soluciones Cotización", 105, 20, { align: "center" });

    // Datos cliente
    doc.setFontSize(12);
    doc.text(`Cliente: ${cotizacion.nombre_cliente}`, 10, 40);
    doc.text(`Identificación: ${cotizacion.identificacion}`, 10, 48);
    doc.text(`Correo: ${cotizacion.correo}`, 10, 56);
    doc.text(`Dirección: ${cotizacion.direccion}`, 10, 64);
    doc.text(`Teléfono: ${cotizacion.telefono}`, 10, 72);

    // Fechas
    doc.text(`Fecha emisión: ${cotizacion.fecha_emision}`, 140, 40);
    doc.text(`Valida hasta: ${cotizacion.valida_hasta}`, 140, 48);

    // Tabla de items
    const columns = [
        { header: "Servicio", dataKey: "servicio" },
        { header: "Cantidad", dataKey: "cantidad" },
        { header: "Unidad", dataKey: "unidad" },
        { header: "Precio Unitario", dataKey: "precio_unitario" },
        { header: "Subtotal", dataKey: "subtotal" },
    ];

    const rows = cotizacion.items.map((item: any) => ({
        servicio: item.servicio,
        cantidad: item.cantidad,
        unidad: item.unidad,
        precio_unitario: item.precio_unitario.toFixed(2),
        subtotal: item.subtotal.toFixed(2),
    }));

    autoTable(doc, {
        startY: 80,
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => columns.map((col) => row[col.dataKey])),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    // Totales debajo de la tabla
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text(`Subtotal: $${cotizacion.subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`IVA (19%): $${cotizacion.iva.toFixed(2)}`, 140, finalY + 8);
    doc.text(`Total: $${cotizacion.total.toFixed(2)}`, 140, finalY + 16);

    // Condiciones
    doc.setFontSize(10);
    doc.text("Condiciones:", 10, finalY + 25);
    doc.text(cotizacion.condiciones || "-", 10, finalY + 32, { maxWidth: 180 });

    return doc.output("blob");
}

