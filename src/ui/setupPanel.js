/**
 * Setup Panel
 * Creates the left panel with accordion sections for inputs
 */

import { createAccordion } from './accordion.js';
import { createSegmentedControl } from './segmentedControl.js';
import { byId } from '../dom/dom.js';
import { INCH_SIZE_OPTIONS, MM_SIZE_OPTIONS } from '../config/sizeOptions.js';

let currentMetric = 'inches';

/**
 * Sets the current metric mode
 * @param {string} metric - 'inches' or 'metric'
 */
export function setMetric(metric) {
    currentMetric = metric;
}

/**
 * Gets current size options based on metric
 */
function getSizeOptions() {
    return currentMetric === 'metric' ? MM_SIZE_OPTIONS : INCH_SIZE_OPTIONS;
}

/**
 * Gets unit suffix based on metric
 */
function getUnitSuffix() {
    return currentMetric === 'metric' ? 'mm' : 'in';
}

/**
 * Creates an input with unit suffix
 */
function createInputWithUnit(config) {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-with-unit';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = config.id;
    input.name = config.id;
    input.step = config.step;
    input.value = config.value;

    const unit = document.createElement('span');
    unit.className = 'input-unit';
    unit.textContent = getUnitSuffix();

    wrapper.appendChild(input);
    wrapper.appendChild(unit);

    return wrapper;
}

/**
 * Creates the Sheet section content
 */
function createSheetSection() {
    const container = document.createElement('div');

    const sizeOptions = getSizeOptions();
    const presets = sizeOptions.sheet.map((size, index) => ({
        value: `sheet-${index}`,
        label: size.name,
        checked: size.default || false,
        data: size
    }));
    presets.push({ value: 'custom', label: 'Custom', checked: false });

    // Segmented control for presets
    const control = createSegmentedControl({
        name: 'sheetPreset',
        options: presets,
        onChange: (value, option) => {
            if (value !== 'custom' && option.data) {
                byId('sheetWidth').value = option.data.width;
                byId('sheetLength').value = option.data.length;
                // Trigger change event
                const event = new Event('input', { bubbles: true });
                byId('sheetWidth').dispatchEvent(event);
            }
            const inputsDiv = byId('sheetInputsDiv');
            inputsDiv.style.display = value === 'custom' ? 'grid' : 'none';
        }
    });

    // Input fields (hidden by default)
    const inputsDiv = document.createElement('div');
    inputsDiv.id = 'sheetInputsDiv';
    inputsDiv.className = 'form-grid';
    inputsDiv.style.display = 'none';
    inputsDiv.style.marginTop = '16px';

    const widthLabel = document.createElement('label');
    widthLabel.textContent = 'Width';
    widthLabel.htmlFor = 'sheetWidth';

    const widthInput = createInputWithUnit({
        id: 'sheetWidth',
        step: 0.25,
        value: 12.0
    });

    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = 'Length';
    lengthLabel.htmlFor = 'sheetLength';

    const lengthInput = createInputWithUnit({
        id: 'sheetLength',
        step: 0.25,
        value: 18.0
    });

    // Rotate button in header
    const rotateBtn = document.createElement('button');
    rotateBtn.type = 'button';
    rotateBtn.id = 'rotateSheetButton';
    rotateBtn.className = 'btn btn-tertiary btn-icon';
    rotateBtn.innerHTML = '<span class="icon">↻</span>';
    rotateBtn.title = 'Rotate sheet';

    inputsDiv.appendChild(widthLabel);
    inputsDiv.appendChild(widthInput);
    inputsDiv.appendChild(lengthLabel);
    inputsDiv.appendChild(lengthInput);

    container.appendChild(control);
    container.appendChild(inputsDiv);

    // Store rotate button to add to header later
    container.rotateButton = rotateBtn;

    return container;
}

/**
 * Creates the Document section content
 */
