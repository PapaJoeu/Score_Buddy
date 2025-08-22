const assert = require('assert');

(async () => {
  const { calculateLayoutDetails } = await import('../calculations.js');
  const { drawLayout } = await import('../visualizer.js');

  const layout = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    gutterWidth: 0.5,
    gutterLength: 0.25,
    marginWidth: 1,
    marginLength: 1
  });

  const ctx = {
    fillRectCalls: [],
    strokeRectCalls: [],
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    clearRect() {},
    translate() {},
    setLineDash() {},
    fillText() {},
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
    imageSmoothingEnabled: false,
    strokeRect(x, y, w, h) { this.strokeRectCalls.push({ x, y, w, h }); },
    fillRect(x, y, w, h) { this.fillRectCalls.push({ x, y, w, h }); }
  };

  const canvas = {
    offsetWidth: 200,
    offsetHeight: 200,
    width: 0,
    height: 0,
    getContext: () => ctx
  };

  drawLayout(canvas, layout, [], { marginWidth: layout.marginWidth, marginLength: layout.marginLength });

  const scale = (canvas.offsetWidth * 0.8) / layout.sheetWidth;
  const expectedWidth = Math.round(layout.usableSheetWidth * scale);
  const expectedHeight = Math.round(layout.usableSheetLength * scale);

  const printableArea = ctx.strokeRectCalls.find(c => c.w === expectedWidth && c.h === expectedHeight);
  assert.ok(printableArea, 'Printable area not drawn with expected dimensions');
  assert.strictEqual(ctx.fillRectCalls.length, 4, 'Margins not drawn correctly');

  console.log('All drawLayout tests passed');
})();
