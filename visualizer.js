// visualizer.js

// Calculate the scale for an adaptive layout
export function calculateAdaptiveScale(layout, canvasWidth, canvasHeight) {
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const sheetAspectRatio = layout.sheetWidth / layout.sheetLength;
    
    let scale;
    if (sheetAspectRatio > canvasAspectRatio) {
        // Sheet is wider than canvas
        scale = (canvasWidth * 0.9) / layout.sheetWidth;
    } else {
        // Sheet is taller than canvas
        scale = (canvasHeight * 0.9) / layout.sheetLength;
    }
    
    return scale;
}

// Draw document labels on the canvas
export function drawDocumentLabels(ctx, layout, scale, offsetX, offsetY) {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'blue';
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

// Draw the layout on the canvas
export function drawLayout(canvas, layout, scorePositions = [], marginData = {}, zoom = 1) {
    const ctx = canvas.getContext('2d');

    const container = canvas.parentElement;
    if (container && container.style) {
        container.style.setProperty('--sheet-aspect', `${layout.sheetWidth} / ${layout.sheetLength}`);
    }

    const width = container ? container.clientWidth : canvas.width;
    const height = container ? container.clientHeight : canvas.height;
    canvas.width = width;
    canvas.height = height;

    const baseScale = Math.min(width / layout.sheetWidth, height / layout.sheetLength) * 0.9;
    const scale = baseScale * zoom;

    const offsetX = (canvas.width - layout.sheetWidth * scale) / 2;
    const offsetY = (canvas.height - layout.sheetLength * scale) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Use crisp edges for all lines
    ctx.imageSmoothingEnabled = false;
    ctx.translate(0.5, 0.5);

    // Draw sheet
    ctx.strokeStyle = 'black';
    ctx.strokeRect(
        Math.round(offsetX),
        Math.round(offsetY),
        Math.round(layout.sheetWidth * scale),
        Math.round(layout.sheetLength * scale)
    );

    // Draw printable area overlay before documents
    const marginWidth = marginData.marginWidth ?? 0;
    const marginLength = marginData.marginLength ?? 0;
    if (marginWidth > 0 || marginLength > 0) {
        ctx.fillStyle = 'rgba(255, 0, 255, 0.25)';

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
        ctx.strokeStyle = 'magenta';
        ctx.strokeRect(
            Math.round(offsetX + marginWidth * scale),
            Math.round(offsetY + marginLength * scale),
            Math.round(layout.usableSheetWidth * scale),
            Math.round(layout.usableSheetLength * scale)
        );

        // Reset stroke for documents
        ctx.strokeStyle = 'black';
    }

    // Draw documents
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

    // Draw margins
    ctx.strokeStyle = 'red';
    ctx.strokeRect(
        Math.round(offsetX + layout.leftMargin * scale),
        Math.round(offsetY + layout.topMargin * scale),
        Math.round(layout.imposedSpaceWidth * scale),
        Math.round(layout.imposedSpaceLength * scale)
    );

    // Draw score lines
    // TODO: Add support for different gutter width or length values in calculating the score positions
    if (scorePositions.length > 0) {
        ctx.strokeStyle = 'magenta';
        ctx.setLineDash([5, 5]);
        scorePositions.forEach(pos => {
            const y = offsetY + pos.y * scale;
            ctx.beginPath();
            ctx.moveTo(offsetX, Math.round(y));
            ctx.lineTo(offsetX + layout.sheetWidth * scale, Math.round(y));
            ctx.stroke();
        });
        ctx.setLineDash([]);
    }

    ctx.translate(-0.5, -0.5);
    // Draw document labels
    drawDocumentLabels(ctx, layout, scale, offsetX, offsetY);
}