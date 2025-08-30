// scoring.js
// Functions related to scoring positions and other scoring utilities

// Default allowance to compensate for paper thickness when folding.
// Values are provided for both inches and millimeters.
export const FOLD_ALLOWANCE_INCH = 0.05;
export const FOLD_ALLOWANCE_MM = 1.27;

// Supported fold types for calculating score positions
const VALID_FOLD_TYPES = ['bifold', 'trifold', 'gatefold', 'custom'];

// Mapping of fold types to their score line calculation strategies
const FOLD_STRATEGIES = {
    bifold: (docLength, allowance) => [{ y: docLength / 2 }],
    trifold: (docLength, allowance) => [
        { y: docLength / 3 },
        { y: (2 * docLength / 3) - allowance }
    ],
    gatefold: (docLength, allowance) => [
        { y: docLength / 4 },
        { y: (3 * docLength / 4) - allowance }
    ],
    custom: (docLength, allowance, customOffsets) =>
        customOffsets.map(offset => ({ y: offset }))
};

/**
 * Calculate score line positions for a given layout and fold type.
 * @param {Object} layoutDetails - Layout details produced by calculateLayoutDetails.
 * @param {string} foldType - The type of fold (bifold, trifold, gatefold, custom).
 * @param {number[]} customOffsets - Custom score offsets for 'custom' fold type.
 * @param {number} foldAllowance - Offset to accommodate paper thickness. Increase for heavier stock,
 *                                 or decrease for thin paper.
 */
export function computeScorePositions(
    layoutDetails,
    foldType = 'bifold',
    customOffsets = [],
    foldAllowance = FOLD_ALLOWANCE_INCH
) {
    if (!VALID_FOLD_TYPES.includes(foldType)) {
        throw new Error(`Unsupported fold type: ${foldType}`);
    }

    // Filter and sort custom positions when using the 'custom' fold type
    const validCustomOffsets = foldType === 'custom'
        ? customOffsets
              .filter(offset => typeof offset === 'number' && offset >= 0 && offset <= layoutDetails.docLength)
              .sort((a, b) => a - b)
        : [];

    const scoreLines = [];
    const generateLines = FOLD_STRATEGIES[foldType];
    for (let rowIndex = 0; rowIndex < layoutDetails.docsDown; rowIndex++) {
        const baseOffset = rowIndex * (layoutDetails.docLength + layoutDetails.gutterLength) + layoutDetails.topMargin;
        const lines = generateLines(layoutDetails.docLength, foldAllowance, validCustomOffsets);
        lines.forEach(line => {
            scoreLines.push({ y: line.y + baseOffset });
        });
    }
    return scoreLines;
}

