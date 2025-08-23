import { elements } from './src/ui/elements.js';
import { registerEventListeners } from './src/ui/events.js';
import { setDefaultValues, selectDefaultSizes, calculateLayout } from './src/layout/layoutController.js';
import { createSizeButtons } from './src/ui/buttonCreation.js';
import { INCH_SIZE_OPTIONS } from './src/config/sizeOptions.js';

function init() {
    createSizeButtons({
        sheetButtons: elements.sheetButtons,
        docButtons: elements.docButtons,
        gutterButtons: elements.gutterButtons,
        marginButtons: elements.marginButtons
    }, INCH_SIZE_OPTIONS);
    setDefaultValues(elements);
    selectDefaultSizes(elements);
    registerEventListeners(elements);
    calculateLayout(elements);
}

init();
