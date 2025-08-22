const assert = require('assert');

(async () => {
  const { calculateLayoutDetails } = await import('../calculations.js');
  const { drawDocumentLabels } = await import('../visualizer.js');

  const layout = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    gutterWidth: 0.5,
    gutterLength: 0.25
  });

  const scale = 10;

  const ctx = {
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
    fillTextCalls: [],
    fillText(text, x, y) {
      this.fillTextCalls.push({ text, x, y, font: this.font });
    },
    measureText(text) {
      return { width: text.length * 100 };
    }
  };

  drawDocumentLabels(ctx, layout, scale, 0, 0);

  assert.ok(ctx.fillTextCalls.length >= 2, 'Expected at least two fillText calls');

  const desiredWidth = layout.docWidth * scale * 0.8;
  const measuredWidth = ctx.measureText('1').width;
  const numberFontSize = (desiredWidth / measuredWidth) * 100;

  const firstFontSize = parseFloat(ctx.fillTextCalls[0].font);
  const secondFontSize = parseFloat(ctx.fillTextCalls[1].font);

  assert.ok(Math.abs(firstFontSize - numberFontSize) < 1e-9, 'First fillText font size incorrect');
  assert.ok(Math.abs(secondFontSize - numberFontSize * 0.8) < 1e-9, 'Second fillText font size incorrect');

  assert.strictEqual(ctx.fillTextCalls[1].text, `${layout.docWidth}x${layout.docLength}`, 'Second fillText text incorrect');

  console.log('All drawDocumentLabels tests passed');
})();
