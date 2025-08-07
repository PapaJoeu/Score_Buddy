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
export function drawLayout(canvas, layout, scorePositions = []) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match its display size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Calculate scale to make sheet width 80% of canvas width
    const scale = (canvas.width * 0.8) / layout.sheetWidth;

    // Scale the canvas height to match the sheet aspect ratio
    canvas.height = layout.sheetLength * scale * 1.1; // Add 10% for padding

    // Calculate offsets to center the sheet
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

    // Draw sheet margin boundary
    if (layout.sheetMargin > 0) {
        ctx.strokeStyle = 'orange';
        ctx.strokeRect(
            Math.round(offsetX + layout.sheetMargin * scale),
            Math.round(offsetY + layout.sheetMargin * scale),
            Math.round((layout.sheetWidth - 2 * layout.sheetMargin) * scale),
            Math.round((layout.sheetLength - 2 * layout.sheetMargin) * scale)
        );
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
            // Adjust y position based on whether margins are included
            const y = offsetY + (pos.scoredWithMargins ? pos.y : pos.y + layout.topMargin) * scale;
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