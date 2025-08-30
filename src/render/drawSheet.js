/**
 * Draws the outer boundary of a sheet/document on a Canvas 2D context.
 *
 * The rectangle is drawn using the color specified by `options.colors.document`.
 * Coordinates and size are multiplied by `scale` and rounded to integer pixel values
 * to reduce sub-pixel rendering artifacts.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context to draw on.
 * @param {{sheetWidth: number, sheetLength: number}} layout - Sheet layout dimensions (unscaled).
 * @param {number} scale - Scale factor applied to layout dimensions.
 * @param {number} offsetX - Horizontal offset (in pixels) where the sheet should be drawn.
 * @param {number} offsetY - Vertical offset (in pixels) where the sheet should be drawn.
 * @param {Object} [options={}] - Optional settings.
 * @param {{document: string}} [options.colors] - Color definitions; `document` is a CSS color string used for the stroke.
 * @returns {void}
 */
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
