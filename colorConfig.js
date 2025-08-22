// colorConfig.js

// Retrieve theme color tokens from CSS variables
export function getColorTokens() {
    const styles = getComputedStyle(document.documentElement);
    const printable = styles.getPropertyValue('--printable-color').trim();
    return {
        document: `rgb(${styles.getPropertyValue('--doc-color').trim()})`,
        margin: `rgb(${styles.getPropertyValue('--margin-color').trim()})`,
        printableFill: `rgba(${printable}, 0.25)`,
        score: `rgb(${styles.getPropertyValue('--score-color').trim()})`,
        label: styles.getPropertyValue('--blue').trim()
    };
}
