import { calculateLayout, calculateLayoutDetails, drawLayoutWrapper, zoomIn, zoomOut, resetZoom } from '../layout/layoutController.js';
import { calculateScores, getLastScorePositions, clearScoreData } from '../scoring/scoreController.js';

export function registerEventListeners(elements) {
    elements.sheetButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.docButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.gutterButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));
    elements.marginButtons.addEventListener('click', event => handleSizeButtonClick(event, elements));

    const customMarginButton = document.getElementById('customMarginSizeButton');
    ['marginWidth', 'marginLength'].forEach(id => {
        elements[id].addEventListener('input', () => {
            elements.marginButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            customMarginButton.classList.add('active');
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
    elements.rotateDocsButton.addEventListener('click', () => rotateSize('doc', elements));
    elements.rotateSheetButton.addEventListener('click', () => rotateSize('sheet', elements));

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

    elements.themeToggle.addEventListener('click', () => toggleTheme(elements));

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

function toggleTheme(elements) {
    const root = document.documentElement;
    if (root.getAttribute('data-theme') === 'dark') {
        root.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', 'dark');
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
