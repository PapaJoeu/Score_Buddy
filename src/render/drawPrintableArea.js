export function drawPrintableArea(ctx, layout, scale, offsetX, offsetY, options = {}) {
    const { colors, showPrintableArea = true, marginData = {} } = options;
    const marginWidth = marginData.marginWidth ?? 0;
    const marginLength = marginData.marginLength ?? 0;
    if (!showPrintableArea || (marginWidth <= 0 && marginLength <= 0)) {
        return;
    }

    ctx.fillStyle = colors.printableFill;

    // Top margin
    ctx.fillRect(
        Math.round(offsetX),
        Math.round(offsetY),
        Math.round(layout.sheetWidth * scale),
        Math.round(marginLength * scale)
    );

    // Bottom margin
    ctx.fillRect(
        Math.round(offsetX),
        Math.round(offsetY + (marginLength + layout.usableSheetLength) * scale),
        Math.round(layout.sheetWidth * scale),
        Math.round(marginLength * scale)
    );

    // Left margin
    ctx.fillRect(
        Math.round(offsetX),
        Math.round(offsetY + marginLength * scale),
        Math.round(marginWidth * scale),
        Math.round(layout.usableSheetLength * scale)
    );

    // Right margin
    ctx.fillRect(
        Math.round(offsetX + (marginWidth + layout.usableSheetWidth) * scale),
        Math.round(offsetY + marginLength * scale),
        Math.round(marginWidth * scale),
        Math.round(layout.usableSheetLength * scale)
    );

    // Outline printable area
    ctx.strokeStyle = colors.score;
    ctx.strokeRect(
        Math.round(offsetX + marginWidth * scale),
        Math.round(offsetY + marginLength * scale),
        Math.round(layout.usableSheetWidth * scale),
        Math.round(layout.usableSheetLength * scale)
    );

    // Reset stroke for documents
    ctx.strokeStyle = colors.document;
}
