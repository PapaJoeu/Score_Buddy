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

  // Verify bifold score positions with margins
  const bifoldScores = calculateScorePositions(layout, { foldType: 'bifold', scoredWithMargins: true });
  assert.strictEqual(bifoldScores.length, 4, 'Bifold score count incorrect');
  assert.strictEqual(bifoldScores[0].y, 2.625, 'First bifold score incorrect');

  // Verify trifold score positions without margins
  const trifoldScores = calculateScorePositions(layout, { foldType: 'trifold', scoredWithMargins: false });
  assert.strictEqual(trifoldScores.length, 8, 'Trifold score count incorrect');
  assert.ok(Math.abs(trifoldScores[0].y - 1.3333333333333333) < 1e-9, 'First trifold score incorrect');

  console.log('All scoring tests passed');
})();
