import { createToggleSwitch } from './toggles.js';
import { byId } from '../dom/dom.js';

const menuBar = byId('menuBar');

menuBar.appendChild(
    createToggleSwitch({
        id: 'themeToggle',
        label: 'Toggle dark mode',
        icon: '🌙'
    })
);

menuBar.appendChild(
    createToggleSwitch({
        id: 'metricToggle',
        label: 'Toggle metric mode',
        icon: '📏'
    })
);
