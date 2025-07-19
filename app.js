// app.js

// Import the drawLayout function from the visualizer module
import { drawLayout } from './visualizer.js';

// Import the SIZE_OPTIONS object from the sizeOptions module
import { SIZE_OPTIONS } from './sizeOptions.js';

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    // Cache frequently used DOM elements for better performance
    const elements = {
        // Sheet elements
        sheetButtons: document.getElementById('sheetButtonsContainer'),
        sheetInputs: document.getElementById('sheetDimensionsInputs'),
        sheetWidth: document.getElementById('sheetWidth'),
        sheetLength: document.getElementById('sheetLength'),
        
        // Document elements
        docButtons: document.getElementById('docButtonsContainer'),
        docInputs: document.getElementById('docDimensionsInputs'),
        docWidth: document.getElementById('docWidth'),
        docLength: document.getElementById('docLength'),
        
        // Gutter elements
        gutterButtons: document.getElementById('gutterButtonsContainer'),
        gutterInputs: document.getElementById('gutterDimensionsInputs'),
        gutterWidth: document.getElementById('gutterWidth'),
        gutterLength: document.getElementById('gutterLength'),
        
        // Canvas element
        canvas: document.getElementById('layoutCanvas'),
        
        // Other buttons and inputs
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

    // ===== Initialization =====
    // Function to initialize the application
    function init() {
        createSizeButtons();
        setupEventListeners();
        setDefaultValues();
        selectDefaultSizes();
        calculateLayout();
    }

    // ===== Button Creation =====
    // Function to create all size buttons
    function createSizeButtons() {
        createButtonsForType('sheet', elements.sheetButtons);
        createButtonsForType('doc', elements.docButtons);
        createButtonsForType('gutter', elements.gutterButtons);
    }

    // Function to create buttons for a specific type (sheet, doc, or gutter)
    function createButtonsForType(type, container) {
        // Create buttons for each predefined size option
        SIZE_OPTIONS[type].forEach(option => {
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
        
        // Add custom button for user-defined sizes
        const customButton = document.createElement('button');
        customButton.type = 'button';
        customButton.id = `custom${type.charAt(0).toUpperCase() + type.slice(1)}SizeButton`;
        customButton.className = `${type}-size-button`;
        customButton.textContent = 'Custom';
        container.appendChild(customButton);
    }

    // ===== Event Listeners =====
    // Function to set up all event listeners
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

    // ===== Event Handlers =====
    // Function to handle clicks on size buttons
    function handleSizeButtonClick(event) {
        if (event.target.tagName === 'BUTTON') {
            const type = event.target.className.split('-')[0]; // 'sheet', 'doc', or 'gutter'
            const inputs = elements[`${type}Inputs`];
            const isCustom = event.target.id.includes('custom');

            // Toggle active class for visual feedback
            event.target.parentNode.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            

            // Show/hide custom inputs based on button clicked
            inputs.classList.toggle('hidden', !isCustom);

            if (!isCustom) {
                // Set input values from button data
                if (type === 'gutter') {
                    elements.gutterWidth.value = event.target.dataset.gutter;
                    elements.gutterLength.value = event.target.dataset.gutter;
                } else {
                    elements[`${type}Width`].value = event.target.dataset.width;
                    elements[`${type}Length`].value = event.target.dataset.length;
                }
            }

            calculateLayout();
        }
    }

    // ===== Size Manipulation =====
    // Function to rotate dimensions for a given type (doc or sheet)
    function rotateSize(type, shouldCalculate = true) {
        const widthInput = elements[`${type}Width`];
        const lengthInput = elements[`${type}Length`];
        [widthInput.value, lengthInput.value] = [lengthInput.value, widthInput.value];
        if (shouldCalculate) {
            calculateLayout();
        }
    }

    // Function to rotate both document and sheet dimensions
    function rotateDocsAndSheet() {
        rotateSize('doc', false);
        rotateSize('sheet', false);
        calculateLayout();
    }

    // ===== Layout Calculation =====
    // Main function to calculate and display layout
    function calculateLayout() {
        const layout = calculateLayoutDetails();
        drawLayoutWrapper(layout);
        displayProgramSequence(layout);
        displayLayoutDetails(layout);
    }

    // Function to calculate detailed layout information
    function calculateLayoutDetails() {
        const sheetWidth = parseFloat(elements.sheetWidth.value);
        const sheetLength = parseFloat(elements.sheetLength.value);
        const docWidth = parseFloat(elements.docWidth.value);
        const docLength = parseFloat(elements.docLength.value);
        const gutterWidth = parseFloat(elements.gutterWidth.value);
        const gutterLength = parseFloat(elements.gutterLength.value);

        const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
        const docsDown = Math.floor(sheetLength / (docLength + gutterLength));
        const totalGutterWidth = (docsAcross - 1) * gutterWidth;
        const totalGutterLength = (docsDown - 1) * gutterLength;
        const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
        const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;
        const gutterSpaceWidth = totalGutterWidth;
        const gutterSpaceLength = totalGutterLength;

        const topMargin = (sheetLength - imposedSpaceLength) / 2;
        const leftMargin = (sheetWidth - imposedSpaceWidth) / 2;

        return {
            sheetWidth, sheetLength, docWidth, docLength, gutterWidth, gutterLength,
            docsAcross, docsDown, imposedSpaceWidth, imposedSpaceLength,
            topMargin, leftMargin, gutterSpaceWidth, gutterSpaceLength
        };
    }

    // ===== Drawing =====
    // Wrapper function to draw layout using the imported drawLayout function
    function drawLayoutWrapper(layout, scorePositions = []) {
        drawLayout(elements.canvas, layout, scorePositions);
    }

    // ===== Display Functions =====
    // Function to display the program sequence
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

    // Function to display layout details
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
                <tr><th>Doc Plus Gutter Size</th><td>${(layout.docWidth + layout.gutterWidth).toFixed(2)} x ${(layout.docLength + layout.gutterLength).toFixed(2)} in</td></tr>
            </table>
        `;
        elements.layoutDetails.innerHTML = html;
    }

    // Function to display score positions
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

    // ===== Utility Functions =====
    // Function to set default values for inputs
    function setDefaultValues() {
        elements.sheetWidth.value = "12.0";
        elements.sheetLength.value = "18.0";
        elements.docWidth.value = "3.5";
        elements.docLength.value = "2.0";
        elements.gutterWidth.value = "0.125";
        elements.gutterLength.value = "0.125";
    }

    // Function to select default sizes for sheet, doc, and gutter
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
                    elements.gutterLength.value = value;
                } else {
                    const [width, length] = value.split(' x ');
                    elements[`${type}Width`].value = width;
                    elements[`${type}Length`].value = length;
                }
            }
        });
    }

    // Function to calculate the sequence of cuts
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

        // Step 6: repeat docWidth for docsAcross minus 1
        for (let i = 1; i < layout.docsAcross; i++) {
            sequence.push(layout.docWidth);
        }

        // Step 7: Cut horizontal gutters, leaving a back cut
        for (let i = 1; i < layout.docsDown; i++) {
            sequence.push(layout.imposedSpaceLength - i * (layout.docLength + layout.gutterLength));
        }

        // Step 8: repeat docLength for docsDown minus 1
        for (let i = 1; i < layout.docsDown; i++) {
            sequence.push(layout.docLength);
        }

        return sequence;
    }

    // ===== UI Toggles =====
    // Function to toggle display of miscellaneous data
    function toggleMiscData() {
        elements.layoutDetails.classList.toggle('hidden');
    }

    // Function to show/hide score options
    function showScoreOptions() {
        elements.scoreOptions.classList.toggle('hidden');
    }

// ===== Scoring =====
    // Function to calculate and display scores
    function calculateScores() {
        const scoredWithMargins = elements.scoredWithMargins.value === 'yes';
        const foldType = elements.foldType.value;
        const layout = calculateLayoutDetails();

        let marginOffset = scoredWithMargins ? layout.topMargin : 0;

        let scorePositions = [];
        for (let i = 0; i < layout.docsDown; i++) {
            if (foldType === 'bifold') {
                scorePositions.push({ 
                    y: (layout.docLength / 2) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                    scoredWithMargins: scoredWithMargins
                });
            } else if (foldType === 'trifold') {
                scorePositions.push({ 
                    y: (layout.docLength / 3) + i * (layout.docLength + layout.gutterLength) + marginOffset,
                    scoredWithMargins: scoredWithMargins
                });
                scorePositions.push({ 
                    y: (2 * layout.docLength / 3) - 0.05 + i * (layout.docLength + layout.gutterLength) + marginOffset,
                    scoredWithMargins: scoredWithMargins
                });
            }
        }

        // Draw the layout with score positions
        drawLayoutWrapper(layout, scorePositions);
        // Display the calculated score positions
        displayScorePositions(scorePositions);
    }

    // ===== Initialize the application =====
    init();
});

// Additional comments on the overall structure and flow of the application:

// 1. The application uses a modular structure, with separate files for visualizer and size options.
// 2. The main app.js file orchestrates the overall functionality, handling user interactions and calculations.
// 3. The application follows these main steps:
//    a. Initialize by creating buttons, setting up event listeners, and setting default values.
//    b. Respond to user interactions (button clicks, input changes) by updating the layout.
//    c. Calculate and display the layout, program sequence, and other details based on user input.
//    d. Provide additional features like rotating dimensions and calculating scores.
// 4. The code is organized into logical sections (initialization, button creation, event handling, etc.) for better readability and maintainability.
// 5. Extensive use of comments helps explain the purpose and functionality of each section and important functions.
// 6. The application uses a mix of procedural and object-oriented programming styles, with most functionality encapsulated in functions.
// 7. DOM manipulation is minimized by caching frequently used elements and updating content efficiently.

// Potential areas for future improvement:
// - Further modularization of functionality into separate modules (e.g., a calculation module).
// - Implementation of a state management system for more complex applications.
// - Addition of error handling and input validation for robustness.
// - Implementation of unit tests to ensure reliability of calculations and layout functions.
// - Consideration of accessibility features for better usability across different user groups.