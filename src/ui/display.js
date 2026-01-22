import { qs, qsa } from '../dom/dom.js';
import { updateCutsTab, updateScoresTab } from './outputPanel.js';

/**
 * Separates program sequence into X and Y direction cuts
 */
function separateCutsByDirection(sequence) {
    const xCuts = [];
    const yCuts = [];

    // Assuming alternating pattern or we need to track direction
    // For now, split evenly - this should be updated based on actual cut direction logic
    sequence.forEach((cut, index) => {
        if (index % 2 === 0) {
            xCuts.push(cut);
        } else {
            yCuts.push(cut);
        }
    });

    return { xCuts, yCuts };
}

/**
 * Gets unique cut positions from array
 */
function getUniqueCuts(cuts) {
    return [...new Set(cuts)].sort((a, b) => a - b);
}

/**
 * Renders a dense table for cuts
 */
function renderCutTable(title, cuts, unit, copyId) {
    return `
        <div class="summary-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0;">${title}</h3>
                <button type="button" class="btn btn-secondary copy-btn" data-copy-id="${copyId}" style="padding: 4px 12px; height: 32px; font-size: 13px;">
                    Copy
                </button>
            </div>
            <table class="dense-table">
                <thead>
                    <tr>
                        <th style="width: 50px;">#</th>
                        <th>Position (${unit})</th>
                    </tr>
                </thead>
                <tbody>
                ${cuts.map((cut, index) => `
                    <tr>
                        <td style="text-align: center;">${index + 1}</td>
                        <td style="text-align: right;">${cut.toFixed(3)}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

export function renderProgramSequence(sequence, container, unit = 'inches') {
    // Separate into X and Y cuts
    const { xCuts, yCuts } = separateCutsByDirection(sequence);
    const uniqueX = getUniqueCuts(xCuts);
    const uniqueY = getUniqueCuts(yCuts);

    const html = `
        <div style="padding-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Program Sequence</h3>
                <button type="button" class="btn btn-secondary copy-btn" data-copy-id="all" style="padding: 4px 12px; height: 32px; font-size: 13px;">
                    Copy All
                </button>
            </div>
            ${renderCutTable('X-Direction Cuts', uniqueX, unit, 'x')}
            ${renderCutTable('Y-Direction Cuts', uniqueY, unit, 'y')}
        </div>
    `;

    // Update the cuts tab
    updateCutsTab(html);

    // Add event listeners for copy buttons
    setTimeout(() => {
        const copyButtons = qsa('[data-copy-id]', document);
        copyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const copyId = btn.dataset.copyId;
                let text = '';

                if (copyId === 'all') {
                    text = sequence.map((cut, i) => `${i + 1}\t${cut.toFixed(3)} ${unit}`).join('\n');
                    text = `Step\tCut Measurement\n${text}`;
                } else if (copyId === 'x') {
                    text = uniqueX.map((cut, i) => `${i + 1}\t${cut.toFixed(3)} ${unit}`).join('\n');
                    text = `#\tX Position (${unit})\n${text}`;
                } else if (copyId === 'y') {
                    text = uniqueY.map((cut, i) => `${i + 1}\t${cut.toFixed(3)} ${unit}`).join('\n');
                    text = `#\tY Position (${unit})\n${text}`;
                }

                navigator.clipboard.writeText(text);

                // Visual feedback
                const originalText = btn.textContent;
                btn.textContent = '✓ Copied';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1500);
            });
        });
    }, 0);
}

export function renderScorePositions(scorePositions, container, unit = 'inches') {
    const html = `
        <div style="padding-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Score Positions</h3>
                <button type="button" class="btn btn-secondary copy-btn" data-copy-scores="true" style="padding: 4px 12px; height: 32px; font-size: 13px;">
                    Copy
                </button>
            </div>
            <table class="dense-table">
                <thead>
                    <tr>
                        <th style="width: 50px;">#</th>
                        <th>Y Position (${unit})</th>
                    </tr>
                </thead>
                <tbody>
                ${scorePositions.map((pos, index) => `
                    <tr>
                        <td style="text-align: center;">${index + 1}</td>
                        <td style="text-align: right;">${pos.y.toFixed(3)}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Update the scores tab
    updateScoresTab(html);

    // Add event listener for copy button
    setTimeout(() => {
        const copyBtn = qs('[data-copy-scores]', document, { optional: true });
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = scorePositions.map((pos, i) =>
                    `${i + 1}\t${pos.y.toFixed(3)} ${unit}`
                ).join('\n');
                const fullText = `#\tY Position (${unit})\n${text}`;

                navigator.clipboard.writeText(fullText);

                // Visual feedback
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✓ Copied';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            });
        }
    }, 0);
}
