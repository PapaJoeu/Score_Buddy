import { drawLayout } from '../../visualizer.js';
import { calculateLayoutDetails as calcDetails, calculateProgramSequence as calcSequence } from './calculations.js';
import { renderProgramSequence } from '../ui/display.js';
import { updateSummaryTab } from '../ui/outputPanel.js';
import { byId } from '../dom/dom.js';

let zoomFactor = 1;
const ZOOM_STEP = 1.1;

let storedOptimalConfig = null;
export function retrieveOptimalConfig() {
    return storedOptimalConfig;
}

export function findOptimalLayout(elements) {
    const docWidth = parseFloat(elements.docWidth.value);
    const docLength = parseFloat(elements.docLength.value);
    const gutterWidth = parseFloat(elements.gutterWidth.value);
    const gutterLength = parseFloat(elements.gutterLength.value);
    const marginWidth = parseFloat(elements.marginWidth.value);
    const marginLength = parseFloat(elements.marginLength.value);

    const sheetSizes = [
        { width: 12, length: 18 },
        { width: 13, length: 19 }
    ];

    let bestLayout = null;
    let bestConfig = null;
    let bestNUp = -1;
    let bestArea = -1;

    sheetSizes.forEach(sheet => {
        const orientations = [
            { width: sheet.width, length: sheet.length, sheetRotated: false },
            { width: sheet.length, length: sheet.width, sheetRotated: true }
        ];

        orientations.forEach(orientation => {
            const docOptions = [
                { width: docWidth, length: docLength, docRotated: false },
                { width: docLength, length: docWidth, docRotated: true }
            ];

            docOptions.forEach(doc => {
                const layout = calcDetails({
                    sheetWidth: orientation.width,
                    sheetLength: orientation.length,
                    docWidth: doc.width,
                    docLength: doc.length,
                    gutterWidth,
                    gutterLength,
                    marginWidth,
                    marginLength
                });

                const nUp = layout.docsAcross * layout.docsDown;
                const sheetArea = orientation.width * orientation.length;
                if (
                    nUp > bestNUp ||
                    (nUp === bestNUp && sheetArea > bestArea)
                ) {
                    bestLayout = layout;
                    bestConfig = {
                        sheetWidth: orientation.width,
                        sheetLength: orientation.length,
                        sheetSize: `${sheet.width}x${sheet.length}`,
                        sheetRotated: orientation.sheetRotated,
                        docRotated: doc.docRotated
                    };
                    bestNUp = nUp;
                    bestArea = sheetArea;
                }
            });
        });
    });

    return { layout: bestLayout, config: bestConfig };
}

export function calculateLayout(elements, scorePositions = [], clearScores = () => {}) {
    const layout = calculateLayoutDetails(elements);
    const currentNUp = layout.docsAcross * layout.docsDown;

    const { layout: optimalLayout, config } = findOptimalLayout(elements);
    const optimalNUp = optimalLayout.docsAcross * optimalLayout.docsDown;

    if (optimalNUp > currentNUp) {
        storedOptimalConfig = config;
        elements.optimalLayoutButton && elements.optimalLayoutButton.classList.remove('hidden');
    } else {
        storedOptimalConfig = null;
        elements.optimalLayoutButton && elements.optimalLayoutButton.classList.add('hidden');
    }

    drawLayoutWrapper(layout, elements.showScores.checked ? scorePositions : [], elements);
    displayProgramSequence(layout, elements);
    const currentConfig = {
        sheetSize: `${Math.min(layout.sheetWidth, layout.sheetLength)}x${Math.max(layout.sheetWidth, layout.sheetLength)}`,
        sheetRotated: layout.sheetWidth > layout.sheetLength
    };
    updateLayoutInfo(layout, elements, currentConfig);
    if (scorePositions.length > 0) {
        clearScores();
    }
    return { layout, config: currentConfig };
}

