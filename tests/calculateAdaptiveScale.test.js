const assert = require('assert');

(async () => {
  const { calculateAdaptiveScale } = await import('../visualizer.js');

  const canvasWidth = 100;
  const canvasHeight = 200;

  // Case: sheet is wider than canvas (using usable sheet size)
  const layoutWide = { sheetWidth: 280, sheetLength: 80 }; // 300x100 with 10 margins on each side
  const expectedWide = (canvasWidth * 0.9) / layoutWide.sheetWidth;
  const scaleWide = calculateAdaptiveScale(layoutWide, canvasWidth, canvasHeight);
  assert.strictEqual(scaleWide, expectedWide, 'Scale for margin-adjusted wider sheet incorrect');

  // Case: sheet is taller than canvas (using usable sheet size)
  const layoutTall = { sheetWidth: 90, sheetLength: 380 }; // 100x400 with 5 width and 10 length margins
  const expectedTall = (canvasHeight * 0.9) / layoutTall.sheetLength;
  const scaleTall = calculateAdaptiveScale(layoutTall, canvasWidth, canvasHeight);
  assert.strictEqual(scaleTall, expectedTall, 'Scale for margin-adjusted taller sheet incorrect');

  console.log('All calculateAdaptiveScale tests passed');
})();
