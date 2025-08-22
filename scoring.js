// scoring.js
// Functions related to scoring positions and other scoring utilities

export function calculateScorePositions(layout, { foldType = 'bifold' } = {}) {
    const marginOffset = layout.topMargin;
    let scorePositions = [];
    for (let i = 0; i < layout.docsDown; i++) {
        if (foldType === 'bifold') {
            scorePositions.push({
                y: (layout.docLength / 2) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins: true
            });
        } else if (foldType === 'trifold') {
            scorePositions.push({
                y: (layout.docLength / 3) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins: true
            });
            scorePositions.push({
                y: (2 * layout.docLength / 3) - 0.05 + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins: true
            });
        } else if (foldType === 'gatefold') {
            scorePositions.push({
                y: (layout.docLength / 4) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins: true
            });
            scorePositions.push({
                y: (3 * layout.docLength / 4) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins: true
            });
        } else if (foldType === 'custom') {
            // Custom scoring to be implemented by user
        }
    }
    return scorePositions;
}

