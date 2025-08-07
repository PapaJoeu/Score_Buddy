export function calculateLayoutDetails({ sheetWidth, sheetLength, docWidth, docLength, gutterWidth, gutterLength, sheetMargin = 0.125 }) {
    const usableWidth = Math.max(0, sheetWidth - 2 * sheetMargin);
    const usableLength = Math.max(0, sheetLength - 2 * sheetMargin);

    const docsAcross = Math.floor(usableWidth / (docWidth + gutterWidth));
    const docsDown = Math.floor(usableLength / (docLength + gutterLength));
    const totalGutterWidth = (docsAcross - 1) * gutterWidth;
    const totalGutterLength = (docsDown - 1) * gutterLength;
    const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
    const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;
    const gutterSpaceWidth = totalGutterWidth;
    const gutterSpaceLength = totalGutterLength;

    const topMargin = sheetMargin + (usableLength - imposedSpaceLength) / 2;
    const leftMargin = sheetMargin + (usableWidth - imposedSpaceWidth) / 2;

    return {
        sheetWidth,
        sheetLength,
        docWidth,
        docLength,
        gutterWidth,
        gutterLength,
        sheetMargin,
        usableWidth,
        usableLength,
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

