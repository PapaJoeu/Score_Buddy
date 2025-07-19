const assert = require('assert');

(async () => {
  const { calculateAdaptiveScale } = await import('../visualizer.js');

  // Case: sheet is wider than canvas
  const canvasWidth = 100;
  const canvasHeight = 200;
  const layoutWide = { sheetWidth: 300, sheetLength: 100 };
  const expectedWide = (canvasWidth * 0.9) / layoutWide.sheetWidth;
  const scaleWide = calculateAdaptiveScale(layoutWide, canvasWidth, canvasHeight);
  assert.strictEqual(scaleWide, expectedWide, 'Scale for wider sheet incorrect');

  // Case: sheet is taller than canvas
  const layoutTall = { sheetWidth: 100, sheetLength: 400 };
  const expectedTall = (canvasHeight * 0.9) / layoutTall.sheetLength;
  const scaleTall = calculateAdaptiveScale(layoutTall, canvasWidth, canvasHeight);
  assert.strictEqual(scaleTall, expectedTall, 'Scale for taller sheet incorrect');

  console.log('All calculateAdaptiveScale tests passed');
})();
