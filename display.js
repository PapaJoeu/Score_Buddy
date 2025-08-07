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
    const areaUsedFull = (layout.docWidth * layout.docLength * nUp) / (layout.sheetWidth * layout.sheetLength);
    const areaUsedUsable = (layout.usableWidth > 0 && layout.usableLength > 0)
        ? (layout.docWidth * layout.docLength * nUp) / (layout.usableWidth * layout.usableLength)
        : 0;
    const html = `
        <h2>Layout Details</h2>
        <table>
            <tr><th>Sheet Size</th><td>${layout.sheetWidth} x ${layout.sheetLength} in</td></tr>
            <tr><th>Usable Sheet Size</th><td>${layout.usableWidth.toFixed(2)} x ${layout.usableLength.toFixed(2)} in</td></tr>
            <tr><th>Document Size</th><td>${layout.docWidth} x ${layout.docLength} in</td></tr>
            <tr><th>Imposed Space Size</th><td>${layout.imposedSpaceWidth.toFixed(2)} x ${layout.imposedSpaceLength.toFixed(2)} in</td></tr>
            <tr><th>N-Up</th><td>${nUp} (${layout.docsAcross}x${layout.docsDown})</td></tr>
            <tr><th>Sheet Margin</th><td>${layout.sheetMargin.toFixed(3)} in</td></tr>
            <tr><th>Top Margin</th><td>${layout.topMargin.toFixed(2)} in</td></tr>
            <tr><th>Left Margin</th><td>${layout.leftMargin.toFixed(2)} in</td></tr>
            <tr><th>Coverage Percentage / Wasted Percentage</th><td>${(areaUsedFull * 100).toFixed(2)}% : ${(100 - areaUsedFull * 100).toFixed(2)}%</td></tr>
            <tr><th>Coverage on Usable Sheet</th><td>${(areaUsedUsable * 100).toFixed(2)}%</td></tr>
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
