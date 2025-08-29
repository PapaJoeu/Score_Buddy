import { calculateLayout, calculateLayoutDetails, drawLayoutWrapper, zoomIn, zoomOut, resetZoom, retrieveOptimalConfig } from '../layout/layoutController.js';
import { calculateScores, getLastScorePositions, clearScoreData } from '../scoring/scoreController.js';
import { toggleMetricMode } from './metricToggle.js';
import { byId, qsa, classes, visibility } from '../dom/dom.js';

export function registerEventListeners(elements) {
    elements.sheetButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.docButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.gutterButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.marginButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));

    ['marginWidth', 'marginLength'].forEach(id => {
        elements[id].addEventListener('input', () => {
            const customMarginButton = byId('customMarginSizeButton', { optional: true });
            qsa('button', elements.marginButtons).forEach(btn => classes.remove(btn, 'active'));
            if (customMarginButton) {
                classes.add(customMarginButton, 'active');
            }
            visibility.show(elements.marginInputs);
            calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
        });
    });

    elements.fitSheetButton.addEventListener('click', () => {
        resetZoom();
        calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
    });
    elements.zoomOutButton.addEventListener('click', () => {
        zoomOut();
        calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
    });
    elements.zoomInButton.addEventListener('click', () => {
        zoomIn();
        calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
    });
    elements.resetViewButton.addEventListener('click', () => {
        resetZoom();
        calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
    });
    elements.rotateDocsButton.addEventListener('click', () => rotateSize('doc', elements));
    elements.rotateSheetButton.addEventListener('click', () => rotateSize('sheet', elements));
    elements.optimalLayoutButton.addEventListener('click', () => {
        const config = retrieveOptimalConfig();
        if (!config) {
            return;
        }
        const currentSheetRotated = parseFloat(elements.sheetWidth.value) > parseFloat(elements.sheetLength.value);
        if (config.sheetRotated !== currentSheetRotated) {
            rotateSize('sheet', elements, false);
        }
        const currentDocRotated = parseFloat(elements.docWidth.value) > parseFloat(elements.docLength.value);
        if (config.docRotated !== currentDocRotated) {
            rotateSize('doc', elements, false);
        }
        elements.sheetWidth.value = config.sheetWidth;
        elements.sheetLength.value = config.sheetLength;
        calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
        elements.optimalLayoutButton.classList.add('hidden');
    });

    elements.metricToggle.addEventListener('change', () => toggleMetricMode(elements));

    const inputIds = ['sheetWidth', 'sheetLength', 'docWidth', 'docLength', 'gutterWidth', 'gutterLength', 'marginWidth', 'marginLength'];
    inputIds.forEach(id => {
        elements[id].addEventListener('input', () => calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements)));
    });

    elements.calculateScoresButton.addEventListener('click', () => calculateScores(elements));
    elements.foldType.addEventListener('change', () => toggleCustomInputs(elements));

    ['showScores', 'showDocNumbers', 'showPrintableArea', 'showMargins'].forEach(id => {
        elements[id].addEventListener('change', () => {
            const layout = calculateLayoutDetails(elements);
            drawLayoutWrapper(layout, elements.showScores.checked ? getLastScorePositions() : [], elements);
        });
    });

    elements.themeToggle.addEventListener('change', () => toggleTheme(elements));

    toggleCustomInputs(elements);
}

function handleSizeButtonClick(event, elements) {
    const button = event.target.closest('button');
    if (!button) {
        return;
    }
    const type = button.dataset.type;
    const inputs = elements[`${type}Inputs`];
    const isCustom = button.id.includes('custom');

    qsa('button', button.parentNode).forEach(btn => classes.remove(btn, 'active'));
    classes.add(button, 'active');
    visibility.toggle(inputs, isCustom);

    if (!isCustom) {
        if (type === 'gutter') {
            elements.gutterWidth.value = button.dataset.width;
            elements.gutterLength.value = button.dataset.length;
        } else {
            elements[`${type}Width`].value = button.dataset.width;
            elements[`${type}Length`].value = button.dataset.length;
        }
    }

    calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
}

function rotateSize(type, elements, shouldCalculate = true) {
    const widthInput = elements[`${type}Width`];
    const lengthInput = elements[`${type}Length`];
    [widthInput.value, lengthInput.value] = [lengthInput.value, widthInput.value];
    if (type === 'sheet') {
        [elements.marginWidth.value, elements.marginLength.value] = [elements.marginLength.value, elements.marginWidth.value];
    }
    if (shouldCalculate) {
        calculateLayout(elements, getLastScorePositions(), () => clearScoreData(elements));
    }
}

export function initTheme(elements) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeToggle.checked = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        elements.themeToggle.checked = false;
    }
}

function toggleTheme(elements) {
    const root = document.documentElement;
    if (elements.themeToggle.checked) {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
    const layout = calculateLayoutDetails(elements);
    drawLayoutWrapper(layout, elements.showScores.checked ? getLastScorePositions() : [], elements);
}

function toggleCustomInputs(elements) {
    if (elements.foldType.value === 'custom') {
        visibility.show(elements.customScoreInputs);
    } else {
        visibility.hide(elements.customScoreInputs);
    }
}
