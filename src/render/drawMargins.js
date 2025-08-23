export function drawMargins(ctx, layout, scale, offsetX, offsetY, options = {}) {
    const { colors, showMargins = true } = options;
    if (!showMargins) {
        return;
    }
    ctx.strokeStyle = colors.margin;
    ctx.strokeRect(
        Math.round(offsetX + layout.leftMargin * scale),
        Math.round(offsetY + layout.topMargin * scale),
        Math.round(layout.imposedSpaceWidth * scale),
        Math.round(layout.imposedSpaceLength * scale)
    );
}
