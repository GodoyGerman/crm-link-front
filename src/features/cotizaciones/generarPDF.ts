import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Función para convertir una imagen en base64
async function getBase64FromUrl(url: string): Promise<string> {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function generarPDF(cotizacion: any) {
    const doc = new jsPDF();

    // Logo
    const logoBase64 = await getBase64FromUrl("/logo.png");
    doc.addImage(logoBase64, "PNG", 10, 10, 40, 20);

    // Título
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Link Soluciones - Cotización", 105, 20, { align: "center" });

    // Línea separadora
    doc.setDrawColor(200);
    doc.line(10, 32, 200, 32);

    // Datos del Cliente
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text("Datos del Cliente", 10, 40);
    doc.setFontSize(10);
    doc.text(`Nombre: ${cotizacion.nombre_cliente}`, 10, 48);
    doc.text(`Identificación: ${cotizacion.identificacion}`, 10, 54);
    doc.text(`Correo: ${cotizacion.correo}`, 10, 60);
    doc.text(`Dirección: ${cotizacion.direccion}`, 10, 66);
    doc.text(`Teléfono: ${cotizacion.telefono}`, 10, 72);

    // Fechas
    doc.setFontSize(12);
    doc.text("Fechas", 140, 40);
    doc.setFontSize(10);
    doc.text(`Emisión: ${cotizacion.fecha_emision}`, 140, 48);
    doc.text(`Válida hasta: ${cotizacion.valida_hasta}`, 140, 54);

    // Tabla de ítems
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
        precio_unitario: `$${item.precio_unitario.toFixed(2)}`,
        subtotal: `$${item.subtotal.toFixed(2)}`,
    }));

    autoTable(doc, {
        startY: 85,
        head: [columns.map(c => c.header)],
        body: rows.map(r => columns.map(c => r[c.dataKey])),
        styles: { fontSize: 10 },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
        },
        bodyStyles: { textColor: 30 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        theme: "grid",
        didDrawPage: (data) => {
            const pageCount = doc.internal.getNumberOfPages();
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height || pageSize.getHeight();

            doc.setFontSize(9);
            doc.setTextColor(100);

            // Footer centrado con agradecimiento
            doc.text(
                `Página ${data.pageNumber} de ${pageCount} — Gracias por confiar en Link Soluciones`,
                pageSize.width / 2,
                pageHeight - 10,
                { align: "center" }
            );
        },
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text(`Subtotal: $${cotizacion.subtotal.toFixed(2)}`, 200, finalY, { align: "right" });
    doc.text(`IVA (19%): $${cotizacion.iva.toFixed(2)}`, 200, finalY + 8, { align: "right" });
    doc.text(`Total: $${cotizacion.total.toFixed(2)}`, 200, finalY + 16, { align: "right" });
    doc.setFont(undefined, "normal");

    // Condiciones
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text("Condiciones:", 10, finalY + 30);
    doc.setFontSize(9);
    doc.text(cotizacion.condiciones || "No se especificaron condiciones.", 10, finalY + 37, {
        maxWidth: 190,
        align: "left",
    });

    // Firma o sello
    doc.setFontSize(10);
    doc.text("Firma / Gerente: Germán Godoy", 10, finalY + 60);
    doc.setDrawColor(150);
    doc.line(10, finalY + 65, 80, finalY + 65); // Línea firma
    doc.text("Link Soluciones SAS", 10, finalY + 70);
    doc.text("comercial@linksoluciones.com.co", 10, finalY + 75);
    doc.text("NIT: 901483324-1", 10, finalY + 80);
    doc.text("https://www.linksoluciones.com.co/", 10, finalY + 85);

    // Descargar automáticamente
    const nombreArchivo = `Cotización-LINK-${cotizacion.numero || "SIN-NUMERO"}.pdf`;
    doc.save(nombreArchivo);

    return doc.output("blob");
}

