export function drawSheet(ctx, layout, scale, offsetX, offsetY, options = {}) {
    const { colors } = options;
    ctx.strokeStyle = colors.document;
    ctx.strokeRect(
        Math.round(offsetX),
        Math.round(offsetY),
        Math.round(layout.sheetWidth * scale),
        Math.round(layout.sheetLength * scale)
    );
}
