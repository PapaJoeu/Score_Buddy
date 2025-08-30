/**
 * Draw horizontal dashed "score" guide lines across each document column for the given score positions.
 *
 * For each entry in options.scorePositions, a horizontal line is drawn at
 * y = offsetY + pos.y * scale. For each document column (0 .. layout.docsAcross - 1)
 * the line spans from:
 *   startX = offsetX + (layout.leftMargin + i * (layout.docWidth + layout.gutterWidth)) * scale
 * to
 *   endX = startX + layout.docWidth * scale
 *
 * Coordinates are rounded with Math.round before stroking. While drawing the function
 * sets the canvas 2D context's strokeStyle to options.colors.score and uses a dashed
 * pattern ([5, 5]); the dash pattern is reset to an empty array at the end. Note that
 * the previous strokeStyle is not restored by this function.
 *
 * If options.scorePositions is falsy or an empty array, the function is a no-op.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context to draw onto.
 * @param {Object} layout - Layout measurements in unscaled units.
 * @param {number} layout.docsAcross - Number of document columns across the canvas.
 * @param {number} layout.leftMargin - Left margin (unscaled) before the first document column.
 * @param {number} layout.docWidth - Width (unscaled) of each document column.
 * @param {number} layout.gutterWidth - Gutter width (unscaled) between adjacent document columns.
 * @param {number} scale - Scaling factor applied to layout measurements and score positions.
 * @param {number} offsetX - Horizontal pixel offset applied after scaling.
 * @param {number} offsetY - Vertical pixel offset applied after scaling.
 * @param {Object} [options] - Optional parameters.
 * @param {Object} [options.colors] - Color mapping used for drawing.
 * @param {string} [options.colors.score] - Stroke color used for the score lines.
 * @param {Array.<{y:number}>} [options.scorePositions=[]] - Array of positions (in unscaled document coordinates)
 *        specifying vertical positions at which to draw score lines. Each item must have a numeric `y` property.
 * @returns {void}
 */
export function drawScoreLines(ctx, layout, scale, offsetX, offsetY, options = {}) {
    const { colors, scorePositions = [] } = options;
    if (!scorePositions.length) {
        return;
    }
    ctx.strokeStyle = colors.score;
    ctx.setLineDash([5, 5]);
    scorePositions.forEach(pos => {
        const y = offsetY + pos.y * scale;
        for (let i = 0; i < layout.docsAcross; i++) {
            const startX = offsetX + (layout.leftMargin + i * (layout.docWidth + layout.gutterWidth)) * scale;
            const endX = startX + layout.docWidth * scale;
            ctx.beginPath();
            ctx.moveTo(Math.round(startX), Math.round(y));
            ctx.lineTo(Math.round(endX), Math.round(y));
            ctx.stroke();
        }
    });
    ctx.setLineDash([]);
}
