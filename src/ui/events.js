import { calculateLayout, calculateLayoutDetails, drawLayoutWrapper, zoomIn, zoomOut, resetZoom, retrieveOptimalConfig } from '../layout/layoutController.js';
import { calculateAndRenderScores, getCachedScorePositions, resetScorePositions } from '../scoring/scoreController.js';
import { toggleMetricMode } from './metricToggle.js';
import { byId, qsa, classes, visibility } from '../dom/dom.js';

export function registerEventListeners(elements) {
    // Note: Size preset handling is now done by segmented controls in setupPanel.js
    // No need for button grid event listeners

    elements.fitSheetButton.addEventListener('click', () => {
        resetZoom();
        calculateLayout(elements, getCachedScorePositions(), () => resetScorePositions(elements));
    });
    elements.zoomOutButton.addEventListener('click', () => {
        zoomOut();
        calculateLayout(elements, getCachedScorePositions(), () => resetScorePositions(elements));
    });
    elements.zoomInButton.addEventListener('click', () => {
        zoomIn();
        calculateLayout(elements, getCachedScorePositions(), () => resetScorePositions(elements));
    });
    elements.resetViewButton.addEventListener('click', () => {
        resetZoom();
        calculateLayout(elements, getCachedScorePositions(), () => resetScorePositions(elements));
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
        calculateLayout(elements, getCachedScorePositions(), () => resetScorePositions(elements));
        elements.optimalLayoutButton.classList.add('hidden');
    });

    if (elements.metricToggle) {
        elements.metricToggle.addEventListener('change', () => toggleMetricMode(elements));
    }

    const inputIds = ['sheetWidth', 'sheetLength', 'docWidth', 'docLength', 'gutterWidth', 'gutterLength', 'marginWidth', 'marginLength'];
    inputIds.forEach(id => {
        elements[id].addEventListener('input', () => calculateLayout(elements, getCachedScorePositions(), () => resetScorePositions(elements)));
    });

    elements.calculateScoresButton.addEventListener('click', () => calculateAndRenderScores(elements));
    elements.foldType.addEventListener('change', () => toggleCustomInputs(elements));

    ['showScores', 'showDocNumbers', 'showPrintableArea', 'showMargins'].forEach(id => {
        elements[id].addEventListener('change', () => {
            const layout = calculateLayoutDetails(elements);
            drawLayoutWrapper(layout, elements.showScores.checked ? getCachedScorePositions() : [], elements);
        });
    });

    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('change', () => toggleTheme(elements));
    }

    toggleCustomInputs(elements);
}

// Size button handling is now done via segmented controls in setupPanel.js

function rotateSize(type, elements, shouldCalculate = true) {
    const widthInput = elements[`${type}Width`];
    const lengthInput = elements[`${type}Length`];
    [widthInput.value, lengthInput.value] = [lengthInput.value, widthInput.value];
    if (type === 'sheet') {
        [elements.marginWidth.value, elements.marginLength.value] = [elements.marginLength.value, elements.marginWidth.value];
    }
    if (shouldCalculate) {
        calculateLayout(elements, getCachedScorePositions(), () => resetScorePositions(elements));
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
    drawLayoutWrapper(layout, elements.showScores.checked ? getCachedScorePositions() : [], elements);
}

function toggleCustomInputs(elements) {
    if (elements.foldType.value === 'custom') {
        visibility.show(elements.customScoreInputs);
    } else {
        visibility.hide(elements.customScoreInputs);
    }
}
