import { initSetupPanel } from './src/ui/setupPanel.js';
import { initOutputPanel } from './src/ui/outputPanel.js';
import { renderLegendOptions } from './src/ui/renderLegendOptions.js';
import { elements } from './src/ui/elements.js';
import { registerEventListeners, initTheme } from './src/ui/events.js';
import { calculateLayout } from './src/layout/layoutController.js';

function init() {
    // Initialize theme first
    initTheme(elements);

    // Initialize new UI panels (creates containers like #visualizerOptions)
    initSetupPanel();
    initOutputPanel();

    // Render legend and visualizer option checkboxes
    // (must run after initSetupPanel creates #visualizerOptions)
    renderLegendOptions();

    // Refresh elements cache so dynamically created elements can be found
    elements.refresh();

    // Register event listeners
    registerEventListeners(elements);

    // Initial calculation
    calculateLayout(elements);
}

init();
