// colorConfig.js

// Retrieve theme color tokens from CSS variables
export function getColorTokens() {
    const styles = getComputedStyle(document.documentElement);
    const printable = styles.getPropertyValue('--printable-color').trim();
    const line = styles.getPropertyValue('--line-color').trim();
    return {
        document: `rgb(${line})`,
        margin: `rgb(${line})`,
        printableFill: `rgba(${printable}, 0.25)`,
        score: `rgb(${line})`,
        label: styles.getPropertyValue('--blue').trim()
    };
}
