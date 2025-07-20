const assert = require('assert');

(async () => {
  const { calculateLayoutDetails, calculateSequence } = await import('../calculations.js');

  const layout = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    gutterWidth: 0.5,
    gutterLength: 0.25
  });

  // Verify basic layout calculations
  assert.strictEqual(layout.docsAcross, 3, 'docsAcross incorrect');
  assert.strictEqual(layout.docsDown, 4, 'docsDown incorrect');
  assert.strictEqual(layout.topMargin, 0.625, 'topMargin incorrect');
  assert.strictEqual(layout.leftMargin, 1, 'leftMargin incorrect');

  // Verify sequence calculation
  const expectedSequence = [
    17.375, 11, 16.75,
    10, 6.5, 3,
    3, 3, 12.5,
    8.25, 4, 4,
    4, 4
  ];
  const sequence = calculateSequence(layout);
  assert.deepStrictEqual(sequence, expectedSequence, 'Sequence calculation incorrect');


  console.log('All calculations tests passed');
})();
