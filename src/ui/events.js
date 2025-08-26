import { calculateLayout, calculateLayoutDetails, drawLayoutWrapper, zoomIn, zoomOut, resetZoom, applyOptimalLayout } from '../layout/layoutController.js';
import { calculateScores, getLastScorePositions, clearScoreData } from '../scoring/scoreController.js';
import { toggleMetricMode } from './metricToggle.js';

export function registerEventListeners(elements) {
    elements.sheetButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.docButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.gutterButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.marginButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));

    ['marginWidth', 'marginLength'].forEach(id => {
        elements[id].addEventListener('input', () => {
            const customMarginButton = document.getElementById('customMarginSizeButton');
            elements.marginButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            if (customMarginButton) {
                customMarginButton.classList.add('active');
            }
            elements.marginInputs.classList.remove('hidden');
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
    elements.optimalLayoutButton.addEventListener('click', () => {
        applyOptimalLayout(elements);
    });
    elements.rotateDocsButton.addEventListener('click', () => rotateSize('doc', elements));
    elements.rotateSheetButton.addEventListener('click', () => rotateSize('sheet', elements));

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

    button.parentNode.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    inputs.classList.toggle('hidden', !isCustom);

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
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeToggle.checked = true;
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
        elements.customScoreInputs.classList.remove('hidden');
    } else {
        elements.customScoreInputs.classList.add('hidden');
    }
}
