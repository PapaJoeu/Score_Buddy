const assert = require('assert');

(async () => {
  const { findOptimalLayout } = await import('../src/layout/layoutController.js');

  const elements = {
    docWidth: { value: '3' },
    docLength: { value: '4' },
    gutterWidth: { value: '0' },
    gutterLength: { value: '0' },
    marginWidth: { value: '0' },
    marginLength: { value: '0' }
  };

  const { layout, config } = findOptimalLayout(elements);

  assert.strictEqual(layout.docsAcross * layout.docsDown, 18, 'Expected 18-up layout');
  assert.strictEqual(layout.sheetWidth, 13, 'Expected sheet width 13');
  assert.strictEqual(layout.sheetLength, 19, 'Expected sheet length 19');
  assert.strictEqual(config.docRotated, true, 'Expected document rotation');

  console.log('All findOptimalLayout tests passed');
})();
