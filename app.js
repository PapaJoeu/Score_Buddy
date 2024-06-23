document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const sheetButtons = document.querySelectorAll('.sheet-size-button');
    const docButtons = document.querySelectorAll('.doc-size-button');
    const gutterButtons = document.querySelectorAll('.gutter-size-button');
    const customSheetButton = document.getElementById('customSheetSizeButton');
    const customDocButton = document.getElementById('customDocSizeButton');
    const customGutterButton = document.getElementById('customGutterSizeButton');
    
    const sheetWidthInput = document.getElementById('sheetWidth');
    const sheetLengthInput = document.getElementById('sheetLength');
    const docWidthInput = document.getElementById('docWidth');
    const docLengthInput = document.getElementById('docLength');
    const gutterWidthInput = document.getElementById('gutterWidth');
    const gutterLengthInput = document.getElementById('gutterLength');

    // Initialize event listeners
    setupButtonEventListeners();
    setupCustomSizeEventListeners();
    setupRotateButtonEventListeners();

    // Function to set up button event listeners
    function setupButtonEventListeners() {
        document.getElementById('calculateButton').addEventListener('click', calculateLayout);
        document.getElementById('scoreButton').addEventListener('click', showScoreOptions);
        document.getElementById('calculateScoresButton').addEventListener('click', calculateScores);

        sheetButtons.forEach(button => {
            button.addEventListener('click', handleSheetSizeButtonClick);
        });

        docButtons.forEach(button => {
            button.addEventListener('click', handleDocSizeButtonClick);
        });

        gutterButtons.forEach(button => {
            button.addEventListener('click', handleGutterSizeButtonClick);
        });
    }

    // Function to set up custom size input event listeners
    function setupCustomSizeEventListeners() {
        customSheetButton.addEventListener('click', () => {
            sheetWidthInput.value = '';
            sheetLengthInput.value = '';
            toggleActiveClass(sheetButtons, customSheetButton);
        });

        customDocButton.addEventListener('click', () => {
            docWidthInput.value = '';
            docLengthInput.value = '';
            toggleActiveClass(docButtons, customDocButton);
        });

        customGutterButton.addEventListener('click', () => {
            gutterWidthInput.value = '';
            gutterLengthInput.value = '';
            toggleActiveClass(gutterButtons, customGutterButton);
        });
    }

    // Function to set up rotate button event listeners
    function setupRotateButtonEventListeners() {
        document.getElementById('rotateDocsButton').addEventListener('click', () => {
            rotateInputValues(docWidthInput, docLengthInput);
            calculateLayout();
        });

        document.getElementById('rotateSheetButton').addEventListener('click', () => {
            rotateInputValues(sheetWidthInput, sheetLengthInput);
            calculateLayout();
        });
    }

    // Event handler for sheet size buttons
    function handleSheetSizeButtonClick(event) {
        const button = event.currentTarget;
        const width = button.getAttribute('data-width');
        const length = button.getAttribute('data-length');
        
        if (button.id === 'customSheetSizeButton') {
            toggleCustomSizeInput('sheetWidthGroup', 'sheetLengthGroup', true);
        } else {
            setSizeInputValues(sheetWidthInput, sheetLengthInput, width, length);
            toggleCustomSizeInput('sheetWidthGroup', 'sheetLengthGroup', false);
        }
        toggleActiveClass(sheetButtons, button);
    }

    // Event handler for document size buttons
    function handleDocSizeButtonClick(event) {
        const button = event.currentTarget;
        const width = button.getAttribute('data-width');
        const length = button.getAttribute('data-length');
        
        if (button.id === 'customDocSizeButton') {
            toggleCustomSizeInput('docWidthGroup', 'docLengthGroup', true);
        } else {
            setSizeInputValues(docWidthInput, docLengthInput, width, length);
            toggleCustomSizeInput('docWidthGroup', 'docLengthGroup', false);
        }
        toggleActiveClass(docButtons, button);
    }

    // Event handler for gutter size buttons
    function handleGutterSizeButtonClick(event) {
        const button = event.currentTarget;
        const width = button.getAttribute('data-gutter');
        
        if (button.id === 'customGutterSizeButton') {
            toggleCustomSizeInput('gutterWidthGroup', 'gutterLengthGroup', true);
        } else {
            setSizeInputValues(gutterWidthInput, gutterLengthInput, width, width);
            toggleCustomSizeInput('gutterWidthGroup', 'gutterLengthGroup', false);
        }
        toggleActiveClass(gutterButtons, button);
    }

    // Function to toggle custom size input visibility
    function toggleCustomSizeInput(widthGroupId, lengthGroupId, isVisible) {
        const displayStyle = isVisible ? 'block' : 'none';
        document.getElementById(widthGroupId).style.display = displayStyle;
        document.getElementById(lengthGroupId).style.display = displayStyle;
    }

    // Function to set size input values
    function setSizeInputValues(widthInput, lengthInput, width, length) {
        widthInput.value = width;
        lengthInput.value = length;
    }

    // Function to rotate input values
    function rotateInputValues(input1, input2) {
        const temp = input1.value;
        input1.value = input2.value;
        input2.value = temp;
    }

    // Function to calculate layout
    function calculateLayout() {
        const sheetWidth = parseFloat(sheetWidthInput.value);
        const sheetLength = parseFloat(sheetLengthInput.value);
        const docWidth = parseFloat(docWidthInput.value);
        const docLength = parseFloat(docLengthInput.value);
        const gutterWidth = parseFloat(gutterWidthInput.value);
        const gutterLength = parseFloat(gutterLengthInput.value);

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

        const layoutDetailsHTML = generateLayoutDetailsHTML(sheetWidth, sheetLength, docWidth, docLength, docsAcross, docsDown, topMargin, bottomMargin, leftMargin, rightMargin);
        document.getElementById('layoutDetails').innerHTML = layoutDetailsHTML;

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

        const programSequenceHTML = generateProgramSequenceHTML(layout);
        document.getElementById('programSequence').innerHTML = programSequenceHTML;

        drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin);
    }

    // Function to generate layout details HTML
    function generateLayoutDetailsHTML(sheetWidth, sheetLength, docWidth, docLength, docsAcross, docsDown, topMargin, bottomMargin, leftMargin, rightMargin) {
        const sheetWidthDisplay = sheetWidth % 1 === 0 ? sheetWidth.toFixed(0) : sheetWidth.toFixed(2);
        const sheetLengthDisplay = sheetLength % 1 === 0 ? sheetLength.toFixed(0) : sheetLength.toFixed(2);
        const docWidthDisplay = docWidth % 1 === 0 ? docWidth.toFixed(0) : docWidth.toFixed(3);
        const docLengthDisplay = docLength % 1 === 0 ? docLength.toFixed(0) : docLength.toFixed(3);
        const nUp = docsAcross * docsDown;
        const areaUsed = (docWidth * docLength * nUp) / (sheetWidth * sheetLength);

        return `
            <h2>Layout Details</h2>
            <table class="details-table">
            <tr><th>Sheet Size</th><td>${sheetWidthDisplay}x${sheetLengthDisplay} in</td></tr>
            <tr><th>Document Size</th><td>${docWidthDisplay} in x ${docLengthDisplay} in</td></tr>
            <tr><th>N-Up</th><td>${nUp} (${docsAcross}x${docsDown})</td></tr>
            <tr><th>Top Margin</th><td>${topMargin.toFixed(3)} in</td></tr>
            <tr><th>Bottom Margin</th><td>${bottomMargin.toFixed(3)} in</td></tr>
            <tr><th>Left Margin</th><td>${leftMargin.toFixed(3)} in</td></tr>
            <tr><th>Right Margin</th><td>${rightMargin.toFixed(3)} in</td></tr>
            <tr><th>Coverage Percentage</th><td>${(areaUsed * 100).toFixed(2)}%</td></tr>
            <tr><th>Wasted Space</th><td>${(100 - (areaUsed * 100)).toFixed(2)}%</td></tr>
            </table>
        `;
    }

    // Function to generate program sequence HTML
    function generateProgramSequenceHTML(layout) {
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

    // Function to calculate sequence
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

    // Function to show score options
    function showScoreOptions() {
        document.getElementById('scoredOptions').classList.remove('hidden');
    }

    // Function to calculate scores
    function calculateScores() {
        const scoredWithMargins = document.getElementById('scoredWithMargins').value === 'yes';
        const foldType = document.getElementById('foldType').value;

        const sheetWidth = parseFloat(sheetWidthInput.value);
        const sheetLength = parseFloat(sheetLengthInput.value);
        const docWidth = parseFloat(docWidthInput.value);
        const docLength = parseFloat(docLengthInput.value);
        const gutterWidth = parseFloat(gutterWidthInput.value);
        const gutterLength = parseFloat(gutterLengthInput.value);

        const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
        const docsDown = Math.floor(sheetLength / (docLength + gutterLength));
        const totalGutterWidth = (docsAcross - 1) * gutterWidth;
        const totalGutterLength = (docsDown - 1) * gutterLength;
        const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
        const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;

        const topMargin = (sheetLength - imposedSpaceLength) / 2;

        let marginOffset = scoredWithMargins ? topMargin : 0;

        let scoresHTML = generateScoresHTML(docsDown, docLength, gutterLength, marginOffset, foldType);
        document.getElementById('scorePositions').innerHTML = scoresHTML;
    }

    // Function to generate scores HTML
    function generateScoresHTML(docsDown, docLength, gutterLength, marginOffset, foldType) {
        let scoresHTML = `
            <h2>Score Positions</h2>
            <table class="score-table">
                <thead>
                    <tr>
                        <th>Score Position (inches)</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let i = 0; i < docsDown; i++) {
            if (foldType === 'bifold') {
                scoresHTML += `<tr><td>${((docLength / 2) + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
            } else if (foldType === 'trifold') {
                scoresHTML += `<tr><td>${((docLength / 3) + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
                scoresHTML += `<tr><td>${((2 * docLength / 3) - 0.05 + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
            }
        }

        scoresHTML += '</tbody></table>';
        return scoresHTML;
    }

    // Function to draw layout on canvas
    function drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin) {
        const canvas = document.getElementById('layoutCanvas');
        const ctx = canvas.getContext('2d');

        const scaleFactor = Math.min(canvas.width / sheetWidth, canvas.height / sheetLength);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sheetX = (canvas.width - sheetWidth * scaleFactor) / 2;
        const sheetY = (canvas.height - sheetLength * scaleFactor) / 2;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sheetX, sheetY, sheetWidth * scaleFactor, sheetLength * scaleFactor);

        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText('Sheet', sheetX + 5, sheetY + 15);

        ctx.strokeStyle = '#007BFF';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < docsAcross; i++) {
            for (let j = 0; j < docsDown; j++) {
                const x = sheetX + (leftMargin + i * (docWidth + gutterWidth)) * scaleFactor;
                const y = sheetY + (topMargin + j * (docLength + gutterLength)) * scaleFactor;
                ctx.strokeRect(x, y, docWidth * scaleFactor, docLength * scaleFactor);
                ctx.fillText(`Doc ${i + 1}-${j + 1}`, x + 5, y + 15);
            }
        }
    }

    // Function to toggle active class on buttons
    function toggleActiveClass(buttons, activeButton) {
        buttons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }
});
