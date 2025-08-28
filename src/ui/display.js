import { qs, qsa } from '../dom/dom.js';

export function renderProgramSequence(sequence, container, unit = 'inches') {
    container.innerHTML = `
        <div class="card-header">
            <h2>Program Sequence</h2>
            <button type="button" class="btn btn-secondary copy-btn" aria-label="Copy Program Sequence">Copy</button>
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
    const copyBtn = qs('.copy-btn', container, { optional: true });
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const text = qs('table', container).innerText;
            navigator.clipboard.writeText(text);
        });
    }
}

export function renderScorePositions(scorePositions, container, unit = 'inches') {
    // Render score measurements into the nested #scorePositions div
    container.innerHTML = `
        <div class="score-header">
            <h3>Score Positions</h3>
            <button type="button" class="btn btn-secondary copy-btn" aria-label="Copy Score Positions">Copy</button>
        </div>
        <table>
            <thead>
                <tr><th>Step</th><th>Score Position (${unit})</th></tr>
            </thead>
            <tbody>
            ${scorePositions.map((pos, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${pos.y.toFixed(3)} ${unit}</td>
                </tr>
            `).join('')}
            </tbody>
        </table>
    `;
    const copyBtn = qs('.copy-btn', container, { optional: true });
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const rows = qsa('tbody tr', container)
                .map(row => Array.from(row.children).map(cell => cell.innerText).join('\t'));
            const header = ['Step', `Score Position (${unit})`].join('\t');
            const text = [header, ...rows].join('\n');
            navigator.clipboard.writeText(text);
        });
    }
}
