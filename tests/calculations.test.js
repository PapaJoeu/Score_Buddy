const assert = require('assert');

(async () => {
  const { calculateLayoutDetails, calculateSequence } = await import('../src/layout/calculations.js');

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

  // Verify default margins produce matching usable dimensions
  const noMarginLayout = calculateLayoutDetails({
    sheetWidth: 10,
    sheetLength: 20,
    docWidth: 2,
    docLength: 3,
    gutterWidth: 0,
    gutterLength: 0
  });

  assert.strictEqual(noMarginLayout.marginWidth, 0, 'Default marginWidth incorrect');
  assert.strictEqual(noMarginLayout.marginLength, 0, 'Default marginLength incorrect');
  assert.strictEqual(noMarginLayout.usableSheetWidth, 10, 'usableSheetWidth with zero margins incorrect');
  assert.strictEqual(noMarginLayout.usableSheetLength, 20, 'usableSheetLength with zero margins incorrect');


  console.log('All calculations tests passed');
})();
