const assert = require('assert');

(async () => {
  const { calculateLayoutDetails } = await import('../calculations.js');
  const { calculateScorePositions } = await import('../scoring.js');

  const layout = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    gutterWidth: 0.5,
    gutterLength: 0.25
  });

  // Verify bifold score positions
  const bifoldScores = calculateScorePositions(layout, { foldType: 'bifold' });
  assert.strictEqual(bifoldScores.length, 4, 'Bifold score count incorrect');
  assert.strictEqual(bifoldScores[0].y, 2.625, 'First bifold score incorrect');

  // Verify trifold score positions
  const trifoldScores = calculateScorePositions(layout, { foldType: 'trifold' });
  assert.strictEqual(trifoldScores.length, 8, 'Trifold score count incorrect');
  assert.ok(Math.abs(trifoldScores[0].y - 1.9583333333333333) < 1e-9, 'First trifold score incorrect');

  // Verify gatefold score positions
  const gatefoldScores = calculateScorePositions(layout, { foldType: 'gatefold' });
  assert.strictEqual(gatefoldScores.length, 8, 'Gatefold score count incorrect');
  assert.strictEqual(gatefoldScores[0].y, 1.625, 'First gatefold score incorrect');

  console.log('All scoring tests passed');
})();
