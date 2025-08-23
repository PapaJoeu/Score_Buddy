const assert = require('assert');

(globalThis.document = { documentElement: {} });
(globalThis.getComputedStyle = () => ({ getPropertyValue: () => '' }));

(async () => {
  const { calculateLayoutDetails } = await import('../src/layout/calculations.js');
  const { drawLayout } = await import('../visualizer.js');
  const { drawPrintableArea } = await import('../src/render/drawPrintableArea.js');

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

  const container = {
    clientWidth: 400,
    clientHeight: 600,
    style: { setProperty() {} }
  };

  const canvas = {
    width: 0,
    height: 0,
    parentElement: container,
    getContext: () => ctx
  };

  drawLayout(canvas, layout, [], { marginWidth: layout.marginWidth, marginLength: layout.marginLength });

  const scale = (container.clientHeight / layout.sheetLength) * 0.9;
  const expectedWidth = Math.round(layout.usableSheetWidth * scale);
  const expectedHeight = Math.round(layout.usableSheetLength * scale);

  const printableArea = ctx.strokeRectCalls.find(c => c.w === expectedWidth && c.h === expectedHeight);
  assert.ok(printableArea, 'Printable area not drawn with expected dimensions');
  assert.strictEqual(ctx.fillRectCalls.length, 4, 'Margins not drawn correctly');

  // Test the modular printable area function
  ctx.fillRectCalls = [];
  ctx.strokeRectCalls = [];
  drawPrintableArea(ctx, layout, scale, 0, 0, {
    marginData: { marginWidth: layout.marginWidth, marginLength: layout.marginLength },
    colors: {},
    showPrintableArea: true
  });
  assert.strictEqual(ctx.fillRectCalls.length, 4, 'drawPrintableArea did not draw four margins');

  console.log('All drawLayout tests passed');
})();
