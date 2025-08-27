import { createToggleSwitch } from './toggles.js';

const menuBar = document.getElementById('menuBar');

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
