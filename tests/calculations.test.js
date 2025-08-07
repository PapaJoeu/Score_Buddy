const assert = require('assert');

(async () => {
  const { calculateLayoutDetails, calculateSequence } = await import('../calculations.js');

  const layout = calculateLayoutDetails({
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    gutterWidth: 0.5,
    gutterLength: 0.25,
    sheetMargin: 0.125
  });

  // Verify basic layout calculations
  assert.strictEqual(layout.docsAcross, 3, 'docsAcross incorrect');
  assert.strictEqual(layout.docsDown, 4, 'docsDown incorrect');
  assert.strictEqual(layout.topMargin, 0.625, 'topMargin incorrect');
  assert.strictEqual(layout.leftMargin, 1, 'leftMargin incorrect');
  assert.strictEqual(layout.sheetMargin, 0.125, 'sheetMargin incorrect');
  assert.strictEqual(layout.usableWidth, 11.75, 'usableWidth incorrect');
  assert.strictEqual(layout.usableLength, 17.75, 'usableLength incorrect');

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

  // Verify margin reduces available space
  const marginLayout = calculateLayoutDetails({
    sheetWidth: 8,
    sheetLength: 10,
    docWidth: 4,
    docLength: 5,
    gutterWidth: 0,
    gutterLength: 0,
    sheetMargin: 1
  });
  assert.strictEqual(marginLayout.docsAcross, 1, 'docsAcross with margin incorrect');
  assert.strictEqual(marginLayout.docsDown, 1, 'docsDown with margin incorrect');


  console.log('All calculations tests passed');
})();
