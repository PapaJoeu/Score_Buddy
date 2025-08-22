// scoring.js
// Functions related to scoring positions and other scoring utilities

// Default allowance (in inches) to compensate for paper thickness when folding.
// Thicker paper stocks may require a larger allowance to prevent overlapping folds.
export const FOLD_ALLOWANCE = 0.05;

/**
 * Calculate score line positions for a given layout and fold type.
 * @param {Object} layout - Layout details produced by calculateLayoutDetails.
 * @param {string} foldType - The type of fold (bifold, trifold, gatefold, custom).
 * @param {number[]} customPositions - Custom score offsets for 'custom' fold type.
 * @param {number} allowance - Offset to accommodate paper thickness. Increase for heavier stock,
 *                             or decrease for thin paper.
 */
export function calculateScorePositions(
    layout,
    foldType = 'bifold',
    customPositions = [],
    allowance = FOLD_ALLOWANCE
) {
    const marginOffset = layout.topMargin;
    const scorePositions = [];
    for (let i = 0; i < layout.docsDown; i++) {
        const base = i * (layout.docLength + layout.gutterLength) + marginOffset;
        if (foldType === 'bifold') {
            scorePositions.push({ y: (layout.docLength / 2) + base });
        } else if (foldType === 'trifold') {
            scorePositions.push({ y: (layout.docLength / 3) + base });
            scorePositions.push({ y: (2 * layout.docLength / 3) - allowance + base });
        } else if (foldType === 'gatefold') {
            scorePositions.push({ y: (layout.docLength / 4) + base });
            scorePositions.push({ y: (3 * layout.docLength / 4) - allowance + base });
        } else if (foldType === 'custom') {
            customPositions.forEach(pos => {
                scorePositions.push({ y: pos + base });
            });
        }
    }
    return scorePositions;
}

