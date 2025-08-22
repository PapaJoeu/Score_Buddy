const assert = require('assert');

(async () => {
  const { calculateLayoutDetails } = await import('../calculations.js');
  const { calculateScorePositions } = await import('../scoring.js');
  const { drawLayout } = await import('../visualizer.js');

  const layout = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    gutterWidth: 0.5,
    gutterLength: 0.25
  });

  const scorePositions = calculateScorePositions(layout, 'bifold');

  const ctx = {
    moveToCalls: [],
    lineToCalls: [],
    beginPath() {},
    moveTo(x, y) { this.moveToCalls.push({ x, y }); },
    lineTo(x, y) { this.lineToCalls.push({ x, y }); },
    stroke() {},
    clearRect() {},
    translate() {},
    setLineDash() {},
    strokeRect() {},
    fillRect() {},
    fillText() {},
    measureText(text) { return { width: text.length * 100 }; },
    font: '',
    fillStyle: '',
    textAlign: '',
    textBaseline: '',
    strokeStyle: '',
    imageSmoothingEnabled: false
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

  drawLayout(canvas, layout, scorePositions);

  const scale = Math.min(container.clientWidth / layout.sheetWidth, container.clientHeight / layout.sheetLength) * 0.9;
  const offsetX = (canvas.width - layout.sheetWidth * scale) / 2;
  const offsetY = (canvas.height - layout.sheetLength * scale) / 2;

  // Ensure a segment was drawn for each column per score line
  assert.strictEqual(ctx.moveToCalls.length, scorePositions.length * layout.docsAcross);
  assert.strictEqual(ctx.lineToCalls.length, ctx.moveToCalls.length);

  // Check first segment coordinates
  const firstY = Math.round(offsetY + scorePositions[0].y * scale);
  const firstStart = Math.round(offsetX + layout.leftMargin * scale);
  const firstEnd = Math.round(firstStart + layout.docWidth * scale);

  assert.strictEqual(ctx.moveToCalls[0].x, firstStart, 'First segment start incorrect');
  assert.strictEqual(ctx.lineToCalls[0].x, firstEnd, 'First segment end incorrect');
  assert.strictEqual(ctx.moveToCalls[0].y, firstY, 'First segment Y incorrect');
  assert.strictEqual(ctx.lineToCalls[0].y, firstY, 'First segment Y mismatch');

  // Verify gutter spacing between first two segments
  const gap = ctx.moveToCalls[1].x - ctx.lineToCalls[0].x;
  assert.ok(Math.abs(gap - layout.gutterWidth * scale) < 1e-9, 'Gutter width not respected');

  console.log('Score line rendering test passed');
})();
