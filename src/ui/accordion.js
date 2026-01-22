/**
 * Accordion Component
 * Creates collapsible sections for the setup panel
 */

/**
 * Creates an accordion structure
 * @param {Array} sections - Array of section objects with {title, content, expanded}
 * @returns {HTMLElement} - Accordion container element
 */
export function createAccordion(sections) {
    const accordion = document.createElement('div');
    accordion.className = 'accordion';

    sections.forEach((section, index) => {
        const item = createAccordionItem(section, index);
        accordion.appendChild(item);
    });

    return accordion;
}

/**
 * Creates a single accordion item
 * @param {Object} section - Section data {title, content, expanded, id}
 * @param {number} index - Section index
 * @returns {HTMLElement} - Accordion item element
 */
function createAccordionItem(section, index) {
    const item = document.createElement('div');
    item.className = `accordion-item${section.expanded ? ' expanded' : ''}`;
    item.dataset.sectionId = section.id || `section-${index}`;

    // Header
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', section.expanded ? 'true' : 'false');

    const title = document.createElement('h3');
    title.textContent = section.title;

    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '▼';

    header.appendChild(title);
    header.appendChild(icon);

    // Content
    const content = document.createElement('div');
    content.className = 'accordion-content';

    const body = document.createElement('div');
    body.className = 'accordion-body';

    if (typeof section.content === 'string') {
        body.innerHTML = section.content;
    } else if (section.content instanceof HTMLElement) {
        body.appendChild(section.content);
    }

    content.appendChild(body);

    // Event listener
    header.addEventListener('click', () => {
        toggleAccordionItem(item, header);
    });

    item.appendChild(header);
    item.appendChild(content);

    return item;
}

/**
 * Toggles an accordion item's expanded state
 * @param {HTMLElement} item - Accordion item element
 * @param {HTMLElement} header - Accordion header element
 */
function toggleAccordionItem(item, header) {
    const isExpanded = item.classList.contains('expanded');

    if (isExpanded) {
        item.classList.remove('expanded');
        header.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('expanded');
        header.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Expands all accordion items
 * @param {HTMLElement} accordion - Accordion container
 */
export function expandAllAccordion(accordion) {
    const items = accordion.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!item.classList.contains('expanded')) {
            item.classList.add('expanded');
            header.setAttribute('aria-expanded', 'true');
        }
    });
}

/**
 * Collapses all accordion items
 * @param {HTMLElement} accordion - Accordion container
 */
export function collapseAllAccordion(accordion) {
    const items = accordion.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (item.classList.contains('expanded')) {
            item.classList.remove('expanded');
            header.setAttribute('aria-expanded', 'false');
        }
    });
}
