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

// Appends the internal cut positions and optional back cuts for a given dimension.
function appendCuts(sequence, count, size, gutter, imposedSize) {
    // This loop detects if cuts are necessary to separate the documents.
    // If `count` is 1, no internal cuts are needed; this loop will not execute.
    for (let i = 1; i < count; i++) {
        sequence.push(imposedSize - i * (size + gutter));
    }

    // This statement checks to see if there are gutters and adds back cuts.
    if (gutter > 0) {
        for (let i = 1; i < count; i++) {
            sequence.push(size);
        }
    }
}

export function calculateProgramSequence(layout) {

    let sequence = [];

    // The first four cuts are the outer edges
    sequence.push(layout.sheetLength - layout.topMargin);
    sequence.push(layout.sheetWidth - layout.leftMargin);
    sequence.push(layout.imposedSpaceLength);
    sequence.push(layout.imposedSpaceWidth);

    // The following cuts are the internal cuts

    // Handle cuts along the width (horizontal cuts and back cuts).
    // If `docsAcross` is 1, `appendCuts` will not push any values.
    appendCuts(
        sequence,
        layout.docsAcross,
        layout.docWidth,
        layout.gutterWidth,
        layout.imposedSpaceWidth
    );

    // Handle cuts along the length (vertical cuts and back cuts).
    // If `docsDown` is 1, `appendCuts` will not push any values.
    appendCuts(
        sequence,
        layout.docsDown,
        layout.docLength,
        layout.gutterLength,
        layout.imposedSpaceLength
    );

    return sequence;
}

export const calculateSequence = calculateProgramSequence;

