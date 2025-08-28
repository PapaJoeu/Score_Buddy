import { defineElements } from '../dom/dom.js';

// Centralized, lazy, cached element access
export const elements = defineElements({
    // Sheet elements
    sheetButtons: '#sheetButtonsContainer',
    sheetInputs: '#sheetDimensionsInputs',
    sheetWidth: '#sheetWidth',
    sheetLength: '#sheetLength',

    // Document elements
    docButtons: '#docButtonsContainer',
    docInputs: '#docDimensionsInputs',
    docWidth: '#docWidth',
    docLength: '#docLength',

    // Gutter elements
    gutterButtons: '#gutterButtonsContainer',
    gutterInputs: '#gutterDimensionsInputs',
    gutterWidth: '#gutterWidth',
    gutterLength: '#gutterLength',

    // Margin elements
    marginButtons: '#marginButtonsContainer',
    marginInputs: '#marginDimensionsInputs',
    marginWidth: '#marginWidth',
    marginLength: '#marginLength',

    // Canvas element
    canvas: '#layoutCanvas',

    // Other buttons and inputs
    fitSheetButton: '#fitSheetButton',
    zoomOutButton: '#zoomOutButton',
    zoomInButton: '#zoomInButton',
    resetViewButton: '#resetViewButton',
    optimalLayoutButton: '#optimalLayoutButton',
    rotateDocsButton: '#rotateDocsButton',
    rotateSheetButton: '#rotateSheetButton',
    programSequence: '#programSequence',
    scorePositions: '#scorePositions',
    layoutTitle: '#layoutTitle',
    wasteLegend: '#wasteLegend',
    showScores: '#showScores',
    showDocNumbers: '#showDocNumbers',
    showPrintableArea: '#showPrintableArea',
    showMargins: '#showMargins',
    scoreControls: '#scoreControls',
    foldType: '#foldType',
    customScoreInputs: '#customScoreInputs',
    customScores: '#customScores',
    calculateScoresButton: '#calculateScoresButton',
    themeToggle: '#themeToggle',
    metricToggle: '#metricToggle'
});
