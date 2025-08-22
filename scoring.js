// scoring.js
// Functions related to scoring positions and other scoring utilities

export function calculateScorePositions(layout, foldType = 'bifold', customPositions = []) {
    const marginOffset = layout.topMargin;
    const scorePositions = [];
    for (let i = 0; i < layout.docsDown; i++) {
        const base = i * (layout.docLength + layout.gutterLength) + marginOffset;
        if (foldType === 'bifold') {
            scorePositions.push({ y: (layout.docLength / 2) + base });
        } else if (foldType === 'trifold') {
            scorePositions.push({ y: (layout.docLength / 3) + base });
            scorePositions.push({ y: (2 * layout.docLength / 3) - 0.05 + base });
        } else if (foldType === 'gatefold') {
            scorePositions.push({ y: (layout.docLength / 4) + base });
            scorePositions.push({ y: (3 * layout.docLength / 4) - 0.05 + base });
        } else if (foldType === 'custom') {
            customPositions.forEach(pos => {
                scorePositions.push({ y: pos + base });
            });
        }
    }
    return scorePositions;
}

