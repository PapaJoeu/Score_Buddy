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
    marginWidth: 1,
    marginLength: 1
  });

  // Verify basic layout calculations
  assert.strictEqual(layout.usableSheetWidth, 10, 'usableSheetWidth incorrect');
  assert.strictEqual(layout.usableSheetLength, 16, 'usableSheetLength incorrect');
  assert.strictEqual(layout.marginWidth, 1, 'marginWidth incorrect');
  assert.strictEqual(layout.marginLength, 1, 'marginLength incorrect');
  assert.strictEqual(layout.docsAcross, 2, 'docsAcross incorrect');
  assert.strictEqual(layout.docsDown, 3, 'docsDown incorrect');
  assert.strictEqual(layout.topMargin, 2.75, 'topMargin incorrect');
  assert.strictEqual(layout.leftMargin, 2.75, 'leftMargin incorrect');

  // Verify sequence calculation for actual sheet size
  const expectedActualSequence = [
    15.25, 9.25, 12.5,
    6.5, 3, 3,
    8.25, 4, 4,
    4
  ];
  const actualSequence = calculateSequence(layout);
  assert.deepStrictEqual(actualSequence, expectedActualSequence, 'Actual sheet sequence incorrect');

  // Verify sequence calculation for usable sheet size
  const usableLayout = {
    ...layout,
    sheetWidth: layout.usableSheetWidth,
    sheetLength: layout.usableSheetLength,
    topMargin: (layout.usableSheetLength - layout.imposedSpaceLength) / 2,
    leftMargin: (layout.usableSheetWidth - layout.imposedSpaceWidth) / 2
  };
  const expectedUsableSequence = [
    14.25, 8.25, 12.5,
    6.5, 3, 3,
    8.25, 4, 4,
    4
  ];
  const usableSequence = calculateSequence(usableLayout);
  assert.deepStrictEqual(usableSequence, expectedUsableSequence, 'Usable sheet sequence incorrect');


  console.log('All calculations tests passed');
})();