export function calculateLayoutDetails(elements) {
    const sheetWidth = parseFloat(elements.sheetWidth.value);
    const sheetLength = parseFloat(elements.sheetLength.value);
    const docWidth = parseFloat(elements.docWidth.value);
    const docLength = parseFloat(elements.docLength.value);
    const gutterWidth = parseFloat(elements.gutterWidth.value);
    const gutterLength = parseFloat(elements.gutterLength.value);
    const marginWidth = parseFloat(elements.marginWidth.value);
    const marginLength = parseFloat(elements.marginLength.value);

    return calcDetails({
        sheetWidth,
        sheetLength,
        docWidth,
        docLength,
        gutterWidth,
        gutterLength,
        marginWidth,
        marginLength
    });
}

export function drawLayoutWrapper(layout, scorePositions = [], elements) {
    const marginData = {
        marginWidth: layout.marginWidth,
        marginLength: layout.marginLength
    };
    const options = {
        showDocNumbers: elements.showDocNumbers.checked,
        showPrintableArea: elements.showPrintableArea.checked,
        showMargins: elements.showMargins.checked
    };
    drawLayout(elements.canvas, layout, scorePositions, marginData, zoomFactor, options);
}

export function displayProgramSequence(layout, elements) {
    const sequence = calcSequence(layout);
    const unit = elements.metricToggle && elements.metricToggle.checked ? 'mm' : 'inches';
    renderProgramSequence(sequence, null, unit);
}

export function updateLayoutInfo(layout, elements, config = null) {
    const nUp = layout.docsAcross * layout.docsDown;
    const docWidth = parseFloat(layout.docWidth.toFixed(2));
    const docLength = parseFloat(layout.docLength.toFixed(2));
    const sheetWidth = parseFloat(layout.sheetWidth.toFixed(2));
    const sheetLength = parseFloat(layout.sheetLength.toFixed(2));
    let sheetInfo = `${sheetWidth} x ${sheetLength}`;
    if (config) {
        sheetInfo = `${config.sheetSize}${config.sheetRotated ? ' (rotated)' : ''}`;
    }

    // Calculate stats
    const areaUsed = (layout.docWidth * layout.docLength * nUp) / (layout.sheetWidth * layout.sheetLength);
    const waste = (100 - areaUsed * 100).toFixed(2);
    const usableArea = (areaUsed * 100).toFixed(2);

    // Update canvas header stats
    const canvasNUp = byId('canvasNUp', { optional: true });
    const canvasWaste = byId('canvasWaste', { optional: true });
    const canvasDocSize = byId('canvasDocSize', { optional: true });
    const canvasSheetSize = byId('canvasSheetSize', { optional: true });

    if (canvasNUp) canvasNUp.textContent = `${nUp}-up`;
    if (canvasWaste) canvasWaste.textContent = `${waste}%`;
    if (canvasDocSize) canvasDocSize.textContent = `${docWidth}×${docLength}"`;
    if (canvasSheetSize) canvasSheetSize.textContent = sheetInfo;

    // Calculate program sequence for cut counts
    const sequence = calcSequence(layout);
    const uniqueX = [...new Set(sequence.filter((_, i) => i % 2 === 0))];
    const uniqueY = [...new Set(sequence.filter((_, i) => i % 2 === 1))];

    // Generate warnings
    const warnings = [];
    if (waste > 50) warnings.push('High waste percentage (>50%). Consider adjusting dimensions.');
    if (nUp === 0) warnings.push('No documents fit on sheet with current dimensions.');
    if (layout.marginWidth < 0.125 || layout.marginLength < 0.125) {
        warnings.push('Margins are very tight (<0.125"). May cause printing issues.');
    }

    // Update summary tab
    updateSummaryTab({
        nUp: `${nUp}`,
        waste: `${waste}%`,
        usableArea: `${usableArea}%`,
        totalCuts: sequence.length,
        xCuts: uniqueX.length,
        yCuts: uniqueY.length,
        warnings
    });
}

export function selectDefaultSizes(elements) {
    ['sheet', 'doc', 'gutter', 'margin'].forEach(type => {
        const container = elements[`${type}Buttons`];
        if (!container) return;
        const button = Array.from(container.children).find(btn => btn.dataset.default === 'true');
        if (button) {
            button.click();
        }
    });
}

export function zoomIn() {
    zoomFactor *= ZOOM_STEP;
}

export function zoomOut() {
    zoomFactor /= ZOOM_STEP;
}

export function resetZoom() {
    zoomFactor = 1;
}
