export function calculateLayoutDetails({ sheetWidth, sheetLength, docWidth, docLength, gutterWidth, gutterLength }) {
    const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
    const docsDown = Math.floor(sheetLength / (docLength + gutterLength));
    const totalGutterWidth = (docsAcross - 1) * gutterWidth;
    const totalGutterLength = (docsDown - 1) * gutterLength;
    const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
    const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;
    const gutterSpaceWidth = totalGutterWidth;
    const gutterSpaceLength = totalGutterLength;
    const topMargin = (sheetLength - imposedSpaceLength) / 2;
    const leftMargin = (sheetWidth - imposedSpaceWidth) / 2;
    return {
        sheetWidth,
        sheetLength,
        docWidth,
        docLength,
        gutterWidth,
        gutterLength,
        docsAcross,
        docsDown,
        imposedSpaceWidth,
        imposedSpaceLength,
        topMargin,
        leftMargin,
        gutterSpaceWidth,
        gutterSpaceLength
    };
}

export function calculateSequence(layout) {
    let sequence = [];
    sequence.push(layout.sheetLength - layout.topMargin);
    sequence.push(layout.sheetWidth - layout.leftMargin);
    sequence.push(layout.imposedSpaceLength);
    sequence.push(layout.imposedSpaceWidth);
    for (let i = 1; i < layout.docsAcross; i++) {
        sequence.push(layout.imposedSpaceWidth - i * (layout.docWidth + layout.gutterWidth));
    }
    for (let i = 1; i < layout.docsAcross; i++) {
        sequence.push(layout.docWidth);
    }
    for (let i = 1; i < layout.docsDown; i++) {
        sequence.push(layout.imposedSpaceLength - i * (layout.docLength + layout.gutterLength));
    }
    for (let i = 1; i < layout.docsDown; i++) {
        sequence.push(layout.docLength);
    }
    return sequence;
}

export function calculateScorePositions(layout, { foldType = 'bifold', scoredWithMargins = false } = {}) {
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
