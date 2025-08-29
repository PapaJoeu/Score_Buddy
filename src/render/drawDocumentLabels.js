export function drawDocumentLabels(ctx, layout, scale, offsetX, offsetY, options = {}) {
    const { showDocNumbers = true, colors } = options;
    if (!showDocNumbers) {
        return;
    }

    // Set font size relative to document size 
    ctx.font = `${Math.round(1.5 * scale)}px Arial`;
    ctx.fillStyle = (colors && colors.label) ? colors.label : '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let docNumber = 1;
    for (let i = 0; i < layout.docsAcross; i++) {
        for (let j = 0; j < layout.docsDown; j++) {
            const x = offsetX + (layout.leftMargin + (i + 0.5) * (layout.docWidth + layout.gutterWidth)) * scale;
            const y = offsetY + (layout.topMargin + (j + 0.5) * (layout.docLength + layout.gutterLength)) * scale;
            ctx.fillText(docNumber.toString(), x, y);
            docNumber++;
        }
    }
}
