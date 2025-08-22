export function renderProgramSequence(sequence, container) {
    container.innerHTML = `
        <div class="card-header">
            <h2>Program Sequence</h2>
            <button type="button" class="copy-btn" aria-label="Copy Program Sequence">Copy</button>
        </div>
        <table>
            <thead>
                <tr><th>Step</th><th>Cut Measurement</th></tr>
            </thead>
            <tbody>
            ${sequence.map((cut, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${cut.toFixed(3)} inches</td>
                </tr>
            `).join('')}
            </tbody>
        </table>
    `;
    const copyBtn = container.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        const text = container.querySelector('table').innerText;
        navigator.clipboard.writeText(text);
    });
}

export function renderLayoutDetails(layout, container) {
    const nUp = layout.docsAcross * layout.docsDown;
    const areaUsed = (layout.docWidth * layout.docLength * nUp) /
        (layout.sheetWidth * layout.sheetLength);
    container.innerHTML = `
        <div class="card-header">
            <h2>Misc Data</h2>
            <button type="button" class="copy-btn" aria-label="Copy Misc Data">Copy</button>
        </div>
        <table>
            <tbody>
            <tr><th>Sheet Size</th><td>${layout.sheetWidth} x ${layout.sheetLength} in</td></tr>
            <tr><th>Document Size</th><td>${layout.docWidth} x ${layout.docLength} in</td></tr>
            <tr><th>Imposed Space Size</th><td>${layout.imposedSpaceWidth.toFixed(2)} x ${layout.imposedSpaceLength.toFixed(2)} in</td></tr>
            <tr><th>N-Up</th><td>${nUp} (${layout.docsAcross}x${layout.docsDown})</td></tr>
            <tr><th>Top Margin</th><td>${layout.topMargin.toFixed(2)} in</td></tr>
            <tr><th>Left Margin</th><td>${layout.leftMargin.toFixed(2)} in</td></tr>
            <tr><th>Coverage Percentage / Wasted Percentage</th><td>${(areaUsed * 100).toFixed(2)}% : ${(100 - areaUsed * 100).toFixed(2)}%</td></tr>
            <tr><th>Doc Plus Gutter Size</th><td>${(layout.docWidth + layout.gutterWidth).toFixed(2)} x ${(layout.docLength + layout.gutterLength).toFixed(2)} in</td></tr>
            </tbody>
        </table>
    `;
    const copyBtn = container.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        const text = container.querySelector('table').innerText;
        navigator.clipboard.writeText(text);
    });
}

export function renderScorePositions(scorePositions, container) {
    container.innerHTML = `
        <div class="card-header">
            <h2>Score Measurements</h2>
            <button type="button" class="copy-btn" aria-label="Copy Score Measurements">Copy</button>
        </div>
        <table>
            <thead>
                <tr><th>Score Position (inches)</th></tr>
            </thead>
            <tbody>
            ${scorePositions.map(pos => `<tr><td>${pos.y.toFixed(3)}</td></tr>`).join('')}
            </tbody>
        </table>
    `;
    const copyBtn = container.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        const text = container.querySelector('table').innerText;
        navigator.clipboard.writeText(text);
    });
}
