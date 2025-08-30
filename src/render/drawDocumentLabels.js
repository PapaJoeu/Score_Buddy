// Render numeric labels at the center of each document in the layout grid
export function drawDocumentLabels(
    ctx,
    pageLayout,
    scale,
    xOffset,
    yOffset,
    options = {}
) {
    const { showDocNumbers = true, colors } = options;

    // Exit early when labels are disabled
    if (!showDocNumbers) {
        return;
    }

    // Configure text style for the labels
    ctx.font = `${Math.round(1.5 * scale)}px Arial`;
    ctx.fillStyle = colors?.label ?? '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Iterate over each document slot in the layout grid
    for (let columnIndex = 0; columnIndex < pageLayout.docsAcross; columnIndex++) {
        for (let rowIndex = 0; rowIndex < pageLayout.docsDown; rowIndex++) {
            // Compute the center point of the current document
            const x =
                xOffset +
                (pageLayout.leftMargin + (columnIndex + 0.5) * (pageLayout.docWidth + pageLayout.gutterWidth)) * scale;
            const y =
                yOffset +
                (pageLayout.topMargin + (rowIndex + 0.5) * (pageLayout.docLength + pageLayout.gutterLength)) * scale;

            // Determine the document number based on its row and column
            const documentNumber = rowIndex * pageLayout.docsAcross + columnIndex + 1;

            // Draw the document number in the center of the document
            ctx.fillText(documentNumber.toString(), x, y);
        }
    }
}
