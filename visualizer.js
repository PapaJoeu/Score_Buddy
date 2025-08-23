// visualizer.js
import { getColorTokens } from './src/config/colorConfig.js';
import { drawSheet } from './src/render/drawSheet.js';
import { drawPrintableArea } from './src/render/drawPrintableArea.js';
import { drawDocuments } from './src/render/drawDocuments.js';
import { drawMargins } from './src/render/drawMargins.js';
import { drawScoreLines } from './src/render/drawScoreLines.js';
import { drawDocumentLabels } from './src/render/drawDocumentLabels.js';

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

// Draw the layout on the canvas
export function drawLayout(canvas, layout, scorePositions = [], marginData = {}, zoom = 1, options = {}) {
    const ctx = canvas.getContext('2d');
    const colors = getColorTokens();
    const helperOptions = {
        showDocNumbers: true,
        showPrintableArea: true,
        showMargins: true,
        ...options,
        marginData,
        scorePositions,
        colors
    };

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

    // Draw layout components
    drawSheet(ctx, layout, scale, offsetX, offsetY, helperOptions);
    drawPrintableArea(ctx, layout, scale, offsetX, offsetY, helperOptions);
    drawDocuments(ctx, layout, scale, offsetX, offsetY, helperOptions);
    drawMargins(ctx, layout, scale, offsetX, offsetY, helperOptions);
    drawScoreLines(ctx, layout, scale, offsetX, offsetY, helperOptions);
    ctx.translate(-0.5, -0.5);
    drawDocumentLabels(ctx, layout, scale, offsetX, offsetY, helperOptions);
}