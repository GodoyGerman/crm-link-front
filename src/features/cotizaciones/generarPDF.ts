import jsPDF from "jspdf";

export async function generarPDF(cotizacion: any): Promise<Blob> {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Cotización", 10, 10);

    doc.setFontSize(12);
    doc.text(`Cliente: ${cotizacion.nombre_cliente}`, 10, 20);
    doc.text(`Tipo Identificación: ${cotizacion.tipo_identificacion}`, 10, 30);
    doc.text(`Identificación: ${cotizacion.identificacion}`, 10, 40);
    doc.text(`Correo: ${cotizacion.correo}`, 10, 50);
    doc.text(`Dirección: ${cotizacion.direccion}`, 10, 60);
    doc.text(`Teléfono: ${cotizacion.telefono}`, 10, 70);
    doc.text(`Ciudad: ${cotizacion.ciudad}`, 10, 80);
    doc.text(`Contacto: ${cotizacion.contacto}`, 10, 90);
    doc.text(`Condiciones: ${cotizacion.condiciones}`, 10, 100);
    doc.text(`Fecha Emisión: ${cotizacion.fecha_emision}`, 10, 110);
    doc.text(`Valida Hasta: ${cotizacion.valida_hasta}`, 10, 120);


    doc.text("Items:", 10, 140);

    let y = 150;
    cotizacion.items.forEach((item: any, index: number) => {
        doc.text(
            `${index + 1}. Servicio: ${item.servicio}, Cantidad: ${item.cantidad}, Unidad: ${item.unidad}, Precio Unitario: ${item.precio_unitario}, Subtotal: ${item.subtotal}`,
            10,
            y
        );
        y += 10;
    });

    doc.text(`Subtotal: ${cotizacion.subtotal}`, 10, y + 10);
    doc.text(`IVA: ${cotizacion.iva}`, 10, y + 20);
    doc.text(`Total: ${cotizacion.total}`, 10, y + 30);

    // 👉 Esta es la parte importante: retornamos el PDF como Blob
    return doc.output("blob");
}

