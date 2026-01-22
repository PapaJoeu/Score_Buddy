import { initSetupPanel } from './src/ui/setupPanel.js';
import { initOutputPanel } from './src/ui/outputPanel.js';
import { elements } from './src/ui/elements.js';
import { registerEventListeners, initTheme } from './src/ui/events.js';
import { calculateLayout } from './src/layout/layoutController.js';

function init() {
    // Initialize theme first
    initTheme(elements);

    // Initialize new UI panels
    initSetupPanel();
    initOutputPanel();

    // Register event listeners
    registerEventListeners(elements);

    // Initial calculation
    calculateLayout(elements);
}

init();
