export function createToggleSwitch({ id, label, icon }) {
    const wrapper = document.createElement('label');
    wrapper.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.setAttribute('aria-label', label);

    const slider = document.createElement('span');
    slider.className = 'slider';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'switch-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = icon;

    wrapper.appendChild(input);
    wrapper.appendChild(slider);
    wrapper.appendChild(iconSpan);

    return wrapper;
}