function createDocumentSection() {
    const container = document.createElement('div');

    const sizeOptions = getSizeOptions();
    const presets = sizeOptions.doc.map((size, index) => ({
        value: `doc-${index}`,
        label: size.name,
        checked: size.default || false,
        data: size
    }));
    presets.push({ value: 'custom', label: 'Custom', checked: false });

    const control = createSegmentedControl({
        name: 'docPreset',
        options: presets,
        onChange: (value, option) => {
            if (value !== 'custom' && option.data) {
                byId('docWidth').value = option.data.width;
                byId('docLength').value = option.data.length;
                const event = new Event('input', { bubbles: true });
                byId('docWidth').dispatchEvent(event);
            }
            const inputsDiv = byId('docInputsDiv');
            inputsDiv.style.display = value === 'custom' ? 'grid' : 'none';
        }
    });

    const inputsDiv = document.createElement('div');
    inputsDiv.id = 'docInputsDiv';
    inputsDiv.className = 'form-grid';
    inputsDiv.style.display = 'none';
    inputsDiv.style.marginTop = '16px';

    const widthLabel = document.createElement('label');
    widthLabel.textContent = 'Width';
    widthLabel.htmlFor = 'docWidth';

    const widthInput = createInputWithUnit({
        id: 'docWidth',
        step: 0.25,
        value: 3.5
    });

    const lengthLabel = document.createElement('label');
    lengthLabel.textContent = 'Length';
    lengthLabel.htmlFor = 'docLength';

    const lengthInput = createInputWithUnit({
        id: 'docLength',
        step: 0.25,
        value: 2
    });

    const rotateBtn = document.createElement('button');
    rotateBtn.type = 'button';
    rotateBtn.id = 'rotateDocsButton';
    rotateBtn.className = 'btn btn-tertiary btn-icon';
    rotateBtn.innerHTML = '<span class="icon">↺</span>';
    rotateBtn.title = 'Rotate documents';

    inputsDiv.appendChild(widthLabel);
    inputsDiv.appendChild(widthInput);
    inputsDiv.appendChild(lengthLabel);
    inputsDiv.appendChild(lengthInput);

    container.appendChild(control);
    container.appendChild(inputsDiv);
    container.rotateButton = rotateBtn;

    return container;
}

/**
 * Creates the Spacing section content (combines Gutter + Margins)
 */
function createSpacingSection() {
    const container = document.createElement('div');
    container.className = 'form-grid';

    // Gutter Width
    const gutterWidthLabel = document.createElement('label');
    gutterWidthLabel.textContent = 'Gutter Width';
    gutterWidthLabel.htmlFor = 'gutterWidth';

    const gutterWidthInput = createInputWithUnit({
        id: 'gutterWidth',
        step: 0.125,
        value: 0.125
    });

    // Gutter Length
    const gutterLengthLabel = document.createElement('label');
    gutterLengthLabel.textContent = 'Gutter Length';
    gutterLengthLabel.htmlFor = 'gutterLength';

    const gutterLengthInput = createInputWithUnit({
        id: 'gutterLength',
        step: 0.125,
        value: 0.125
    });

    // Margin Width
    const marginWidthLabel = document.createElement('label');
    marginWidthLabel.textContent = 'Margin Width';
    marginWidthLabel.htmlFor = 'marginWidth';

    const marginWidthInput = createInputWithUnit({
        id: 'marginWidth',
        step: 0.125,
        value: 0.125
    });

    // Margin Length
    const marginLengthLabel = document.createElement('label');
    marginLengthLabel.textContent = 'Margin Length';
    marginLengthLabel.htmlFor = 'marginLength';

    const marginLengthInput = createInputWithUnit({
        id: 'marginLength',
        step: 0.125,
        value: 0.125
    });

    container.appendChild(gutterWidthLabel);
    container.appendChild(gutterWidthInput);
    container.appendChild(gutterLengthLabel);
    container.appendChild(gutterLengthInput);
    container.appendChild(marginWidthLabel);
    container.appendChild(marginWidthInput);
    container.appendChild(marginLengthLabel);
    container.appendChild(marginLengthInput);

    return container;
}

