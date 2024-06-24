// Function to draw layout on canvas
function drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin) {
    // Get the canvas element and its context
    const canvas = document.getElementById('layoutCanvas');
    const ctx = canvas.getContext('2d');

    // Calculate the scale factor based on the canvas size and sheet dimensions
    const scaleFactor = Math.min(canvas.width / sheetWidth, canvas.height / sheetLength);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the position of the sheet on the canvas
    const sheetX = (canvas.width - sheetWidth * scaleFactor) / 2;
    const sheetY = (canvas.height - sheetLength * scaleFactor) / 2;

    // Draw the sheet outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(sheetX, sheetY, sheetWidth * scaleFactor, sheetLength * scaleFactor);

    // Display the sheet size
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(`Sheet Size: ${sheetWidth}x${sheetLength}, Gutter Size: ${gutterWidth} x ${gutterLength}`, sheetX + 5, sheetY + 15);

    // Draw the document rectangles
    ctx.strokeStyle = '#007BFF';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < docsAcross; i++) {
        for (let j = 0; j < docsDown; j++) {
            // Calculate the position of each document rectangle
            const x = sheetX + (leftMargin + i * (docWidth + gutterWidth)) * scaleFactor;
            const y = sheetY + (topMargin + j * (docLength + gutterLength)) * scaleFactor;
            
            // Draw the document rectangle
            ctx.strokeRect(x, y, docWidth * scaleFactor, docLength * scaleFactor);
            
            // Display the document label as centered text counting from top left
            ctx.fillText(`${i + 1 + j * docsAcross}`, x + docWidth * scaleFactor / 2 - 5, y + docLength * scaleFactor / 2 + 5);

        }
    }
}