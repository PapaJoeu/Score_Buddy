export function createSection({
    title,
    buttonContainerId,
    buttonAriaLabel,
    inputGroupId,
    inputs,
    rotate
}) {
    const section = document.createElement('section');
    section.className = 'dimensions-section card';

    const header = document.createElement('div');
    header.className = 'card-header';
    const h2 = document.createElement('h2');
    h2.textContent = title;
    header.appendChild(h2);

    if (rotate) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = rotate.id;
        btn.className = 'btn btn-tertiary';
        btn.setAttribute('aria-label', rotate.ariaLabel);
        btn.setAttribute('aria-describedby', rotate.tooltipId);

        const icon = document.createElement('span');
        icon.className = 'icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = rotate.icon;
        btn.appendChild(icon);

        const tip = document.createElement('span');
        tip.role = 'tooltip';
        tip.id = rotate.tooltipId;
        tip.className = 'tooltip';
        tip.textContent = rotate.tooltip;
        btn.appendChild(tip);

        header.appendChild(btn);
    }

    section.appendChild(header);

    const buttonGrid = document.createElement('div');
    buttonGrid.className = 'button-grid';
    buttonGrid.id = buttonContainerId;
    buttonGrid.setAttribute('role', 'toolbar');
    buttonGrid.setAttribute('aria-label', buttonAriaLabel);
    section.appendChild(buttonGrid);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group hidden form-grid';
    inputGroup.id = inputGroupId;

    inputs.forEach(({ label, id, step, value }) => {
        const lbl = document.createElement('label');
        lbl.setAttribute('for', id);
        lbl.textContent = label;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = id;
        input.name = id;
        if (step !== undefined) input.step = step;
        if (value !== undefined) input.value = value;
        inputGroup.appendChild(lbl);
        inputGroup.appendChild(input);
    });

    section.appendChild(inputGroup);

    return section;
}

const SECTION_CONFIGS = [
    {
        title: 'Sheet Dimensions',
        buttonContainerId: 'sheetButtonsContainer',
        buttonAriaLabel: 'Sheet size presets',
        inputGroupId: 'sheetDimensionsInputs',
        inputs: [
            { label: 'Width (in)', id: 'sheetWidth', step: 0.25, value: 12.0 },
            { label: 'Length (in)', id: 'sheetLength', step: 0.25, value: 18.0 }
        ],
        rotate: {
            id: 'rotateSheetButton',
            icon: '↻',
            tooltip: 'Rotate sheet',
            tooltipId: 'tip-rotate-sheet',
            ariaLabel: 'Rotate sheet'
        }
    },
    {
        title: 'Document Dimensions',
        buttonContainerId: 'docButtonsContainer',
        buttonAriaLabel: 'Document size presets',
        inputGroupId: 'docDimensionsInputs',
        inputs: [
            { label: 'Width (in)', id: 'docWidth', step: 0.25, value: 3.5 },
            { label: 'Length (in)', id: 'docLength', step: 0.25, value: 4 }
        ],
        rotate: {
            id: 'rotateDocsButton',
            icon: '↺',
            tooltip: 'Rotate documents',
            tooltipId: 'tip-rotate-docs',
            ariaLabel: 'Rotate documents'
        }
    },
    {
        title: 'Gutter Sizes',
        buttonContainerId: 'gutterButtonsContainer',
        buttonAriaLabel: 'Gutter presets',
        inputGroupId: 'gutterDimensionsInputs',
        inputs: [
            { label: 'Gutter Width (in)', id: 'gutterWidth', step: 0.125, value: 0.125 },
            { label: 'Gutter Length (in)', id: 'gutterLength', step: 0.125, value: 0.125 }
        ]
    },
    {
        title: 'Sheet Margins',
        buttonContainerId: 'marginButtonsContainer',
        buttonAriaLabel: 'Margin presets',
        inputGroupId: 'marginDimensionsInputs',
        inputs: [
            { label: 'Margin Width (in)', id: 'marginWidth', step: 0.125, value: 0.25 },
            { label: 'Margin Length (in)', id: 'marginLength', step: 0.125, value: 0.25 }
        ]
    }
];

const form = document.getElementById('dimensionsForm');
if (form) {
    SECTION_CONFIGS.forEach(cfg => form.appendChild(createSection(cfg)));
}
