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
