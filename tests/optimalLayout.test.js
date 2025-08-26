const assert = require('assert');

(async () => {
  const { evaluateOptimalLayout, isCurrentLayoutOptimal, getOptimalLayoutComparison } = await import('../src/layout/optimalLayout.js');
  const { calculateLayoutDetails } = await import('../src/layout/calculations.js');

  console.log('Testing optimal layout functionality...');

  // Test 1: Basic optimal layout evaluation
  const optimal = evaluateOptimalLayout(3.5, 4, 0.125, 0.125, 0.25, 0.25, false);
  assert(optimal !== null, 'Should find an optimal layout');
  assert.strictEqual(optimal.docsAcross * optimal.docsDown, 15, 'Should find 15-up optimal layout');
  assert.strictEqual(optimal.sheetName, '13×19', 'Should use 13×19 sheet');
  assert.strictEqual(optimal.isRotated, true, 'Should be rotated');

  // Test 2: Current layout optimality check
  const current12x18 = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3.5,
    docLength: 4,
    gutterWidth: 0.125,
    gutterLength: 0.125,
    marginWidth: 0.25,
    marginLength: 0.25
  });

  const isOptimal = isCurrentLayoutOptimal(current12x18, 3.5, 4, 0.125, 0.125, 0.25, 0.25, false);
  assert.strictEqual(isOptimal, false, 'Current 12×18 layout should not be optimal');

  // Test 3: Optimal layout comparison
  const comparison = getOptimalLayoutComparison(current12x18, 3.5, 4, 0.125, 0.125, 0.25, 0.25, false);
  assert(comparison !== null, 'Should return comparison data');
  assert.strictEqual(comparison.current.nUp, 12, 'Current should be 12-up');
  assert.strictEqual(comparison.optimal.nUp, 15, 'Optimal should be 15-up');
  assert.strictEqual(comparison.optimal.improvement, 3, 'Should improve by 3 documents');
  assert.strictEqual(comparison.isCurrentOptimal, false, 'Current should not be optimal');

  // Test 4: Metric mode
  const metricOptimal = evaluateOptimalLayout(89, 102, 3, 3, 6, 6, true);
  assert(metricOptimal !== null, 'Should find metric optimal layout');
  assert(metricOptimal.docsAcross * metricOptimal.docsDown > 12, 'Should improve over 12-up in metric');

  // Test 5: Edge case - perfect fit
  const perfectFit = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 6,
    docLength: 9,
    gutterWidth: 0,
    gutterLength: 0,
    marginWidth: 0,
    marginLength: 0
  });

  const isPerfectOptimal = isCurrentLayoutOptimal(perfectFit, 6, 9, 0, 0, 0, 0, false);
  assert.strictEqual(isPerfectOptimal, true, 'Perfect fit should be optimal');

  console.log('All optimal layout tests passed ✓');
})();