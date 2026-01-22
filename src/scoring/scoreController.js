import { computeScorePositions, FOLD_ALLOWANCE_INCH, FOLD_ALLOWANCE_MM } from './scoring.js';
import { renderScorePositions } from '../ui/display.js';
import { calculateLayoutDetails, drawLayoutWrapper } from '../layout/layoutController.js';
import { qs } from '../dom/dom.js';

let cachedScorePositions = [];

export function calculateAndRenderScores(elements) {
    const foldType = qs('#foldType', elements.scoreControls).value;
    const layout = calculateLayoutDetails(elements);

    let customOffsets = [];
    if (foldType === 'custom') {
        customOffsets = qs('#customScores', elements.scoreControls)
            .value.split(',')
            .map(n => parseFloat(n.trim()))
            .filter(n => !isNaN(n));
    }

    const foldAllowance = elements.metricToggle.checked ? FOLD_ALLOWANCE_MM : FOLD_ALLOWANCE_INCH;
    const scoreLines = computeScorePositions(layout, foldType, customOffsets, foldAllowance);
    cachedScorePositions = scoreLines;

    drawLayoutWrapper(layout, elements.showScores.checked ? scoreLines : [], elements);
    updateScorePositionDisplay(scoreLines, elements);
}

export function updateScorePositionDisplay(scoreLines, elements) {
    const unit = elements.metricToggle && elements.metricToggle.checked ? 'mm' : 'inches';
    renderScorePositions(scoreLines, null, unit);
}

export function getCachedScorePositions() {
    return cachedScorePositions;
}

export function resetScorePositions(elements) {
    cachedScorePositions = [];
    updateScorePositionDisplay([], elements);
}
