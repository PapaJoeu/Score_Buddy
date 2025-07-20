export function renderProgramSequence(sequence, container) {
    const html = `
        <h2>Program Sequence</h2>
        <table>
            <tr><th>Step</th><th>Cut Measurement</th></tr>
            ${sequence.map((cut, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${cut.toFixed(3)} inches</td>
                </tr>
            `).join('')}
        </table>
    `;
    container.innerHTML = html;
}

export function renderLayoutDetails(layout, container) {
    const nUp = layout.docsAcross * layout.docsDown;
    const areaUsed = (layout.docWidth * layout.docLength * nUp) /
        (layout.sheetWidth * layout.sheetLength);
    const html = `
        <h2>Layout Details</h2>
        <table>
            <tr><th>Sheet Size</th><td>${layout.sheetWidth} x ${layout.sheetLength} in</td></tr>
            <tr><th>Document Size</th><td>${layout.docWidth} x ${layout.docLength} in</td></tr>
            <tr><th>Imposed Space Size</th><td>${layout.imposedSpaceWidth.toFixed(2)} x ${layout.imposedSpaceLength.toFixed(2)} in</td></tr>
            <tr><th>N-Up</th><td>${nUp} (${layout.docsAcross}x${layout.docsDown})</td></tr>
            <tr><th>Top Margin</th><td>${layout.topMargin.toFixed(2)} in</td></tr>
            <tr><th>Left Margin</th><td>${layout.leftMargin.toFixed(2)} in</td></tr>
            <tr><th>Coverage Percentage / Wasted Percentage</th><td>${(areaUsed * 100).toFixed(2)}% : ${(100 - areaUsed * 100).toFixed(2)}%</td></tr>
            <tr><th>Doc Plus Gutter Size</th><td>${(layout.docWidth + layout.gutterWidth).toFixed(2)} x ${(layout.docLength + layout.gutterLength).toFixed(2)} in</td></tr>
        </table>
    `;
    container.innerHTML = html;
}

export function renderScorePositions(scorePositions, container) {
    const html = `
        <h2>Score Positions</h2>
        <table>
            <tr><th>Score Position (inches)</th></tr>
            ${scorePositions.map(pos => `<tr><td>${pos.y.toFixed(3)}</td></tr>`).join('')}
        </table>
    `;
    container.innerHTML = html;
}
