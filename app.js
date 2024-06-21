document.getElementById('calculateButton').addEventListener('click', calculateLayout);
document.getElementById('scoreButton').addEventListener('click', showScoreOptions);
document.getElementById('calculateScoresButton').addEventListener('click', calculateScores);

function calculateLayout() {
    const sheetWidth = parseFloat(document.getElementById('sheetWidth').value);
    const sheetLength = parseFloat(document.getElementById('sheetLength').value);
    const docWidth = parseFloat(document.getElementById('docWidth').value);
    const docLength = parseFloat(document.getElementById('docLength').value);
    const gutterWidth = parseFloat(document.getElementById('gutterWidth').value);
    const gutterLength = parseFloat(document.getElementById('gutterLength').value);

    const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
    const docsDown = Math.floor(sheetLength / (docLength + gutterLength));
    const totalGutterWidth = (docsAcross - 1) * gutterWidth;
    const totalGutterLength = (docsDown - 1) * gutterLength;
    const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
    const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;

    if (imposedSpaceWidth > sheetWidth || imposedSpaceLength > sheetLength) {
        alert("The current layout is not possible with the given sheet dimensions.");
        return;
    }

    const topMargin = (sheetLength - imposedSpaceLength) / 2;
    const bottomMargin = topMargin;
    const leftMargin = (sheetWidth - imposedSpaceWidth) / 2;
    const rightMargin = leftMargin;

    const sheetSize = `${sheetWidth.toFixed(2)}x${sheetLength.toFixed(2)}`;
    const layoutDetails = `
        <h2>Layout Details</h2>
        <table class="details-table">
            <tr><th>Sheet Size</th><td>${sheetSize}</td></tr>
            <tr><th>Document Size</th><td>${docWidth.toFixed(3)} inches x ${docLength.toFixed(3)} inches</td></tr>
            <tr><th>Documents Across</th><td>${docsAcross}</td></tr>
            <tr><th>Documents Down</th><td>${docsDown}</td></tr>
            <tr><th>Top Margin</th><td>${topMargin.toFixed(3)} inches</td></tr>
            <tr><th>Bottom Margin</th><td>${bottomMargin.toFixed(3)} inches</td></tr>
            <tr><th>Left Margin</th><td>${leftMargin.toFixed(3)} inches</td></tr>
            <tr><th>Right Margin</th><td>${rightMargin.toFixed(3)} inches</td></tr>
        </table>
    `;

    document.getElementById('layoutDetails').innerHTML = layoutDetails;

    const layout = {
        sheetLength,
        sheetWidth,
        bottomMargin,
        rightMargin,
        imposedSpaceLength,
        imposedSpaceWidth,
        docWidth,
        docLength,
        gutterWidth,
        gutterLength,
        docsAcross,
        docsDown
    };

    const programSequence = calculateProgramSequence(layout);
    document.getElementById('programSequence').innerHTML = programSequence;

    drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin);
}

function calculateSequence(layout) {
    let sequence = [
        layout.sheetLength - layout.bottomMargin,
        layout.sheetWidth - layout.rightMargin,
        layout.imposedSpaceLength,
        layout.imposedSpaceWidth,
    ];

    for (let i = 1; i < layout.docsAcross; i++) {
        sequence.push(layout.imposedSpaceWidth - i * (layout.docWidth + layout.gutterWidth));
    }

    sequence = sequence.concat(Array(layout.docsAcross - 1).fill(layout.docWidth));

    for (let i = 1; i < layout.docsDown; i++) {
        sequence.push(layout.imposedSpaceLength - i * (layout.docLength + layout.gutterLength));
    }

    sequence = sequence.concat(Array(layout.docsDown - 1).fill(layout.docLength));

    return sequence;
}

function calculateProgramSequence(layout) {
    let sequence = calculateSequence(layout);
    
    let sequenceHTML = `
        <h2>Program Sequence</h2>
        <table class="sequence-table">
            <tr>
                <th>Step</th>
                <th>Cut Measurement</th>
            </tr>
    `;

    for (let i = 0; i < sequence.length; i++) {
        sequenceHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${sequence[i].toFixed(3)} inches</td>
            </tr>
        `;
    }

    sequenceHTML += '</table>';
    return sequenceHTML;
}

function showScoreOptions() {
    document.getElementById('scoredOptions').classList.remove('hidden');
}

function calculateScores() {
    const scoredWithMargins = document.getElementById('scoredWithMargins').value === 'yes';
    const foldType = document.getElementById('foldType').value;

    const sheetWidth = parseFloat(document.getElementById('sheetWidth').value);
    const sheetLength = parseFloat(document.getElementById('sheetLength').value);
    const docWidth = parseFloat(document.getElementById('docWidth').value);
    const docLength = parseFloat(document.getElementById('docLength').value);
    const gutterWidth = parseFloat(document.getElementById('gutterWidth').value);
    const gutterLength = parseFloat(document.getElementById('gutterLength').value);

    const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
    const docsDown = Math.floor(sheetLength / (docLength + gutterLength));
    const totalGutterWidth = (docsAcross - 1) * gutterWidth;
    const totalGutterLength = (docsDown - 1) * gutterLength;
    const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
    const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;

    const topMargin = (sheetLength - imposedSpaceLength) / 2;

    let marginOffset = scoredWithMargins ? topMargin : 0;

    let scores = `
        <h2>Score Positions</h2>
        <table class="score-table">
            <thead>
                <tr>
                    <th>Score Position (inches)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // If the fold type is bifold
    if (foldType === 'bifold') {
        // Calculate score positions for bifold
        for (let i = 0; i < docsDown; i++) {
            // Each score position is located at the center of each document, plus the margin offset
            scores += `<tr><td>${((docLength / 2) + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
        }
    } 
    // If the fold type is trifold
    else if (foldType === 'trifold') {
        // Calculate score positions for trifold
        for (let i = 0; i < docsDown; i++) {
            // The first score position is located at one-third of the document length, plus the margin offset
            scores += `<tr><td>${((docLength / 3) + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
            // The second score position is located at two-thirds of the document length, minus a small adjustment, plus the margin offset
            scores += `<tr><td>${((2 * docLength / 3) - 0.05 + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
        }
    }

    scores += '</tbody></table>';
    document.getElementById('scorePositions').innerHTML = scores;
}

// TODO: #3 add comments to this function that explain what it does
// TODO: #3 Figure out how to scale the layout of the sheet to always be the width of the screen 

function drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin) {
    const canvas = document.getElementById('layoutCanvas');
    const ctx = canvas.getContext('2d');

    const scaleFactor = Math.min(canvas.width / sheetWidth, canvas.height / sheetLength);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sheetX = (canvas.width - sheetWidth * scaleFactor) / 2;
    const sheetY = (canvas.height - sheetLength * scaleFactor) / 2;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = .5;
    ctx.strokeRect(sheetX, sheetY, sheetWidth * scaleFactor, sheetLength * scaleFactor);

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText('Sheet', sheetX + 5, sheetY + 15);

    ctx.strokeStyle = '#007BFF';
    ctx.lineWidth = .5;
    for (let i = 0; i < docsAcross; i++) {
        for (let j = 0; j < docsDown; j++) {
            const x = sheetX + (leftMargin + i * (docWidth + gutterWidth)) * scaleFactor;
            const y = sheetY + (topMargin + j * (docLength + gutterLength)) * scaleFactor;
            ctx.strokeRect(x, y, docWidth * scaleFactor, docLength * scaleFactor);
            ctx.fillText(`Doc ${i + 1}-${j + 1}`, x + 5, y + 15);
        }
    }
}

