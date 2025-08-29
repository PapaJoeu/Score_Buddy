import { drawLayout } from '../../visualizer.js';
import { calculateLayoutDetails as calcDetails, calculateProgramSequence as calcSequence } from './calculations.js';
import { renderProgramSequence } from '../ui/display.js';

let zoomFactor = 1;
const ZOOM_STEP = 1.1;

let storedOptimalConfig = null;
export function getStoredOptimalConfig() {
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
    renderProgramSequence(sequence, elements.programSequence, unit);
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
    elements.layoutTitle.innerHTML = `<li class="legend-item">${docWidth} x ${docLength} ${nUp}-up on ${sheetInfo}</li>`;
    const areaUsed = (layout.docWidth * layout.docLength * nUp) / (layout.sheetWidth * layout.sheetLength);
    const waste = (100 - areaUsed * 100).toFixed(2);
    elements.wasteLegend.textContent = `Waste: ${waste}%`;
}

export function setDefaultValues(elements, isMetric = false) {
    if (isMetric) {
        elements.sheetWidth.value = "305";
        elements.sheetLength.value = "457";
        elements.docWidth.value = "89";
        elements.docLength.value = "102";
        elements.gutterWidth.value = "3";
        elements.gutterLength.value = "3";
        elements.marginWidth.value = "6";
        elements.marginLength.value = "6";
    } else {
        elements.sheetWidth.value = "12.0";
        elements.sheetLength.value = "18.0";
        elements.docWidth.value = "3.5";
        elements.docLength.value = "4.0";
        elements.gutterWidth.value = "0.125";
        elements.gutterLength.value = "0.125";
        elements.marginWidth.value = "0.25";
        elements.marginLength.value = "0.25";
    }
}

export function selectDefaultSizes(elements, isMetric = false) {
    const defaultSelections = isMetric
        ? {
              sheet: { width: 305, length: 457 },
              doc: { width: 89, length: 102 },
              gutter: { width: 3, length: 3 },
              margin: { width: 6, length: 6 }
          }
        : {
              sheet: { width: 12, length: 18 },
              doc: { width: 3.5, length: 4 },
              gutter: { width: 0.125, length: 0.125 },
              margin: { width: 0.25, length: 0.25 }
          };

    Object.entries(defaultSelections).forEach(([type, { width, length }]) => {
        const container = elements[`${type}Buttons`];
        const button = Array.from(container.children).find(btn =>
            parseFloat(btn.dataset.width) === width && parseFloat(btn.dataset.length) === length
        );
        if (button) {
            button.click();
        } else {
            elements[`${type}Width`].value = width;
            elements[`${type}Length`].value = length;
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
