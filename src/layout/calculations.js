export function calculateLayoutDetails({ sheetWidth, sheetLength, docWidth, docLength, gutterWidth, gutterLength, marginWidth = 0, marginLength = 0 }) {
    const usableSheetWidth = sheetWidth - 2 * marginWidth;
    const usableSheetLength = sheetLength - 2 * marginLength;
    const docsAcross = Math.floor(usableSheetWidth / (docWidth + gutterWidth));
    const docsDown = Math.floor(usableSheetLength / (docLength + gutterLength));
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
        usableSheetWidth,
        usableSheetLength,
        docWidth,
        docLength,
        gutterWidth,
        gutterLength,
        marginWidth,
        marginLength,
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

export function calculateProgramSequence(layout) {

    let sequence = [];

    // The first four cuts are the outer edges
    sequence.push(layout.sheetLength - layout.topMargin);
    sequence.push(layout.sheetWidth - layout.leftMargin);
    sequence.push(layout.imposedSpaceLength);
    sequence.push(layout.imposedSpaceWidth);

    // The following cuts are the internal cuts

    // This loop detects if cuts along the width are necessary to separate the documents. 
    // If docsAcross is 1, no internal horizontal cuts are needed; this loop will not execute.
    for (let i = 1; i < layout.docsAcross; i++) {
        sequence.push(layout.imposedSpaceWidth - i * (layout.docWidth + layout.gutterWidth));
    }

    // this statement checks to see if there are gutters and adds back cuts
    if (layout.gutterWidth > 0) {
        for (let i = 1; i < layout.docsAcross; i++) {
            sequence.push(layout.docWidth);
        }
    }

    // This loop detects if cuts along the length are necessary to separate the documents.
    // If docsDown is 1, no internal vertical cuts are needed; this loop will not execute.
    for (let i = 1; i < layout.docsDown; i++) {
        sequence.push(layout.imposedSpaceLength - i * (layout.docLength + layout.gutterLength));
    }

    // this statement checks to see if there are gutters and adds back cuts
    if (layout.gutterLength > 0) {
        for (let i = 1; i < layout.docsDown; i++) {
            sequence.push(layout.docLength);
        }
    }

    return sequence;
}

