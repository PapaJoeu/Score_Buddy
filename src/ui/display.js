export function renderProgramSequence(sequence, container, unit = 'inches') {
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
                    <td>${cut.toFixed(3)} ${unit}</td>
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

export function renderScorePositions(scorePositions, container, unit = 'inches') {
    // Render score measurements into the nested #scorePositions div
    container.innerHTML = `
        <div class="score-header">
            <h3>Score Measurements</h3>
            <button type="button" class="copy-btn" aria-label="Copy Score Measurements">Copy</button>
        </div>
        <table>
            <thead>
                <tr><th>Score Position (${unit})</th></tr>
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
