const getElement = id => (typeof document !== 'undefined' ? document.getElementById(id) : null);

export const elements = {
    // Sheet elements
    sheetButtons: getElement('sheetButtonsContainer'),
    sheetInputs: getElement('sheetDimensionsInputs'),
    sheetWidth: getElement('sheetWidth'),
    sheetLength: getElement('sheetLength'),

    // Document elements
    docButtons: getElement('docButtonsContainer'),
    docInputs: getElement('docDimensionsInputs'),
    docWidth: getElement('docWidth'),
    docLength: getElement('docLength'),

    // Gutter elements
    gutterButtons: getElement('gutterButtonsContainer'),
    gutterInputs: getElement('gutterDimensionsInputs'),
    gutterWidth: getElement('gutterWidth'),
    gutterLength: getElement('gutterLength'),

    // Margin elements
    marginButtons: getElement('marginButtonsContainer'),
    marginInputs: getElement('marginDimensionsInputs'),
    marginWidth: getElement('marginWidth'),
    marginLength: getElement('marginLength'),

    // Canvas element
    canvas: getElement('layoutCanvas'),

    // Other buttons and inputs
    fitSheetButton: getElement('fitSheetButton'),
    zoomOutButton: getElement('zoomOutButton'),
    zoomInButton: getElement('zoomInButton'),
    resetViewButton: getElement('resetViewButton'),
    rotateDocsButton: getElement('rotateDocsButton'),
    rotateSheetButton: getElement('rotateSheetButton'),
    programSequence: getElement('programSequence'),
    scorePositions: getElement('scorePositions'),
    layoutTitle: getElement('layoutTitle'),
    wasteLegend: getElement('wasteLegend'),
    showScores: getElement('showScores'),
    showDocNumbers: getElement('showDocNumbers'),
    showPrintableArea: getElement('showPrintableArea'),
    showMargins: getElement('showMargins'),
    scoreControls: getElement('scoreControls'),
    foldType: getElement('foldType'),
    customScoreInputs: getElement('customScoreInputs'),
    customScores: getElement('customScores'),
    calculateScoresButton: getElement('calculateScoresButton'),
    themeToggle: getElement('themeToggle'),
    metricToggle: getElement('metricToggle')
};
