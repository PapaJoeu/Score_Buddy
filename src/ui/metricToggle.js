import { createSizeButtons } from './buttonCreation.js';
import { INCH_SIZE_OPTIONS, MM_SIZE_OPTIONS } from '../config/sizeOptions.js';
import { setDefaultValues, selectDefaultSizes, calculateLayout } from '../layout/layoutController.js';
import { qs } from '../dom/dom.js';

function updateSteps(elements, isMetric) {
    const largeStep = isMetric ? 1 : 0.25;
    const smallStep = isMetric ? 1 : 0.125;
    ['sheetWidth','sheetLength','docWidth','docLength'].forEach(id => {
        elements[id].step = largeStep;
    });
    ['gutterWidth','gutterLength','marginWidth','marginLength'].forEach(id => {
        elements[id].step = smallStep;
    });
}

function updateUnitLabels(isMetric) {
    const unit = isMetric ? 'mm' : 'in';
    const ids = ['sheetWidth','sheetLength','docWidth','docLength','gutterWidth','gutterLength','marginWidth','marginLength','customScores'];
    ids.forEach(id => {
        const label = qs(`label[for="${id}"]`, document, { optional: true });
        if (!label) return;
        label.textContent = label.textContent
            .replace('(in', `(${unit}`)
            .replace('(mm', `(${unit}`);
    });
}

export function toggleMetricMode(elements) {
    const isMetric = elements.metricToggle.checked;
    const options = isMetric ? MM_SIZE_OPTIONS : INCH_SIZE_OPTIONS;

    elements.sheetButtons.innerHTML = '';
    elements.docButtons.innerHTML = '';
    elements.gutterButtons.innerHTML = '';
    elements.marginButtons.innerHTML = '';

    createSizeButtons({
        sheetButtons: elements.sheetButtons,
        docButtons: elements.docButtons,
        gutterButtons: elements.gutterButtons,
        marginButtons: elements.marginButtons
    }, options);

    setDefaultValues(elements, isMetric);
    selectDefaultSizes(elements, isMetric);
    updateUnitLabels(isMetric);
    updateSteps(elements, isMetric);
    calculateLayout(elements);
}
