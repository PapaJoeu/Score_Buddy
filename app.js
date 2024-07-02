// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Size options for sheets, documents, and gutters
    const sizeOptions = {
        sheet: [
            { width: 12, length: 18 },
            { width: 13, length: 19 },
            { width: 9, length: 12 },
            { width: 8.5, length: 11 },
            { width: 26, length: 40 }
        ],
        doc: [
            { width: 3.5, length: 2, name: "Business Card" },
            { width: 4, length: 6, name: "Chipotle Opening Card" },
            { width: 4.25, length: 11, name: "Door Hanger" },
            { width: 5, length: 7, name: "Invite" },
            { width: 5.5, length: 8.5, name: "Half Letter" },
            { width: 6, length: 9, name: "Sunrun Postcard" },
            { width: 8.5, length: 11, name: "Letter" },
            { width: 9, length: 12, name: "Rich People Letterhead" },
            { width: 11, length: 17, name: "Tabloid" }
        ],
        gutter: [
            { gutter: 0.125 },
            { gutter: 0.25 }
        ]
    };

    // Cache frequently used DOM elements
    
    // Sheet elements
    const elements = {
        sheetButtons: document.getElementById('sheetButtonsContainer'), // Buttons for sheet sizes
        sheetInputs: document.getElementById('sheetDimensionsInputs'), // Inputs for sheet dimensions
        sheetWidth: document.getElementById('sheetWidth'), // Input for sheet width
        sheetLength: document.getElementById('sheetLength'), // Input for sheet length
        
        // Document elements
        docButtons: document.getElementById('docButtonsContainer'), // Buttons for document sizes
        docInputs: document.getElementById('docDimensionsInputs'), // Inputs for document dimensions
        docWidth: document.getElementById('docWidth'), // Input for document width
        docLength: document.getElementById('docLength'), // Input for document length
        
        // Gutter elements
        gutterButtons: document.getElementById('gutterButtonsContainer'), // Buttons for gutter sizes
        gutterInputs: document.getElementById('gutterDimensionsInputs'), // Inputs for gutter dimensions
        gutterWidth: document.getElementById('gutterWidth'), // Input for gutter width
        
        // Canvas element
        canvas: document.getElementById('layoutCanvas'), // Canvas for drawing the layout
        
        // Other buttons and inputs
        rotateDocsButton: document.getElementById('rotateDocsButton'), // Button to rotate document size
        rotateSheetButton: document.getElementById('rotateSheetButton'), // Button to rotate sheet size
        rotateDocsAndSheetButton: document.getElementById('rotateDocsAndSheetButton'), // Button to rotate both document and sheet sizes
        calculateButton: document.getElementById('calculateButton'), // Button to calculate layout
        scoreButton: document.getElementById('scoreButton'), // Button to show score options
        miscDataButton: document.getElementById('miscDataButton'), // Button to toggle miscellaneous data
        programSequence: document.getElementById('programSequence'), // Element to display program sequence
        layoutDetails: document.getElementById('layoutDetails'), // Element to display layout details
        scorePositions: document.getElementById('scorePositions'), // Element to display score positions
        scoreOptions: document.getElementById('scoreOptions'), // Element for score options
        scoredWithMargins: document.getElementById('scoredWithMargins'), // Element for scored with margins
        foldType: document.getElementById('foldType'), // Element for fold type
        calculateScoresButton: document.getElementById('calculateScoresButton') // Button to calculate scores
    };

    // Initialize the application
    function init() {
        createSizeButtons();
        setupEventListeners();
        setDefaultValues();
        selectDefaultSizes();
        calculateLayout();
    }

    // Set default values for inputs
    function setDefaultValues() {
        elements.sheetWidth.value = "12.0";
        elements.sheetLength.value = "18.0";
        elements.docWidth.value = "3.5";
        elements.docLength.value = "2.0";
        elements.gutterWidth.value = "0.125";
    }

    // Create buttons for sheet, document, and gutter sizes
    function createSizeButtons() {
        createButtonsForType('sheet', elements.sheetButtons);
        createButtonsForType('doc', elements.docButtons);
        createButtonsForType('gutter', elements.gutterButtons);
    }

    // Create buttons for a specific type (sheet, doc, or gutter)
    function createButtonsForType(type, container) {
        sizeOptions[type].forEach(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `${type}-size-button`;
            if (type === 'gutter') {
                button.textContent = option.gutter;
                button.dataset.gutter = option.gutter;
            } else {
                button.textContent = `${option.width} x ${option.length}`;
                button.dataset.width = option.width;
                button.dataset.length = option.length;
                if (option.name) button.dataset.name = option.name;
            }
            container.appendChild(button);
        });
        
        // Add custom button
        const customButton = document.createElement('button');
        customButton.type = 'button';
        customButton.id = `custom${type.charAt(0).toUpperCase() + type.slice(1)}SizeButton`;
        customButton.className = `${type}-size-button`;
        customButton.textContent = 'Custom';
        container.appendChild(customButton);
    }

    // Set up event listeners for all interactive elements
    function setupEventListeners() {
        elements.sheetButtons.addEventListener('click', handleSizeButtonClick);
        elements.docButtons.addEventListener('click', handleSizeButtonClick);
        elements.gutterButtons.addEventListener('click', handleSizeButtonClick);
        elements.rotateDocsButton.addEventListener('click', () => rotateSize('doc'));
        elements.rotateSheetButton.addEventListener('click', () => rotateSize('sheet'));
        elements.rotateDocsAndSheetButton.addEventListener('click', rotateDocsAndSheet);
        elements.calculateButton.addEventListener('click', calculateLayout);
        elements.scoreButton.addEventListener('click', showScoreOptions);
        elements.miscDataButton.addEventListener('click', toggleMiscData);
        elements.calculateScoresButton.addEventListener('click', calculateScores);
    }

    // Handle click events for size buttons
    function handleSizeButtonClick(event) {
        if (event.target.tagName === 'BUTTON') {
            const type = event.target.className.split('-')[0]; // 'sheet', 'doc', or 'gutter'
            const inputs = elements[`${type}Inputs`];
            const isCustom = event.target.id.includes('custom');

            // Toggle active class
            event.target.parentNode.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            // Show/hide custom inputs
            inputs.classList.toggle('hidden', !isCustom);

            if (!isCustom) {
                // Set input values from button data
                if (type === 'gutter') {
                    elements.gutterWidth.value = event.target.dataset.gutter;
                } else {
                    elements[`${type}Width`].value = event.target.dataset.width;
                    elements[`${type}Length`].value = event.target.dataset.length;
                }
            }

            calculateLayout();
        }
    }

    // Rotate the size of a specific element (doc or sheet)
    function rotateSize(type) {
        const widthInput = elements[`${type}Width`];
        const lengthInput = elements[`${type}Length`];
        [widthInput.value, lengthInput.value] = [lengthInput.value, widthInput.value];
        calculateLayout();
    }

    // Rotate both docs and sheet
    function rotateDocsAndSheet() {
        rotateSize('doc');
        rotateSize('sheet');
    }

    // Select default sizes for sheet, doc, and gutter
    function selectDefaultSizes() {
        const defaultSelections = {
            sheet: '12 x 18',
            doc: '3.5 x 2',
            gutter: '0.125'
        };

        Object.entries(defaultSelections).forEach(([type, value]) => {
            const container = elements[`${type}Buttons`];
            const button = Array.from(container.children).find(btn => btn.textContent === value);
            if (button) {
                button.click();
            } else {
                // If the default button is not found, set the input values directly
                if (type === 'gutter') {
                    elements.gutterWidth.value = value;
                } else {
                    const [width, length] = value.split(' x ');
                    elements[`${type}Width`].value = width;
                    elements[`${type}Length`].value = length;
                }
            }
        });
    }

    // Calculate and display the layout
    function calculateLayout() {
        const layout = calculateLayoutDetails();
        drawLayout(layout);
        displayProgramSequence(layout);
        displayLayoutDetails(layout);
    }

    // Calculate layout details based on current inputs
    function calculateLayoutDetails() {
        const sheetWidth = parseFloat(elements.sheetWidth.value);
        const sheetLength = parseFloat(elements.sheetLength.value);
        const docWidth = parseFloat(elements.docWidth.value);
        const docLength = parseFloat(elements.docLength.value);
        const gutterWidth = parseFloat(elements.gutterWidth.value);

        const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
        const docsDown = Math.floor(sheetLength / (docLength + gutterWidth));
        const totalGutterWidth = (docsAcross - 1) * gutterWidth;
        const totalGutterLength = (docsDown - 1) * gutterWidth;
        const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
        const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;
        const gutterSpaceWidth = totalGutterWidth;
        const gutterSpaceLength = totalGutterLength;

        const topMargin = (sheetLength - imposedSpaceLength) / 2;
        const leftMargin = (sheetWidth - imposedSpaceWidth) / 2;

        return {
            sheetWidth, sheetLength, docWidth, docLength, gutterWidth,
            docsAcross, docsDown, imposedSpaceWidth, imposedSpaceLength,
            topMargin, leftMargin, gutterSpaceWidth, gutterSpaceLength
        };
    }

    // Draw the layout on the canvas
    function drawLayout(layout, scorePositions = []) {
        const calculatedScale = calculateAdaptiveScale(layout, elements.canvas.width, elements.canvas.height);
        const ctx = elements.canvas.getContext('2d');
        
        // Set canvas size to match its display size
        elements.canvas.width = elements.canvas.offsetWidth;
        elements.canvas.height = elements.canvas.offsetHeight;
        
        // Calculate scale to make sheet width 80% of canvas width
        const scale = (elements.canvas.width * 0.8) / layout.sheetWidth;
    
        // Scale the canvas height to match the sheet aspect ratio
        elements.canvas.height = layout.sheetLength * scale * 1.1; // Add 10% for padding
    
        // Calculate offsets to center the sheet
        const offsetX = (elements.canvas.width - layout.sheetWidth * scale) / 2;
        const offsetY = (elements.canvas.height - layout.sheetLength * scale) / 2;
    
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        
        // Use crisp edges for all lines
        ctx.imageSmoothingEnabled = false;
        ctx.translate(0.5, 0.5);
    
        // Draw sheet
        ctx.strokeStyle = 'black';
        ctx.strokeRect(
            Math.round(offsetX),
            Math.round(offsetY),
            Math.round(layout.sheetWidth * scale),
            Math.round(layout.sheetLength * scale)
        );
    
        // Draw documents
        for (let i = 0; i < layout.docsAcross; i++) {
            for (let j = 0; j < layout.docsDown; j++) {
                const x = offsetX + (layout.leftMargin + i * (layout.docWidth + layout.gutterWidth)) * scale;
                const y = offsetY + (layout.topMargin + j * (layout.docLength + layout.gutterWidth)) * scale;
                ctx.strokeRect(
                    Math.round(x),
                    Math.round(y),
                    Math.round(layout.docWidth * scale),
                    Math.round(layout.docLength * scale)
                );
            }
        }
    
        // Draw margins
        ctx.strokeStyle = 'red';
        ctx.strokeRect(
            Math.round(offsetX + layout.leftMargin * scale),
            Math.round(offsetY + layout.topMargin * scale),
            Math.round(layout.imposedSpaceWidth * scale),
            Math.round(layout.imposedSpaceLength * scale)
        );
    
        // Draw score lines
        if (scorePositions.length > 0) {
            ctx.strokeStyle = 'magenta';
            ctx.setLineDash([5, 5]);
            scorePositions.forEach(pos => {
                // Adjust y position based on whether margins are included
                const y = offsetY + (elements.scoredWithMargins.value === 'yes' ? pos.y : pos.y + layout.topMargin) * scale;
                ctx.beginPath();
                ctx.moveTo(offsetX, Math.round(y));
                ctx.lineTo(offsetX + layout.sheetWidth * scale, Math.round(y));
                ctx.stroke();
            });
            ctx.setLineDash([]);
        }
    
        ctx.translate(-0.5, -0.5);
        // Draw document labels
        drawDocumentLabels(ctx, layout, scale, offsetX, offsetY);
    }

    // Calculate the scale for an adaptive layout
        function calculateAdaptiveScale(layout, canvasWidth, canvasHeight) {
            const canvasAspectRatio = canvasWidth / canvasHeight;
            const sheetAspectRatio = layout.sheetWidth / layout.sheetLength;
            
            let scale;
            if (sheetAspectRatio > canvasAspectRatio) {
                // Sheet is wider than canvas
                scale = (canvasWidth * 0.9) / layout.sheetWidth;
            } else {
                // Sheet is taller than canvas
                scale = (canvasHeight * 0.9) / layout.sheetLength;
            }
            
            return scale;
        }
    
    // Use this function in drawLayout
        function drawDocumentLabels(ctx, layout, scale, offsetX, offsetY) {
            ctx.font = '12px Arial';
            ctx.fillStyle = 'blue';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        
            let docNumber = 1;
            for (let i = 0; i < layout.docsAcross; i++) {
                for (let j = 0; j < layout.docsDown; j++) {
                    const x = offsetX + (layout.leftMargin + (i + 0.5) * (layout.docWidth + layout.gutterWidth)) * scale;
                    const y = offsetY + (layout.topMargin + (j + 0.5) * (layout.docLength + layout.gutterWidth)) * scale;
                    ctx.fillText(docNumber.toString(), x, y);
                    docNumber++;
                }
            }
        }

    // Display the program sequence
    function displayProgramSequence(layout) {
        const sequence = calculateSequence(layout);
        let html = `
            <h2>Program Sequence</h2>
            <table>
                <tr><th>Step</th><th>Cut Measurement</th></tr>
                ${sequence.map((cut, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${cut.toFixed(3)} inches</td>
                    </tr>
                `).join('')}
            </table>
        `;
        elements.programSequence.innerHTML = html;
    }

    // Calculate the sequence of cuts
    function calculateSequence(layout) {
        let sequence = [];

        // Step 1: Trim off the top margin
        sequence.push(layout.sheetLength - layout.topMargin);

        // Step 2: Rotate 90 degrees and trim off the right margin
        sequence.push(layout.sheetWidth - layout.leftMargin);

        // Step 3: Rotate 90 degrees and trim off the bottom margin
        sequence.push(layout.imposedSpaceLength);

        // Step 4: Rotate 90 degrees and trim off the left margin
        sequence.push(layout.imposedSpaceWidth);

        // Step 5: to 4+docsAcross: Cut vertical gutters, leaving a back cut
        for (let i = 1; i < layout.docsAcross; i++) {
            sequence.push(layout.imposedSpaceWidth - i * (layout.docWidth + layout.gutterWidth));
        }

        // Step 6: repeat docwidth for docsAcross minus 1
        for (let i = 1; i < layout.docsAcross; i++) {
            sequence.push(layout.docWidth);
        }

        // Step 7: Cut horizontal gutters, leaving a back cut
        for (let i = 1; i < layout.docsDown; i++) {
            sequence.push(layout.imposedSpaceLength - i * (layout.docLength + layout.gutterWidth));
        }

        // Step 8: repeat docLength for docsDown minus 1
        for (let i = 1; i < layout.docsDown; i++) {
            sequence.push(layout.docLength);
        }

        return sequence;
    }

// Display layout details
function displayLayoutDetails(layout) {
    const nUp = layout.docsAcross * layout.docsDown;
    const areaUsed = (layout.docWidth * layout.docLength * nUp) / (layout.sheetWidth * layout.sheetLength);
    const html = `
        <h2>Layout Details</h2>
        <table>
            <tr><th>Sheet Size</th><td>${layout.sheetWidth} x ${layout.sheetLength} in</td></tr>
            <tr><th>Document Size</th><td>${layout.docWidth} x ${layout.docLength} in</td></tr>
            <tr><th>Imposed Space Size</th><td>${layout.imposedSpaceWidth.toFixed(2)} x ${layout.imposedSpaceLength.toFixed(2)} in</td></tr>
            <tr><th>N-Up</th><td>${nUp} (${layout.docsAcross}x${layout.docsDown})</td></tr>
            <tr><th>Top Margin</th><td>${layout.topMargin.toFixed(2)} in</td></tr>
            <tr><th>Left Margin</th><td>${layout.leftMargin.toFixed(2)} in</td></tr>
            <tr><th>Coverage Percentage / Wasted Percentage</th><td>${(areaUsed * 100).toFixed(2)}% : ${(100 - areaUsed * 100).toFixed(2)}%</td></tr>
            <tr><th>Doc Plus Gutter Size</th><td>${(layout.docWidth + layout.gutterWidth).toFixed(2)} x ${(layout.docLength + layout.gutterWidth).toFixed(2)} in</td></tr>
        </table>
    `;
    elements.layoutDetails.innerHTML = html;
}

// Toggle visibility of miscellaneous data (layout details)
function toggleMiscData() {
    elements.layoutDetails.classList.toggle('hidden');
}

// Show score options 
function showScoreOptions() {
    elements.scoreOptions.classList.toggle('hidden');
}

// Calculate scores based on user input
function calculateScores() {
    const scoredWithMargins = elements.scoredWithMargins.value === 'yes';
    const foldType = elements.foldType.value;
    const layout = calculateLayoutDetails();

    let marginOffset = scoredWithMargins ? layout.topMargin : 0;

    let scorePositions = [];
    for (let i = 0; i < layout.docsDown; i++) {
        if (foldType === 'bifold') {
            scorePositions.push({ y: (layout.docLength / 2) + i * (layout.docLength + layout.gutterWidth) + marginOffset });
        } else if (foldType === 'trifold') {
            scorePositions.push({ y: (layout.docLength / 3) + i * (layout.docLength + layout.gutterWidth) + marginOffset });
            scorePositions.push({ y: (2 * layout.docLength / 3) - 0.05 + i * (layout.docLength + layout.gutterWidth) + marginOffset });
        }
    }

    drawLayout(layout, scorePositions);
    displayScorePositions(scorePositions);
}

// Display calculated score positions
function displayScorePositions(scorePositions) {
    let html = `
        <h2>Score Positions</h2>
        <table>
            <tr><th>Score Position (inches)</th></tr>
            ${scorePositions.map(pos => `<tr><td>${pos.y.toFixed(3)}</td></tr>`).join('')}
        </table>
    `;
    elements.scorePositions.innerHTML = html;
}

// Initialize the application
init();
});