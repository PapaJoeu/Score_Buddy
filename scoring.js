// scoring.js
// Functions related to scoring positions and other scoring utilities

export function calculateScorePositions(layout, { foldType = 'bifold', scoredWithMargins = false } = {}) {
    // layout.topMargin already includes any sheet margin
    const marginOffset = scoredWithMargins ? layout.topMargin : 0;
    let scorePositions = [];
    for (let i = 0; i < layout.docsDown; i++) {
        if (foldType === 'bifold') {
            scorePositions.push({
                y: (layout.docLength / 2) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins
            });
        } else if (foldType === 'trifold') {
            scorePositions.push({
                y: (layout.docLength / 3) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins
            });
            scorePositions.push({
                y: (2 * layout.docLength / 3) - 0.05 + i * (layout.docLength + layout.gutterLength) + marginOffset,
                scoredWithMargins
            });
        }
    }
    return scorePositions;
}

