import { LEGEND_ITEMS, OPTION_CHECKBOXES } from '../config/legendOptions.js';

export function renderLegendOptions() {
    const legendEl = document.getElementById('visualizerLegend');
    const optionsEl = document.getElementById('visualizerOptions');

    if (legendEl) {
        LEGEND_ITEMS.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('legend-item');

            if (item.id) {
                li.id = item.id;
                if (item.label) {
                    li.textContent = item.label;
                }
            } else {
                const marker = document.createElement('span');
                marker.classList.add(item.type === 'line' ? 'legend-line' : 'legend-swatch');
                marker.classList.add(item.className);
                marker.setAttribute('aria-hidden', 'true');
                li.appendChild(marker);

                const label = document.createElement('span');
                label.textContent = item.label;
                li.appendChild(label);
            }

            legendEl.appendChild(li);
        });
    }

    if (optionsEl) {
        OPTION_CHECKBOXES.forEach(opt => {
            const label = document.createElement('label');
            label.className = 'checkbox-label';
            label.htmlFor = opt.id;

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = opt.id;
            if (opt.checked) {
                input.checked = true;
            }

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${opt.label}`));
            optionsEl.appendChild(label);
        });
    }
}

renderLegendOptions();
