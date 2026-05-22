// colorConfig.js

// Retrieve theme color tokens from CSS variables with robust defaults for testing
export function getColorTokens() {
    const styles = getComputedStyle(document.documentElement);
    
    const doc = styles.getPropertyValue('--doc-color').trim() || '15, 23, 42';
    const margin = styles.getPropertyValue('--margin-color').trim() || '239, 68, 68';
    const printable = styles.getPropertyValue('--printable-color').trim() || '99, 102, 241';
    const score = styles.getPropertyValue('--score-color').trim() || '16, 185, 129';
    const blue = styles.getPropertyValue('--blue').trim() || '#2563eb';
    
    return {
        document: `rgb(${doc})`,
        margin: `rgb(${margin})`,
        printableFill: `rgba(${printable}, 0.15)`,
        score: `rgb(${score})`,
        label: blue
    };
}

