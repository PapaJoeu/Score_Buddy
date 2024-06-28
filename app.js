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
        const calculateButton = document.getElementById('calculateButton');
        const scoreButton = document.getElementById('scoreButton');
        const calculateScoresButton = document.getElementById('calculateScoresButton');

        calculateButton.addEventListener('click', calculateLayout);
        scoreButton.addEventListener('click', showScoreOptions);
        calculateScoresButton.addEventListener('click', calculateScores);

        const addEventListenerToButtons = (buttons, eventHandler) => {
            buttons.forEach(button => {
                button.addEventListener('click', eventHandler);
            });
        };

        addEventListenerToButtons(sheetButtons, handleSheetSizeButtonClick);
        addEventListenerToButtons(docButtons, handleDocSizeButtonClick);
        addEventListenerToButtons(gutterButtons, handleGutterSizeButtonClick);

        // Preselect default buttons (12x18 sheet, 3.5x2 doc, 0.125 gutter)
        const defaultSheetButton = document.querySelector('.sheet-size-button[data-width="12"][data-length="18"]');
        const defaultDocButton = document.querySelector('.doc-size-button[data-width="3.5"][data-length="2"]');
        const defaultGutterButton = document.querySelector('.gutter-size-button[data-gutter="0.125"]');

        // Set default values and calculate layout
        defaultSheetButton.classList.add('active');
        defaultDocButton.classList.add('active');
        defaultGutterButton.classList.add('active');
        calculateButton.click();
    }

    // Function to set up custom size input event listeners
    function setupCustomSizeEventListeners() {
        // Function to reset input values
        const resetInputValues = (input1, input2) => {
            input1.value = '';
            input2.value = '';
        };

        // Function to set up event listener for custom button
        const setupCustomButtonEventListener = (customButton, widthInput, lengthInput, buttons) => {
            customButton.addEventListener('click', () => {
                resetInputValues(widthInput, lengthInput);
                toggleActiveClass(buttons, customButton);
            });
        };

        // Set up event listeners for custom size buttons
        setupCustomButtonEventListener(customSheetButton, sheetWidthInput, sheetLengthInput, sheetButtons);
        setupCustomButtonEventListener(customDocButton, docWidthInput, docLengthInput, docButtons);
        setupCustomButtonEventListener(customGutterButton, gutterWidthInput, gutterLengthInput, gutterButtons);
    }

    // Function to set up rotate button event listeners
    function setupRotateButtonEventListeners() {
        const rotateDocsButton = document.getElementById('rotateDocsButton');
        const rotateSheetButton = document.getElementById('rotateSheetButton');
        const rotateDocsAndSheetButton = document.getElementById('rotateDocsAndSheetButton');

        rotateDocsButton.addEventListener('click', handleRotateButtonClick.bind(null, docWidthInput, docLengthInput));
        rotateSheetButton.addEventListener('click', handleRotateButtonClick.bind(null, sheetWidthInput, sheetLengthInput));
        
    }

    // Event handler for rotate button click
    function handleRotateButtonClick(input1, input2) {
        rotateInputValues(input1, input2);
        calculateLayout();
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
    

    // TODO: Refactor Out Into Separate File layout.js
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
    
        let scorePositions = [];
        for (let i = 0; i < docsDown; i++) {
            if (foldType === 'bifold') {
                scorePositions.push({ y: (docLength / 2) + i * (docLength + gutterLength) + marginOffset });
            } else if (foldType === 'trifold') {
                scorePositions.push({ y: (docLength / 3) + i * (docLength + gutterLength) + marginOffset });
                scorePositions.push({ y: (2 * docLength / 3) - 0.05 + i * (docLength + gutterLength) + marginOffset });
            }
        }
    
        drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, (sheetWidth - imposedSpaceWidth) / 2, scorePositions);
        generateScoresHTML(docsDown, docLength, gutterLength, marginOffset, foldType);
    }
    // Refactor Out Into Separate File score.js
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
        document.getElementById('scorePositions').innerHTML = scoresHTML;
    }

    function drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin, scorePositions) {
        // Get the canvas element and its context
        const canvas = document.getElementById('layoutCanvas');
        const ctx = canvas.getContext('2d');
        const offsetMargin = document.getElementById('scoredWithMargins').value === 'yes' ? topMargin : 0;

        // Set the canvas size to match the sheet size
        const canvasWidth = scoredWithMargins ? sheetWidth : imposedSpaceWidth;
        const canvasHeight = scoredWithMargins ? sheetLength : imposedSpaceLength;
        canvas.width = canvasWidth * 100;
        canvas.height = canvasHeight * 100;

    
        // Calculate the scale factor based on the canvas size and sheet dimensions
        const scaleFactor = Math.min(canvas.width / sheetWidth, canvas.height / sheetLength);
    
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Calculate the position of the sheet on the canvas
        const sheetX = (canvas.width - sheetWidth * scaleFactor) / 2;
        const sheetY = (canvas.height - sheetLength * scaleFactor) / 2;
    
        // Draw the sheet outline
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(sheetX, sheetY, sheetWidth * scaleFactor, sheetLength * scaleFactor);
    
        // Draw the document rectangles
        ctx.strokeStyle = '#007BFF';
        ctx.lineWidth = 1;
        for (let i = 0; i < docsAcross; i++) {
            for (let j = 0; j < docsDown; j++) {
                // Calculate the position of each document rectangle
                const x = sheetX + (leftMargin + i * (docWidth + gutterWidth)) * scaleFactor;
                const y = sheetY + (topMargin + j * (docLength + gutterLength)) * scaleFactor;
    
                // Draw the document rectangle
                ctx.strokeRect(x, y, docWidth * scaleFactor, docLength * scaleFactor);
    
                // Display the document label as centered text
                ctx.fillText(`${i + 1 + j * docsAcross}`, x + docWidth * scaleFactor / 2 - 5, y + docLength * scaleFactor / 2 + 5);
            }
        }
    
        // Draw score lines if score positions are provided
        if (scorePositions && scorePositions.length > 0) {
            ctx.strokeStyle = 'magenta';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);  // Make the line dotted
    
            ctx.beginPath();
            scorePositions.forEach(position => {
                const y = sheetY + (topMargin + position.y) * scaleFactor;
                ctx.moveTo(sheetX, y);
                ctx.lineTo(sheetX + sheetWidth * scaleFactor, y);
            });
            ctx.stroke();
            
            // Reset the line dash setting to solid for future drawings
            ctx.setLineDash([]);
        }
    }
    
    
    

    // Function to toggle active class on buttons
    function toggleActiveClass(buttons, activeButton) {
        buttons.forEach(button => {
            if (button === activeButton) {
                button.classList.toggle('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
});
