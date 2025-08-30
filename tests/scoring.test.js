const assert = require('assert');

(async () => {
  const { calculateLayoutDetails } = await import('../src/layout/calculations.js');
  const { computeScorePositions } = await import('../src/scoring/scoring.js');

  const layout = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    gutterWidth: 0.5,
    gutterLength: 0.25
  });

  // Verify bifold score positions
  const bifoldScores = computeScorePositions(layout, 'bifold');
  assert.strictEqual(bifoldScores.length, 4, 'Bifold score count incorrect');
  assert.strictEqual(bifoldScores[0].y, 2.625, 'First bifold score incorrect');

  // Verify trifold score positions
  const trifoldScores = computeScorePositions(layout, 'trifold');
  assert.strictEqual(trifoldScores.length, 8, 'Trifold score count incorrect');
  assert.ok(Math.abs(trifoldScores[0].y - 1.9583333333333333) < 1e-9, 'First trifold score incorrect');

  // Verify gatefold score positions
  const gatefoldScores = computeScorePositions(layout, 'gatefold');
  assert.strictEqual(gatefoldScores.length, 8, 'Gatefold score count incorrect');
  assert.ok(Math.abs(gatefoldScores[0].y - 1.625) < 1e-9, 'First gatefold score incorrect');

  // Verify allowance adjustment
  const trifoldCustomAllowance = computeScorePositions(layout, 'trifold', [], 0.1);
  assert.ok(Math.abs(trifoldCustomAllowance[1].y - 3.191666666666666) < 1e-9, 'Trifold custom allowance incorrect');

  const gatefoldCustomAllowance = computeScorePositions(layout, 'gatefold', [], 0.1);
  assert.ok(Math.abs(gatefoldCustomAllowance[1].y - 3.525) < 1e-9, 'Gatefold custom allowance incorrect');

  // Verify custom score positions
  const customScores = computeScorePositions(layout, 'custom', [1, 2]);
  assert.strictEqual(customScores.length, 8, 'Custom score count incorrect');
  assert.strictEqual(customScores[0].y, 1.625, 'First custom score incorrect');

  // Verify filtering of out-of-range custom positions
  const filteredCustomScores = computeScorePositions(layout, 'custom', [-1, 2, 4, 5, 'a']);
  assert.strictEqual(filteredCustomScores.length, 8, 'Filtered custom score count incorrect');
  assert.strictEqual(filteredCustomScores[0].y, layout.topMargin + 2, 'Filtered custom first score incorrect');
  assert.strictEqual(filteredCustomScores[1].y, layout.topMargin + 4, 'Filtered custom second score incorrect');

  // Verify invalid fold type handling
  assert.throws(
    () => computeScorePositions(layout, 'invalid'),
    /Unsupported fold type/
  );

  console.log('All scoring tests passed');
})();
