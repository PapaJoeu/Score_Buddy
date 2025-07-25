// app.js

// Import the drawLayout function from the visualizer module
import { drawLayout } from './visualizer.js';
import { calculateLayoutDetails as calcDetails, calculateSequence as calcSequence } from './calculations.js';
import { calculateScorePositions } from './scoring.js';
import { renderProgramSequence, renderLayoutDetails, renderScorePositions } from './display.js';

// Import the SIZE_OPTIONS object from the sizeOptions module
import { SIZE_OPTIONS } from './sizeOptions.js';
import { createSizeButtons, createButtonsForType } from './buttonCreation.js';

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
        createSizeButtons({
            sheetButtons: elements.sheetButtons,
            docButtons: elements.docButtons,
            gutterButtons: elements.gutterButtons
        }, SIZE_OPTIONS);
        setupEventListeners();
        setDefaultValues();
        selectDefaultSizes();
        calculateLayout();
    }

    // ===== Button Creation =====
    // Size button creation is handled in a separate module

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
                    elements.gutterWidth.value = event.target.dataset.width;
                    elements.gutterLength.value = event.target.dataset.length;
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

        return calcDetails({
            sheetWidth,
            sheetLength,
            docWidth,
            docLength,
            gutterWidth,
            gutterLength
        });
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
        renderProgramSequence(sequence, elements.programSequence);
    }

    // Function to display layout details
    function displayLayoutDetails(layout) {
        renderLayoutDetails(layout, elements.layoutDetails);
    }

    // Function to display score positions
    function displayScorePositions(scorePositions) {
        renderScorePositions(scorePositions, elements.scorePositions);
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
            gutter: '0.125 x 0.125'
        };

        Object.entries(defaultSelections).forEach(([type, value]) => {
            const container = elements[`${type}Buttons`];
            const button = Array.from(container.children).find(btn => btn.textContent === value);
            if (button) {
                button.click();
            } else {
                // If the default button is not found, set the input values directly
                if (type === 'gutter') {
                    const [width, length] = value.split(' x ');
                    elements.gutterWidth.value = width;
                    elements.gutterLength.value = length;
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
        return calcSequence(layout);
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

        const scorePositions = calculateScorePositions(layout, { foldType, scoredWithMargins });

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