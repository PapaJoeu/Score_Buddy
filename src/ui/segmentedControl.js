/**
 * Segmented Control Component
 * Creates a preset selector UI component
 */

/**
 * Creates a segmented control for size presets
 * @param {Object} config - Configuration object
 * @param {string} config.name - Name attribute for radio group
 * @param {Array} config.options - Array of {value, label, checked} objects
 * @param {Function} config.onChange - Callback when selection changes
 * @returns {HTMLElement} - Segmented control element
 */
export function createSegmentedControl(config) {
    const { name, options, onChange } = config;

    const container = document.createElement('div');
    container.className = 'segmented-control';
    container.setAttribute('role', 'radiogroup');

    options.forEach((option, index) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = option.value;
        input.id = `${name}-${option.value}`;
        input.checked = option.checked || false;

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = option.label;

        if (onChange) {
            input.addEventListener('change', (e) => {
                onChange(e.target.value, option);
            });
        }

        container.appendChild(input);
        container.appendChild(label);
    });

    return container;
}

/**
 * Gets the selected value from a segmented control
 * @param {HTMLElement} control - Segmented control element
 * @returns {string} - Selected value
 */
export function getSegmentedControlValue(control) {
    const checked = control.querySelector('input[type="radio"]:checked');
    return checked ? checked.value : null;
}

/**
 * Sets the selected value in a segmented control
 * @param {HTMLElement} control - Segmented control element
 * @param {string} value - Value to select
 */
export function setSegmentedControlValue(control, value) {
    const input = control.querySelector(`input[value="${value}"]`);
    if (input) {
        input.checked = true;
    }
}
