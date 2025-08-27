// legendOptions.js

export const LEGEND_ITEMS = [
    { type: 'swatch', className: 'doc', label: 'Document outline' },
    { type: 'swatch', className: 'margin', label: 'Margins' },
    { type: 'swatch', className: 'printable', label: 'Non-Printable Area' },
    { type: 'line', className: 'score', label: 'Score Line (dashed)' },
    { type: 'placeholder', id: 'wasteLegend' }
];

export const OPTION_CHECKBOXES = [
    { id: 'showScores', label: 'Display scores', checked: false },
    { id: 'showDocNumbers', label: 'Show document numbers', checked: true },
    { id: 'showPrintableArea', label: 'Show printable area', checked: true },
    { id: 'showMargins', label: 'Show margins', checked: true }
];
