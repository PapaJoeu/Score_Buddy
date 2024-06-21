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

    const layoutDetails = `
        <h2>Layout Details</h2>
        <table class="details-table">
            <tr><th>Sheet Size</th><td>${sheetWidth.toFixed(3)} inches x ${sheetLength.toFixed(3)} inches</td></tr>
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

    const programSequence = calculateProgramSequence(docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, imposedSpaceWidth, imposedSpaceLength);
    document.getElementById('programSequence').innerHTML = programSequence;

    drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin);
}

function calculateProgramSequence(docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, imposedSpaceWidth, imposedSpaceLength) {
    let sequence = `
        <h2>Program Sequence</h2>
        <ul>
    `;

    for (let i = 1; i < docsAcross; i++) {
        sequence += `<li>${(imposedSpaceWidth - i * (docWidth + gutterWidth)).toFixed(3)} inches</li>`;
    }
    for (let i = 1; i < docsDown; i++) {
        sequence += `<li>${(imposedSpaceLength - i * (docLength + gutterLength)).toFixed(3)} inches</li>`;
    }

    sequence += '</ul>';
    return sequence;
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
        <ul>
    `;

    if (foldType === 'bifold') {
        for (let i = 0; i < docsDown; i++) {
            scores += `<li>${((docLength / 2) + i * (docLength + gutterLength) + marginOffset).toFixed(3)} inches</li>`;
        }
    } else if (foldType === 'trifold') {
        for (let i = 0; i < docsDown; i++) {
            scores += `<li>${((docLength / 3) + i * (docLength + gutterLength) + marginOffset).toFixed(3)} inches</li>`;
            scores += `<li>${((2 * docLength / 3) - 0.05 + i * (docLength + gutterLength) + marginOffset).toFixed(3)} inches</li>`;
        }
    }

    scores += '</ul>';
    document.getElementById('scorePositions').innerHTML = scores;
}

function drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin) {
    const canvas = document.getElementById('layoutCanvas');
    const ctx = canvas.getContext('2d');

    const scaleFactor = Math.min(canvas.width / sheetWidth, canvas.height / sheetLength);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sheetX = (canvas.width - sheetWidth * scaleFactor) / 2;
    const sheetY = (canvas.height - sheetLength * scaleFactor) / 2;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(sheetX, sheetY, sheetWidth * scaleFactor, sheetLength * scaleFactor);

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText('Sheet', sheetX + 5, sheetY + 15);

    ctx.strokeStyle = '#007BFF';
    ctx.lineWidth = 1;
    for (let i = 0; i < docsAcross; i++) {
        for (let j = 0; j < docsDown; j++) {
            const x = sheetX + (leftMargin + i * (docWidth + gutterWidth)) * scaleFactor;
            const y = sheetY + (topMargin + j * (docLength + gutterLength)) * scaleFactor;
            ctx.strokeRect(x, y, docWidth * scaleFactor, docLength * scaleFactor);
            ctx.fillText(`Doc ${i + 1}-${j + 1}`, x + 5, y + 15);
        }
    }
}

