/**
 * Tabs Component
 * Creates a tabbed interface for the output panel
 */

/**
 * Creates a tabs structure
 * @param {Array} tabs - Array of tab objects with {id, label, content}
 * @returns {HTMLElement} - Tabs container element
 */
export function createTabs(tabs) {
    const container = document.createElement('div');
    container.className = 'tabs';

    // Create tab list
    const tabList = document.createElement('ul');
    tabList.className = 'tab-list';
    tabList.setAttribute('role', 'tablist');

    // Create tab panels container
    const panelsContainer = document.createElement('div');
    panelsContainer.className = 'tab-panels';

    tabs.forEach((tab, index) => {
        // Create tab button
        const li = document.createElement('li');
        li.setAttribute('role', 'presentation');

        const button = document.createElement('button');
        button.className = `tab-button${index === 0 ? ' active' : ''}`;
        button.textContent = tab.label;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', tab.id);
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        button.dataset.tabId = tab.id;

        button.addEventListener('click', () => {
            switchTab(container, tab.id);
        });

        li.appendChild(button);
        tabList.appendChild(li);

        // Create tab panel
        const panel = document.createElement('div');
        panel.className = `tab-panel${index === 0 ? ' active' : ''}`;
        panel.id = tab.id;
        panel.setAttribute('role', 'tabpanel');

        if (typeof tab.content === 'string') {
            panel.innerHTML = tab.content;
        } else if (tab.content instanceof HTMLElement) {
            panel.appendChild(tab.content);
        }

        panelsContainer.appendChild(panel);
    });

    container.appendChild(tabList);
    container.appendChild(panelsContainer);

    return container;
}

/**
 * Switches to a specific tab
 * @param {HTMLElement} tabsContainer - Tabs container element
 * @param {string} tabId - ID of tab to switch to
 */
export function switchTab(tabsContainer, tabId) {
    // Update buttons
    const buttons = tabsContainer.querySelectorAll('.tab-button');
    buttons.forEach(button => {
        const isActive = button.dataset.tabId === tabId;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update panels
    const panels = tabsContainer.querySelectorAll('.tab-panel');
    panels.forEach(panel => {
        panel.classList.toggle('active', panel.id === tabId);
    });
}

/**
 * Gets the currently active tab ID
 * @param {HTMLElement} tabsContainer - Tabs container element
 * @returns {string} - Active tab ID
 */
export function getActiveTab(tabsContainer) {
    const activeButton = tabsContainer.querySelector('.tab-button.active');
    return activeButton ? activeButton.dataset.tabId : null;
}
