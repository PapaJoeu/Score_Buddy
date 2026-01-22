/**
 * Output Panel
 * Creates the right panel with tabs for Summary, Cuts, and Scores
 */

import { createTabs } from './tabs.js';
import { byId } from '../dom/dom.js';

/**
 * Creates the Summary tab content
 */
function createSummaryTabContent() {
    const container = document.createElement('div');
    container.id = 'summaryTab';

    // Summary stats grid
    const statsGrid = document.createElement('div');
    statsGrid.className = 'summary-grid';
    statsGrid.id = 'summaryStatsGrid';

    // Stats will be populated dynamically
    statsGrid.innerHTML = `
        <div class="summary-card">
            <div class="summary-card-label">N-Up</div>
            <div class="summary-card-value" id="summaryNUp">-</div>
        </div>
        <div class="summary-card">
            <div class="summary-card-label">Waste</div>
            <div class="summary-card-value" id="summaryWaste">-</div>
        </div>
        <div class="summary-card">
            <div class="summary-card-label">Usable Area</div>
            <div class="summary-card-value" id="summaryUsableArea">-</div>
        </div>
    `;

    // Cut counts section
    const cutsSection = document.createElement('div');
    cutsSection.className = 'summary-section';
    cutsSection.innerHTML = `
        <h3>Cuts</h3>
        <div style="display: grid; gap: 8px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between;">
                <span>Total Cuts:</span>
                <strong id="summaryTotalCuts">-</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Unique X Positions:</span>
                <strong id="summaryXCuts">-</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Unique Y Positions:</span>
                <strong id="summaryYCuts">-</strong>
            </div>
        </div>
    `;

    // Warnings section
    const warningsSection = document.createElement('div');
    warningsSection.className = 'summary-section';
    warningsSection.innerHTML = `
        <h3>Warnings</h3>
        <ul class="warning-list" id="summaryWarnings">
            <li style="padding: 12px; font-size: 14px; opacity: 0.7;">No warnings</li>
        </ul>
    `;

    container.appendChild(statsGrid);
    container.appendChild(cutsSection);
    container.appendChild(warningsSection);

    return container;
}

/**
 * Creates the Cuts tab content
 */
function createCutsTabContent() {
    const container = document.createElement('div');
    container.id = 'cutsTab';

    // This will be populated by the display.js module
    container.innerHTML = `
        <div id="programSequenceContent">
            <p style="opacity: 0.7;">Cut positions will appear here after calculation.</p>
        </div>
    `;

    return container;
}

/**
 * Creates the Scores tab content
 */
function createScoresTabContent() {
    const container = document.createElement('div');
    container.id = 'scoresTab';

    // This will be populated by the display.js module
    container.innerHTML = `
        <div id="scorePositionsContent">
            <p style="opacity: 0.7;">Score positions will appear here after calculation.</p>
        </div>
    `;

    return container;
}

/**
 * Initializes the output panel with tabs
 */
export function initOutputPanel() {
    const dataColumn = document.querySelector('.data-column');
    if (!dataColumn) return;

    // Clear existing content
    dataColumn.innerHTML = '';

    // Add card styling
    dataColumn.className = 'data-column card';
    dataColumn.style.padding = '0';
    dataColumn.style.overflow = 'hidden';

    // Create tabs
    const tabs = createTabs([
        {
            id: 'tab-summary',
            label: 'Summary',
            content: createSummaryTabContent()
        },
        {
            id: 'tab-cuts',
            label: 'Cuts',
            content: createCutsTabContent()
        },
        {
            id: 'tab-scores',
            label: 'Scores',
            content: createScoresTabContent()
        }
    ]);

    dataColumn.appendChild(tabs);
}

/**
 * Updates the summary tab with current layout data
 */
export function updateSummaryTab(data) {
    const nUpEl = byId('summaryNUp', { optional: true });
    const wasteEl = byId('summaryWaste', { optional: true });
    const usableEl = byId('summaryUsableArea', { optional: true });
    const totalCutsEl = byId('summaryTotalCuts', { optional: true });
    const xCutsEl = byId('summaryXCuts', { optional: true });
    const yCutsEl = byId('summaryYCuts', { optional: true });
    const warningsEl = byId('summaryWarnings', { optional: true });

    if (nUpEl) nUpEl.textContent = data.nUp || '-';
    if (wasteEl) wasteEl.textContent = data.waste || '-';
    if (usableEl) usableEl.textContent = data.usableArea || '-';
    if (totalCutsEl) totalCutsEl.textContent = data.totalCuts || '-';
    if (xCutsEl) xCutsEl.textContent = data.xCuts || '-';
    if (yCutsEl) yCutsEl.textContent = data.yCuts || '-';

    // Update warnings
    if (warningsEl) {
        if (data.warnings && data.warnings.length > 0) {
            warningsEl.innerHTML = data.warnings.map(w =>
                `<li class="warning-item">${w}</li>`
            ).join('');
        } else {
            warningsEl.innerHTML = '<li style="padding: 12px; font-size: 14px; opacity: 0.7;">No warnings</li>';
        }
    }
}

/**
 * Updates the cuts tab with program sequence
 */
export function updateCutsTab(html) {
    const container = byId('programSequenceContent', { optional: true });
    if (container) {
        container.innerHTML = html;
    }
}

/**
 * Updates the scores tab with score positions
 */
export function updateScoresTab(html) {
    const container = byId('scorePositionsContent', { optional: true });
    if (container) {
        container.innerHTML = html;
    }
}
