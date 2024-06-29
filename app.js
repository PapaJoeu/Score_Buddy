document.addEventListener('DOMContentLoaded', () => {
    // Size options
    const sizeOptions = {
        sheet: [
            { width: 12, length: 18 },
            { width: 13, length: 19 },
            { width: 9, length: 12 },
            { width: 8.5, length: 11 },
            { width: 26, length: 40 }
        ],
        doc: [
            { width: 3.5, length: 2, name: "Business Card" },
            { width: 4, length: 6, name: "Chipotle Opening Card" },
            { width: 4.25, length: 11, name: "Door Hanger" },
            { width: 5, length: 7, name: "Invite" },
            { width: 5.5, length: 8.5, name: "Half Letter" },
            { width: 6, length: 9, name: "Sunrun Postcard" },
            { width: 8.5, length: 11, name: "Letter" },
            { width: 9, length: 12, name: "Rich People Letterhead" }
        ],
        gutter: [
            { gutter: 0.125 },
            { gutter: 0.25 }
        ]
    };

    // Create buttons
    createButtons('sheet', sizeOptions.sheet, 'sheetButtonsContainer', 'sheet-size-button', 'customSheetSizeButton', 'Custom');
    createButtons('doc', sizeOptions.doc, 'docButtonsContainer', 'doc-size-button', 'customDocSizeButton', 'Custom');
    createButtons('gutter', sizeOptions.gutter, 'gutterButtonsContainer', 'gutter-size-button', 'customGutterSizeButton', 'Custom');

    // Cache DOM elements
    const buttons = {
        sheet: document.querySelectorAll('.sheet-size-button'),
        doc: document.querySelectorAll('.doc-size-button'),
        gutter: document.querySelectorAll('.gutter-size-button'),
    };
    const customButtons = {
        sheet: document.getElementById('customSheetSizeButton'),
        doc: document.getElementById('customDocSizeButton'),
        gutter: document.getElementById('customGutterSizeButton'),
    };
    const inputs = {
        sheet: {
            width: document.getElementById('sheetWidth'),
            length: document.getElementById('sheetLength')
        },
        doc: {
            width: document.getElementById('docWidth'),
            length: document.getElementById('docLength')
        },
        gutter: {
            width: document.getElementById('gutterWidth'),
            length: document.getElementById('gutterLength')
        }
    };

    // Initialize event listeners
    setupButtonEventListeners();
    setupCustomSizeEventListeners();
    setupRotateButtonEventListeners();

    function createButtons(type, options, containerId, buttonClass, customButtonId, customButtonText) {
        const container = document.getElementById(containerId);
        options.forEach(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = buttonClass;
            if (type === 'sheet' || type === 'doc') {
                button.setAttribute('data-width', option.width);
                button.setAttribute('data-length', option.length);
                button.textContent = `${option.width} x ${option.length}`;
                if (type === 'doc') {
                    button.setAttribute('data-name', option.name);
                }
            } else if (type === 'gutter') {
                button.setAttribute('data-gutter', option.gutter);
                button.textContent = option.gutter;
            }
            container.appendChild(button);
        });
        // Add custom button
        const customButton = document.createElement('button');
        customButton.type = 'button';
        customButton.id = customButtonId;
        customButton.className = buttonClass;
        customButton.textContent = customButtonText;
        container.appendChild(customButton);
    }

    function setupButtonEventListeners() {
        const calculateButton = document.getElementById('calculateButton');
        const scoreButton = document.getElementById('scoreButton');
        const calculateScoresButton = document.getElementById('calculateScoresButton');

        calculateButton.addEventListener('click', calculateLayout);
        scoreButton.addEventListener('click', showScoreOptions);
        calculateScoresButton.addEventListener('click', calculateScores);

        Object.keys(buttons).forEach(type => {
            addEventListenerToButtons(buttons[type], handleButtonClick(type));
        });

        // Preselect default buttons (12x18 sheet, 3.5x2 doc, 0.125 gutter)
        preselectDefaultButtons();
        calculateButton.click();
    }

    function addEventListenerToButtons(buttons, eventHandler) {
        buttons.forEach(button => {
            button.addEventListener('click', eventHandler);
        });
    }

    function setupCustomSizeEventListeners() {
        Object.keys(customButtons).forEach(type => {
            customButtons[type].addEventListener('click', () => {
                resetInputValues(inputs[type].width, inputs[type].length);
                toggleActiveClass(buttons[type], customButtons[type]);
            });
        });
    }

    function setupRotateButtonEventListeners() {
        const rotateButtons = {
            doc: document.getElementById('rotateDocsButton'),
            sheet: document.getElementById('rotateSheetButton'),
            both: document.getElementById('rotateDocsAndSheetButton')
        };

        rotateButtons.doc.addEventListener('click', () => handleRotateButtonClick(inputs.doc));
        rotateButtons.sheet.addEventListener('click', () => handleRotateButtonClick(inputs.sheet));
    }

    function handleRotateButtonClick(inputGroup) {
        rotateInputValues(inputGroup.width, inputGroup.length);
        calculateLayout();
    }

    function handleButtonClick(type) {
        return event => {
            const button = event.currentTarget;
            const width = button.getAttribute('data-width');
            const length = button.getAttribute('data-length');
            const isCustom = button.id === customButtons[type].id;

            if (isCustom) {
                toggleCustomSizeInput(`${type}WidthGroup`, `${type}LengthGroup`, true);
            } else {
                setSizeInputValues(inputs[type].width, inputs[type].length, width, length);
                toggleCustomSizeInput(`${type}WidthGroup`, `${type}LengthGroup`, false);
            }

            toggleActiveClass(buttons[type], button);
            calculateLayout();
        };
    }

    function preselectDefaultButtons() {
        const defaultButtons = {
            sheet: document.querySelector('.sheet-size-button[data-width="12"][data-length="18"]'),
            doc: document.querySelector('.doc-size-button[data-width="3.5"][data-length="2"]'),
            gutter: document.querySelector('.gutter-size-button[data-gutter="0.125"]')
        };

        defaultButtons.sheet.classList.add('active');
        defaultButtons.doc.classList.add('active');
        defaultButtons.gutter.classList.add('active');
    }

    function resetInputValues(input1, input2) {
        input1.value = '';
        input2.value = '';
    }

    function toggleCustomSizeInput(widthGroupId, lengthGroupId, isVisible) {
        const displayStyle = isVisible ? 'block' : 'none';
        document.getElementById(widthGroupId).style.display = displayStyle;
        document.getElementById(lengthGroupId).style.display = displayStyle;
    }

    function setSizeInputValues(widthInput, lengthInput, width, length) {
        widthInput.value = width;
        lengthInput.value = length;
    }

    function rotateInputValues(input1, input2) {
        const temp = input1.value;
        input1.value = input2.value;
        input2.value = temp;
    }

    function calculateLayout() {
        const sheetWidth = parseFloat(inputs.sheet.width.value);
        const sheetLength = parseFloat(inputs.sheet.length.value);
        const docWidth = parseFloat(inputs.doc.width.value);
        const docLength = parseFloat(inputs.doc.length.value);
        const gutterWidth = parseFloat(inputs.gutter.width.value);
        const gutterLength = parseFloat(inputs.gutter.length.value);

        const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
        const docsDown = Math.floor(sheetLength / (docLength + gutterLength));
        const totalGutterWidth = (docsAcross - 1) * gutterWidth;
        const totalGutterLength = (docsDown - 1) * gutterLength;
        const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
        const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;

        if (imposedSpaceWidth > sheetWidth || imposedSpaceLength > sheetLength) {
            alert("The current layout is not possible with the given sheet dimensions.");
            return;
        }

        const topMargin = (sheetLength - imposedSpaceLength) / 2;
        const bottomMargin = topMargin;
        const leftMargin = (sheetWidth - imposedSpaceWidth) / 2;
        const rightMargin = leftMargin;

        const layoutDetailsHTML = generateLayoutDetailsHTML(sheetWidth, sheetLength, docWidth, docLength, docsAcross, docsDown, topMargin, bottomMargin, leftMargin, rightMargin);
        document.getElementById('layoutDetails').innerHTML = layoutDetailsHTML;

        const layout = {
            sheetLength,
            sheetWidth,
            bottomMargin,
            rightMargin,
            imposedSpaceLength,
            imposedSpaceWidth,
            docWidth,
            docLength,
            gutterWidth,
            gutterLength,
            docsAcross,
            docsDown
        };

        const programSequenceHTML = generateProgramSequenceHTML(layout);
        document.getElementById('programSequence').innerHTML = programSequenceHTML;

        drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin);
    }

    function generateLayoutDetailsHTML(sheetWidth, sheetLength, docWidth, docLength, docsAcross, docsDown, topMargin, bottomMargin, leftMargin, rightMargin) {
        const sheetWidthDisplay = sheetWidth % 1 === 0 ? sheetWidth.toFixed(0) : sheetWidth.toFixed(2);
        const sheetLengthDisplay = sheetLength % 1 === 0 ? sheetLength.toFixed(0) : sheetLength.toFixed(2);
        const docWidthDisplay = docWidth % 1 === 0 ? docWidth.toFixed(0) : docWidth.toFixed(3);
        const docLengthDisplay = docLength % 1 === 0 ? docLength.toFixed(0) : docLength.toFixed(3);
        const nUp = docsAcross * docsDown;
        const areaUsed = (docWidth * docLength * nUp) / (sheetWidth * sheetLength);

        return `
            <h2>Layout Details</h2>
            <table class="details-table">
            <tr><th>Sheet Size</th><td>${sheetWidthDisplay}x${sheetLengthDisplay} in</td></tr>
            <tr><th>Document Size</th><td>${docWidthDisplay} in x ${docLengthDisplay} in</td></tr>
            <tr><th>N-Up</th><td>${nUp} (${docsAcross}x${docsDown})</td></tr>
            <tr><th>Top Margin</th><td>${topMargin.toFixed(3)} in</td></tr>
            <tr><th>Bottom Margin</th><td>${bottomMargin.toFixed(3)} in</td></tr>
            <tr><th>Left Margin</th><td>${leftMargin.toFixed(3)} in</td></tr>
            <tr><th>Right Margin</th><td>${rightMargin.toFixed(3)} in</td></tr>
            <tr><th>Coverage Percentage</th><td>${(areaUsed * 100).toFixed(2)}%</td></tr>
            <tr><th>Wasted Space</th><td>${(100 - (areaUsed * 100)).toFixed(2)}%</td></tr>
            </table>
        `;
    }

    function generateProgramSequenceHTML(layout) {
        let sequence = calculateSequence(layout);

        let sequenceHTML = `
            <h2>Program Sequence</h2>
            <table class="sequence-table">
                <tr>
                    <th>Step</th>
                    <th>Cut Measurement</th>
                </tr>
        `;

        for (let i = 0; i < sequence.length; i++) {
            sequenceHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${sequence[i].toFixed(3)} inches</td>
                </tr>
            `;
        }

        sequenceHTML += '</table>';
        return sequenceHTML;
    }

    function calculateSequence(layout) {
        let sequence = [
            layout.sheetLength - layout.bottomMargin,
            layout.sheetWidth - layout.rightMargin,
            layout.imposedSpaceLength,
            layout.imposedSpaceWidth,
        ];

        for (let i = 1; i < layout.docsAcross; i++) {
            sequence.push(layout.imposedSpaceWidth - i * (layout.docWidth + layout.gutterWidth));
        }

        sequence = sequence.concat(Array(layout.docsAcross - 1).fill(layout.docWidth));

        for (let i = 1; i < layout.docsDown; i++) {
            sequence.push(layout.imposedSpaceLength - i * (layout.docLength + layout.gutterLength));
        }

        sequence = sequence.concat(Array(layout.docsDown - 1).fill(layout.docLength));

        return sequence;
    }

    function showScoreOptions() {
        document.getElementById('scoredOptions').classList.remove('hidden');
    }

    function calculateScores() {
        const scoredWithMargins = document.getElementById('scoredWithMargins').value === 'yes';
        const foldType = document.getElementById('foldType').value;

        const sheetWidth = parseFloat(inputs.sheet.width.value);
        const sheetLength = parseFloat(inputs.sheet.length.value);
        const docWidth = parseFloat(inputs.doc.width.value);
        const docLength = parseFloat(inputs.doc.length.value);
        const gutterWidth = parseFloat(inputs.gutter.width.value);
        const gutterLength = parseFloat(inputs.gutter.length.value);

        const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
        const docsDown = Math.floor(sheetLength / (docLength + gutterLength));
        const totalGutterWidth = (docsAcross - 1) * gutterWidth;
        const totalGutterLength = (docsDown - 1) * gutterLength;
        const imposedSpaceWidth = (docWidth * docsAcross) + totalGutterWidth;
        const imposedSpaceLength = (docLength * docsDown) + totalGutterLength;

        const topMargin = (sheetLength - imposedSpaceLength) / 2;

        let marginOffset = scoredWithMargins ? topMargin : 0;

        let scorePositions = [];
        for (let i = 0; i < docsDown; i++) {
            if (foldType === 'bifold') {
                scorePositions.push({ y: (docLength / 2) + i * (docLength + gutterLength) + marginOffset });
            } else if (foldType === 'trifold') {
                scorePositions.push({ y: (docLength / 3) + i * (docLength + gutterLength) + marginOffset });
                scorePositions.push({ y: (2 * docLength / 3) - 0.05 + i * (docLength + gutterLength) + marginOffset });
            }
        }

        drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, (sheetWidth - imposedSpaceWidth) / 2, scorePositions);
        generateScoresHTML(docsDown, docLength, gutterLength, marginOffset, foldType);
    }

    function generateScoresHTML(docsDown, docLength, gutterLength, marginOffset, foldType) {
        let scoresHTML = `
            <h2>Score Positions</h2>
            <table class="score-table">
                <thead>
                    <tr>
                        <th>Score Position (inches)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < docsDown; i++) {
            if (foldType === 'bifold') {
                scoresHTML += `<tr><td>${((docLength / 2) + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
            } else if (foldType === 'trifold') {
                scoresHTML += `<tr><td>${((docLength / 3) + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
                scoresHTML += `<tr><td>${((2 * docLength / 3) - 0.05 + i * (docLength + gutterLength) + marginOffset).toFixed(3)}</td></tr>`;
            }
        }

        scoresHTML += '</tbody></table>';
        document.getElementById('scorePositions').innerHTML = scoresHTML;
    }

    function drawLayout(sheetWidth, sheetLength, docsAcross, docsDown, docWidth, docLength, gutterWidth, gutterLength, topMargin, leftMargin, scorePositions) {
        const canvas = document.getElementById('layoutCanvas');
        const ctx = canvas.getContext('2d');
        const offsetMargin = document.getElementById('scoredWithMargins').value === 'yes' ? topMargin : 0;

        const canvasWidth = scoredWithMargins ? sheetWidth : imposedSpaceWidth;
        const canvasHeight = scoredWithMargins ? sheetLength : imposedSpaceLength;
        canvas.width = canvasWidth * 100;
        canvas.height = canvasHeight * 100;

        const scaleFactor = Math.min(canvas.width / sheetWidth, canvas.height / sheetLength);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sheetX = (canvas.width - sheetWidth * scaleFactor) / 2;
        const sheetY = (canvas.height - sheetLength * scaleFactor) / 2;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(sheetX, sheetY, sheetWidth * scaleFactor, sheetLength * scaleFactor);

        ctx.strokeStyle = '#007BFF';
        ctx.lineWidth = 1;
        for (let i = 0; i < docsAcross; i++) {
            for (let j = 0; j < docsDown; j++) {
                const x = sheetX + (leftMargin + i * (docWidth + gutterWidth)) * scaleFactor;
                const y = sheetY + (topMargin + j * (docLength + gutterLength)) * scaleFactor;

                ctx.strokeRect(x, y, docWidth * scaleFactor, docLength * scaleFactor);

                ctx.fillText(`${i + 1 + j * docsAcross}`, x + docWidth * scaleFactor / 2 - 5, y + docLength * scaleFactor / 2 + 5);
            }
        }

        if (scorePositions && scorePositions.length > 0) {
            ctx.strokeStyle = 'magenta';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            ctx.beginPath();
            scorePositions.forEach(position => {
                const y = sheetY + (topMargin + position.y) * scaleFactor;
                ctx.moveTo(sheetX, y);
                ctx.lineTo(sheetX + sheetWidth * scaleFactor, y);
            });
            ctx.stroke();

            ctx.setLineDash([]);
        }
    }

    function toggleActiveClass(buttons, activeButton) {
        buttons.forEach(button => {
            if (button === activeButton) {
                button.classList.toggle('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
});
