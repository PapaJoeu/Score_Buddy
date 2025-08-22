// buttonCreation.js

// Create buttons for a specific type (sheet, doc, or gutter)
export function createButtonsForType(type, container, SIZE_OPTIONS) {
    // Create buttons for each predefined size option
    SIZE_OPTIONS[type].forEach(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn', 'btn-secondary', `${type}-size-button`);
        button.dataset.type = type;
        button.textContent = `${option.width} x ${option.length}`;
        button.dataset.width = option.width;
        button.dataset.length = option.length;
        container.appendChild(button);
    });

    // Add custom button for user-defined sizes
    const customButton = document.createElement('button');
    customButton.type = 'button';
    customButton.id = `custom${type.charAt(0).toUpperCase() + type.slice(1)}SizeButton`;
    customButton.classList.add('btn', 'btn-secondary', `${type}-size-button`);
    customButton.dataset.type = type;
    customButton.textContent = 'Custom';
    container.appendChild(customButton);
}

// Create all size buttons using the provided containers
export function createSizeButtons(containers, SIZE_OPTIONS) {
    createButtonsForType('sheet', containers.sheetButtons, SIZE_OPTIONS);
    createButtonsForType('doc', containers.docButtons, SIZE_OPTIONS);
    createButtonsForType('gutter', containers.gutterButtons, SIZE_OPTIONS);
    createButtonsForType('margin', containers.marginButtons, SIZE_OPTIONS);
}

