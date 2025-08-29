const assert = require('assert');

(async () => {
  const {
    calculateLayoutDetails,
    calculateProgramSequence: calculateSequence
  } = await import('../src/layout/calculations.js');

  const base = {
    sheetWidth: 12,
    sheetLength: 18,
    docWidth: 3,
    docLength: 4,
    marginWidth: 1,
    marginLength: 1
  };

  const cases = [
    {
      gutterWidth: 0,
      gutterLength: 0,
      expected: [17, 10.5, 16, 9, 6, 3, 12, 8, 4]
    },
    {
      gutterWidth: 0.125,
      gutterLength: 0,
      expected: [17, 10.625, 16, 9.25, 6.125, 3, 3, 3, 12, 8, 4]
    },
    {
      gutterWidth: 0,
      gutterLength: 0.125,
      expected: [15.125, 10.5, 12.25, 9, 6, 3, 8.125, 4, 4, 4]
    },
    {
      gutterWidth: 0.125,
      gutterLength: 0.125,
      expected: [15.125, 10.625, 12.25, 9.25, 6.125, 3, 3, 3, 8.125, 4, 4, 4]
    }
  ];

  cases.forEach(({ gutterWidth, gutterLength, expected }) => {
    const layout = calculateLayoutDetails({
      ...base,
      gutterWidth,
      gutterLength
    });
    const sequence = calculateSequence(layout);
    assert.deepStrictEqual(
      sequence,
      expected,
      `Sequence mismatch for gutterWidth=${gutterWidth}, gutterLength=${gutterLength}`
    );
  });

  console.log('All calculations tests passed');
})();

