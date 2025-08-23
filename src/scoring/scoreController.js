import { calculateScorePositions } from './scoring.js';
import { renderScorePositions } from '../ui/display.js';
import { calculateLayoutDetails, drawLayoutWrapper } from '../layout/layoutController.js';

let lastScorePositions = [];

export function calculateScores(elements) {
    const foldType = elements.foldType.value;
    const layout = calculateLayoutDetails(elements);

    let custom = [];
    if (foldType === 'custom') {
        custom = elements.customScores.value
            .split(',')
            .map(n => parseFloat(n.trim()))
            .filter(n => !isNaN(n));
    }

    const scorePositions = calculateScorePositions(layout, foldType, custom);
    lastScorePositions = scorePositions;

    drawLayoutWrapper(layout, elements.showScores.checked ? scorePositions : [], elements);
    displayScorePositions(scorePositions, elements);
}

export function displayScorePositions(scorePositions, elements) {
    renderScorePositions(scorePositions, elements.scorePositions);
}

export function getLastScorePositions() {
    return lastScorePositions;
}

export function clearScoreData(elements) {
    lastScorePositions = [];
    displayScorePositions([], elements);
}
