// legendOptions.js

export const LEGEND_ITEMS = [
    { className: 'doc', label: 'Document', type: 'swatch' },
    { className: 'margin', label: 'Margins', type: 'swatch' },
    { className: 'printable', label: 'Non-Printable Area', type: 'swatch' },
    { className: 'score', label: 'Score Line', type: 'line' },
    { id: 'wasteLegend' }
];

export const OPTION_CHECKBOXES = [
    { id: 'showScores', label: 'Display scores', checked: false },
    { id: 'showDocNumbers', label: 'Show document numbers', checked: true },
    { id: 'showPrintableArea', label: 'Show printable area', checked: true },
    { id: 'showMargins', label: 'Show margins', checked: true }
];
