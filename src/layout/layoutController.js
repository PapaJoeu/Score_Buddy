import { drawLayout } from '../../visualizer.js';
import { calculateLayoutDetails as calcDetails, calculateSequence as calcSequence } from './calculations.js';
import { renderProgramSequence } from '../ui/display.js';

let zoomFactor = 1;
const ZOOM_STEP = 1.1;

export function calculateLayout(elements, scorePositions = [], clearScores = () => {}) {
    const layout = calculateLayoutDetails(elements);
    drawLayoutWrapper(layout, elements.showScores.checked ? scorePositions : [], elements);
    displayProgramSequence(layout, elements);
    updateLayoutInfo(layout, elements);
    if (scorePositions.length > 0) {
        clearScores();
    }
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

export function updateLayoutInfo(layout, elements) {
    const nUp = layout.docsAcross * layout.docsDown;
    const docWidth = parseFloat(layout.docWidth.toFixed(2));
    const docLength = parseFloat(layout.docLength.toFixed(2));
    const sheetWidth = parseFloat(layout.sheetWidth.toFixed(2));
    const sheetLength = parseFloat(layout.sheetLength.toFixed(2));
    elements.layoutTitle.innerHTML = `<li class="legend-item">${docWidth} x ${docLength} ${nUp}-up on ${sheetWidth} x ${sheetLength}</li>`;
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
