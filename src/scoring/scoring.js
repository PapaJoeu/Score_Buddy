// scoring.js
// Functions related to scoring positions and other scoring utilities

// Default allowance to compensate for paper thickness when folding.
// Values are provided for both inches and millimeters.
export const FOLD_ALLOWANCE_INCH = 0.05;
export const FOLD_ALLOWANCE_MM = 1.27;

// Supported fold types for calculating score positions
const SUPPORTED_FOLD_TYPES = ['bifold', 'trifold', 'gatefold', 'custom'];

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
    allowance = FOLD_ALLOWANCE_INCH
) {
    if (!SUPPORTED_FOLD_TYPES.includes(foldType)) {
        throw new Error(`Unsupported fold type: ${foldType}`);
    }

    // Filter and sort custom positions when using the 'custom' fold type
    const processedCustomPositions = foldType === 'custom'
        ? customPositions
              .filter(pos => typeof pos === 'number' && pos >= 0 && pos <= layout.docLength)
              .sort((a, b) => a - b)
        : [];

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
            processedCustomPositions.forEach(pos => {
                scorePositions.push({ y: pos + base });
            });
        }
    }
    return scorePositions;
}

