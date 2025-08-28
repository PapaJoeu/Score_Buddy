import { createPrintLayout } from './printLayout.js';
import { byId, qs, qsa } from '../dom/dom.js';

const printButton = byId('printButton');

// Generates a two-page PDF:
//  • Page 1: layout visualizer
//  • Page 2: data cards stacked vertically
// Pages are sized for a 12x18 inch sheet in landscape orientation
// with a half‑inch margin on all sides.

printButton.addEventListener('click', async () => {
    const visualizer = qs('.visualizer-column');
    const cards = qsa('.data-card');
    const { container, pages } = createPrintLayout(visualizer, cards);
    document.body.appendChild(container);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [18, 12] });

    const margin = 0.5;
    const pageWidth = 18 - margin * 2;

    for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2 });
        const image = canvas.toDataURL('image/png');
        const height = (canvas.height / canvas.width) * pageWidth;
        if (i > 0) pdf.addPage([18, 12], 'landscape');
        pdf.addImage(image, 'PNG', margin, margin, pageWidth, height);
    }

    document.body.removeChild(container);
    pdf.save('layout.pdf');
});
