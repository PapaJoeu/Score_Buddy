// printLayout.js
//
// Builds an off-screen DOM layout representing a two-page, 12x18 inch document.
// Page 1 holds the layout visualizer, page 2 stacks all data cards.
// The resulting structure can be fed to html2canvas/jsPDF for PDF generation.

/**
 * Create a two-page print layout.
 * @param {HTMLElement} visualizer - element containing the layout visualizer
 * @param {HTMLElement[]} cards - array of data card elements
 * @returns {{container: HTMLElement, pages: HTMLElement[]}}
 */
export function createPrintLayout(visualizer, cards) {
    // Wrapper is positioned off-screen so it's not visible to the user
    const container = document.createElement('div');
    container.className = 'print-layout';
    container.style.position = 'absolute';
    container.style.left = '-9999px';

    // --- Page 1: Visualizer ---
    const page1 = createPage('visualizer-page');
    page1.querySelector('.page-content').appendChild(visualizer.cloneNode(true));

    // --- Page 2: Cards ---
    const page2 = createPage('cards-page');
    const content = page2.querySelector('.page-content');
    cards.forEach(card => content.appendChild(card.cloneNode(true)));

    container.append(page1, page2);
    return { container, pages: [page1, page2] };
}

/**
 * Helper to create a single page sized for 12x18 with half-inch margins.
 * @param {string} className additional class to identify the page type
 */
function createPage(className = '') {
    const page = document.createElement('section');
    page.className = `print-page ${className}`.trim();
    page.style.width = '18in';
    page.style.height = '12in';
    page.style.padding = '0.5in';
    page.style.boxSizing = 'border-box';

    // Inner container that respects the margin area
    const content = document.createElement('div');
    content.className = 'page-content';
    content.style.width = '100%';
    content.style.height = '100%';
    page.appendChild(content);

    return page;
}
