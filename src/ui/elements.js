import { defineElements } from '../dom/dom.js';

// Centralized, lazy, cached element access
export const elements = defineElements({
    // Input elements (now in accordion sections)
    sheetWidth: '#sheetWidth',
    sheetLength: '#sheetLength',
    docWidth: '#docWidth',
    docLength: '#docLength',
    gutterWidth: '#gutterWidth',
    gutterLength: '#gutterLength',
    marginWidth: '#marginWidth',
    marginLength: '#marginLength',

    // Canvas element
    canvas: '#layoutCanvas',

    // Canvas controls
    fitSheetButton: '#fitSheetButton',
    zoomOutButton: '#zoomOutButton',
    zoomInButton: '#zoomInButton',
    resetViewButton: '#resetViewButton',
    rotateDocsButton: '#rotateDocsButton',
    rotateSheetButton: '#rotateSheetButton',

    // Optimal layout button
    optimalLayoutButton: '#optimalLayoutButton',

    // Visualizer options (checkboxes)
    showScores: '#showScores',
    showDocNumbers: '#showDocNumbers',
    showPrintableArea: '#showPrintableArea',
    showMargins: '#showMargins',

    // Scoring elements
    foldType: '#foldType',
    customScoreInputs: '#customScoreInputs',
    customScores: '#customScores',
    calculateScoresButton: '#calculateScoresButton',

    // Toggles
    themeToggle: '#themeToggle',
    metricToggle: '#metricToggle'
});