/**
 * Creates the Marks & Scores section content
 */
function createMarksScoresSection() {
    const container = document.createElement('div');

    // Layers/Visualization checkboxes (moved from visualizer)
    const layersDiv = document.createElement('div');
    layersDiv.id = 'visualizerOptions';
    layersDiv.style.marginBottom = '16px';

    // Scoring controls
    const scoringDiv = document.createElement('div');
    scoringDiv.className = 'form-grid';

    const scoreTypeLabel = document.createElement('label');
    scoreTypeLabel.textContent = 'Score Type';
    scoreTypeLabel.htmlFor = 'foldType';

    const scoreTypeSelect = document.createElement('select');
    scoreTypeSelect.id = 'foldType';
    scoreTypeSelect.innerHTML = `
        <option value="bifold">Bifold</option>
        <option value="trifold">Trifold</option>
        <option value="gatefold">Gatefold</option>
        <option value="custom">Custom</option>
    `;

    const customDiv = document.createElement('div');
    customDiv.id = 'customScoreInputs';
    customDiv.className = 'hidden';
    customDiv.style.gridColumn = '1 / -1';

    const customLabel = document.createElement('label');
    customLabel.textContent = 'Custom Positions';
    customLabel.htmlFor = 'customScores';

    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.id = 'customScores';
    customInput.placeholder = 'e.g., 2,4.5';

    customDiv.appendChild(customLabel);
    customDiv.appendChild(customInput);

    const calculateBtn = document.createElement('button');
    calculateBtn.type = 'button';
    calculateBtn.id = 'calculateScoresButton';
    calculateBtn.className = 'btn';
    calculateBtn.style.gridColumn = '1 / -1';
    calculateBtn.style.marginTop = '8px';
    calculateBtn.textContent = 'Calculate Scores';

    scoringDiv.appendChild(scoreTypeLabel);
    scoringDiv.appendChild(scoreTypeSelect);
    scoringDiv.appendChild(customDiv);
    scoringDiv.appendChild(calculateBtn);

    container.appendChild(layersDiv);
    container.appendChild(scoringDiv);

    return container;
}

/**
 * Creates the Advanced section content
 */
function createAdvancedSection() {
    const container = document.createElement('div');
    container.innerHTML = '<p style="font-size: 14px; opacity: 0.7; margin: 0;">Advanced options coming soon...</p>';
    return container;
}

/**
 * Initializes the setup panel with accordion sections
 */
export function initSetupPanel() {
    const form = byId('dimensionsForm');
    if (!form) return;

    // Clear existing content
    form.innerHTML = '';

    const sheetContent = createSheetSection();
    const docContent = createDocumentSection();

    // Create accordion sections
    const sections = [
        {
            id: 'sheet-section',
            title: 'Sheet',
            content: sheetContent,
            expanded: true
        },
        {
            id: 'document-section',
            title: 'Document',
            content: docContent,
            expanded: true
        },
        {
            id: 'spacing-section',
            title: 'Spacing',
            content: createSpacingSection(),
            expanded: true
        },
        {
            id: 'marks-scores-section',
            title: 'Marks & Scores',
            content: createMarksScoresSection(),
            expanded: false
        },
        {
            id: 'advanced-section',
            title: 'Advanced',
            content: createAdvancedSection(),
            expanded: false
        }
    ];

    const accordion = createAccordion(sections);
    form.appendChild(accordion);

    // Add rotate buttons to headers
    const sheetHeader = accordion.querySelector('[data-section-id="sheet-section"] .accordion-header');
    if (sheetHeader && sheetContent.rotateButton) {
        sheetHeader.insertBefore(sheetContent.rotateButton, sheetHeader.querySelector('.accordion-icon'));
    }

    const docHeader = accordion.querySelector('[data-section-id="document-section"] .accordion-header');
    if (docHeader && docContent.rotateButton) {
        docHeader.insertBefore(docContent.rotateButton, docHeader.querySelector('.accordion-icon'));
    }
}
