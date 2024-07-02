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
            { width: 9, length: 12, name: "Rich People Letterhead" }
        ],
        gutter: [
            { gutter: 0.125 },
            { gutter: 0.25 }
        ]
    };

    // Cache frequently used DOM elements
    // TODO: Add default values for inputs (Sheet 12x18, Doc 3.5x2, Gutter 0.125)
    const elements = {
        sheetButtons: document.getElementById('sheetButtonsContainer'),
        docButtons: document.getElementById('docButtonsContainer'),
        gutterButtons: document.getElementById('gutterButtonsContainer'),
        sheetInputs: document.getElementById('sheetDimensionsInputs'),
        docInputs: document.getElementById('docDimensionsInputs'),
        gutterInputs: document.getElementById('gutterDimensionsInputs'),
        sheetWidth: document.getElementById('sheetWidth'),
        sheetLength: document.getElementById('sheetLength'),
        docWidth: document.getElementById('docWidth'),
        docLength: document.getElementById('docLength'),
        gutterWidth: document.getElementById('gutterWidth'),
        canvas: document.getElementById('layoutCanvas'),
        rotateDocsButton: document.getElementById('rotateDocsButton'),
        rotateSheetButton: document.getElementById('rotateSheetButton'),
        rotateDocsAndSheetButton: document.getElementById('rotateDocsAndSheetButton'),
        calculateButton: document.getElementById('calculateButton'),
        scoreButton: document.getElementById('scoreButton'),
        miscDataButton: document.getElementById('miscDataButton'),
        programSequence: document.getElementById('programSequence'),
        layoutDetails: document.getElementById('layoutDetails'),
        scorePositions: document.getElementById('scorePositions'),
        scoreOptions: document.getElementById('scoreOptions'),
        scoredWithMargins: document.getElementById('scoredWithMargins'),
        foldType: document.getElementById('foldType'),
        calculateScoresButton: document.getElementById('calculateScoresButton')
    };

    // Initialize the application
    function init() {
        createSizeButtons();
        setupEventListeners();
        // Set default selections
        selectDefaultSizes();
        calculateLayout();
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
        elements.miscDataButton.addEventListener('click', showMiscData);
        elements.scoreButton.addEventListener('click', showScoreOptions);
        elements.calculateScoresButton.addEventListener('click', calculateScores);
        elements.miscDataButton.addEventListener('click', toggleMiscData);
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
    // TODO: This currently doesnt fill in the inputs for custom sizes I don't know what it is doing but perhaps we can code the default sizes the elements when the page loads like the previous todo says
    function selectDefaultSizes() {
        const defaultSelections = {
            sheet: '12 x 18',
            doc: '3.5 x 2',
            gutter: '0.125'
        };

        Object.entries(defaultSelections).forEach(([type, value]) => {
            const container = elements[`${type}Buttons`];
            const button = Array.from(container.children).find(btn => btn.textContent === value);
            if (button) button.click();
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

        const topMargin = (sheetLength - imposedSpaceLength) / 2;
        const leftMargin = (sheetWidth - imposedSpaceWidth) / 2;

        return {
            sheetWidth, sheetLength, docWidth, docLength, gutterWidth,
            docsAcross, docsDown, imposedSpaceWidth, imposedSpaceLength,
            topMargin, leftMargin
        };
    }

    // Draw the layout on the canvas
    // TODO: Fix the CSS so the lines aren't blurry and use a consistent width.
    // TODO: Align the sheet center to the canvas
    // TODO: make the sheet width take up 80% of the canvas width.
    function drawLayout(layout) {
        const ctx = elements.canvas.getContext('2d');
        const scale = Math.min(elements.canvas.width / layout.sheetWidth, elements.canvas.height / layout.sheetLength);

        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        // Draw sheet
        ctx.strokeRect(0, 0, layout.sheetWidth * scale, layout.sheetLength * scale);

        // Draw documents
        for (let i = 0; i < layout.docsAcross; i++) {
            for (let j = 0; j < layout.docsDown; j++) {
                const x = (layout.leftMargin + i * (layout.docWidth + layout.gutterWidth)) * scale;
                const y = (layout.topMargin + j * (layout.docLength + layout.gutterWidth)) * scale;
                ctx.strokeRect(x, y, layout.docWidth * scale, layout.docLength * scale);
            }
        }

        // Draw margins
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(layout.leftMargin * scale, layout.topMargin * scale, layout.imposedSpaceWidth * scale, layout.imposedSpaceLength * scale);

        // Draw score lines
        // TODO: Score lines are not displaying 
        if (scorePositions.length > 0) {
            ctx.strokeStyle = 'magenta';
            ctx.setLineDash([5, 5]);
            scorePositions.forEach(pos => {
                const y = pos.y * scale;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(layout.sheetWidth * scale, y);
                ctx.stroke();
            });
            ctx.setLineDash([]);
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
        let sequence = [
            // The first four cuts are the cuts that trim off the margins of the sheet, essentially you rotate the sheet 90 degrees each cut and trim off the margins
            layout.sheetLength - layout.topMargin,
            layout.sheetWidth - layout.leftMargin,
            layout.imposedSpaceLength,
            layout.imposedSpaceWidth,
        ];

        // The next cuts are the cuts that trim down each width of the doc leaving a back cut that is removed when the final cut is repeated
        for (let i = 1; i < layout.docsAcross; i++) {
            sequence.push(layout.imposedSpaceWidth - i * (layout.docWidth + layout.gutterWidth));
        }
        // these are the final cuts that trim off the back cuts on the width
        sequence = sequence.concat(Array(layout.docsAcross - 1).fill(layout.docWidth));

        // The next cuts are the cuts that trim down each length of the doc leaving a back cut that is removed when the final cut is repeated
        for (let i = 1; i < layout.docsDown; i++) {
            sequence.push(layout.imposedSpaceLength - i * (layout.docLength + layout.gutterWidth));
        }
        // these are the final cuts that trim off the back cuts on the length
        sequence = sequence.concat(Array(layout.docsDown - 1).fill(layout.docLength));

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
                <tr><th>N-Up</th><td>${nUp} (${layout.docsAcross}x${layout.docsDown})</td></tr>
                <tr><th>Top Margin</th><td>${layout.topMargin.toFixed(2)} in</td></tr>
                <tr><th>Left Margin</th><td>${layout.leftMargin.toFixed(2)} in</td></tr>
                <tr><th>Coverage Percentage</th><td>${(areaUsed * 100).toFixed(2)}%</td></tr>
                <tr><th>Wasted Space</th><td>${((1 - areaUsed) * 100).toFixed(2)}%</td></tr>
            </table>
        `;
        elements.layoutDetails.innerHTML = html;
    }

    // Show miscellaneous data
    function showMiscData() {
        elements.layoutDetails.classList.toggle('hidden');
    }

    // Show score options 
    function showScoreOptions() {
        elements.scoreOptions.classList.toggle('hidden');
    }

    // Calculate scores
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

    // Display score positions
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

    // Show miscellaneous data
    function showMiscData() {
        elements.layoutDetails.classList.toggle('hidden');
    }

    // Initialize the application
    init();
});