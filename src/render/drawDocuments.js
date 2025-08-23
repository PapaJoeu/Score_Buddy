export function drawDocuments(ctx, layout, scale, offsetX, offsetY, options = {}) {
    const { colors } = options;
    ctx.strokeStyle = colors.document;
    for (let i = 0; i < layout.docsAcross; i++) {
        for (let j = 0; j < layout.docsDown; j++) {
            const x = offsetX + (layout.leftMargin + i * (layout.docWidth + layout.gutterWidth)) * scale;
            const y = offsetY + (layout.topMargin + j * (layout.docLength + layout.gutterLength)) * scale;
            ctx.strokeRect(
                Math.round(x),
                Math.round(y),
                Math.round(layout.docWidth * scale),
                Math.round(layout.docLength * scale)
            );
        }
    }
}
