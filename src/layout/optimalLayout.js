import { calculateLayoutDetails } from './calculations.js';

// Standard sheet sizes to evaluate for optimal layout (in inches)
const STANDARD_SHEETS = [
    { width: 12, height: 18, name: '12×18' },
    { width: 13, height: 19, name: '13×19' }
];

/**
 * Evaluates optimal layout by testing both 12×18 and 13×19 sheets
 * in both orientations (normal and rotated) and returns the best arrangement
 */
export function evaluateOptimalLayout(docWidth, docLength, gutterWidth, gutterLength, marginWidth, marginLength, isMetric = false) {
    let bestLayout = null;
    let maxNUp = 0;
    
    // Convert metric to inches if needed for calculations
    const conversionFactor = isMetric ? 25.4 : 1; // mm to inches
    const docW = docWidth / conversionFactor;
    const docL = docLength / conversionFactor;
    const gutterW = gutterWidth / conversionFactor;
    const gutterL = gutterLength / conversionFactor;
    const marginW = marginWidth / conversionFactor;
    const marginL = marginLength / conversionFactor;
    
    for (const sheet of STANDARD_SHEETS) {
        // Test normal orientation
        const normalLayout = calculateLayoutDetails({
            sheetWidth: sheet.width,
            sheetLength: sheet.height,
            docWidth: docW,
            docLength: docL,
            gutterWidth: gutterW,
            gutterLength: gutterL,
            marginWidth: marginW,
            marginLength: marginL
        });
        
        const normalNUp = normalLayout.docsAcross * normalLayout.docsDown;
        
        if (normalNUp > maxNUp) {
            maxNUp = normalNUp;
            bestLayout = {
                ...normalLayout,
                sheetName: sheet.name,
                isRotated: false,
                originalSheetWidth: sheet.width,
                originalSheetHeight: sheet.height
            };
        }
        
        // Test rotated orientation (sheet rotated)
        const rotatedLayout = calculateLayoutDetails({
            sheetWidth: sheet.height,
            sheetLength: sheet.width,
            docWidth: docW,
            docLength: docL,
            gutterWidth: gutterW,
            gutterLength: gutterL,
            marginWidth: marginL, // Swap margins when sheet is rotated
            marginLength: marginW
        });
        
        const rotatedNUp = rotatedLayout.docsAcross * rotatedLayout.docsDown;
        
        if (rotatedNUp > maxNUp) {
            maxNUp = rotatedNUp;
            bestLayout = {
                ...rotatedLayout,
                sheetName: sheet.name,
                isRotated: true,
                originalSheetWidth: sheet.width,
                originalSheetHeight: sheet.height
            };
        }
    }
    
    // Convert back to original units if metric
    if (isMetric && bestLayout) {
        bestLayout.sheetWidth *= conversionFactor;
        bestLayout.sheetLength *= conversionFactor;
        bestLayout.docWidth *= conversionFactor;
        bestLayout.docLength *= conversionFactor;
        bestLayout.gutterWidth *= conversionFactor;
        bestLayout.gutterLength *= conversionFactor;
        bestLayout.marginWidth *= conversionFactor;
        bestLayout.marginLength *= conversionFactor;
        bestLayout.originalSheetWidth *= conversionFactor;
        bestLayout.originalSheetHeight *= conversionFactor;
        bestLayout.usableSheetWidth *= conversionFactor;
        bestLayout.usableSheetLength *= conversionFactor;
        bestLayout.imposedSpaceWidth *= conversionFactor;
        bestLayout.imposedSpaceLength *= conversionFactor;
        bestLayout.topMargin *= conversionFactor;
        bestLayout.leftMargin *= conversionFactor;
        bestLayout.gutterSpaceWidth *= conversionFactor;
        bestLayout.gutterSpaceLength *= conversionFactor;
    }
    
    return bestLayout;
}

/**
 * Checks if the current layout is optimal compared to standard sheets
 */
export function isCurrentLayoutOptimal(currentLayout, docWidth, docLength, gutterWidth, gutterLength, marginWidth, marginLength, isMetric = false) {
    const optimalLayout = evaluateOptimalLayout(docWidth, docLength, gutterWidth, gutterLength, marginWidth, marginLength, isMetric);
    
    if (!optimalLayout) {
        return true; // If we can't find a better layout, current is optimal
    }
    
    const currentNUp = currentLayout.docsAcross * currentLayout.docsDown;
    const optimalNUp = optimalLayout.docsAcross * optimalLayout.docsDown;
    
    return currentNUp >= optimalNUp;
}

/**
 * Gets the optimal layout result with comparison information
 */
export function getOptimalLayoutComparison(currentLayout, docWidth, docLength, gutterWidth, gutterLength, marginWidth, marginLength, isMetric = false) {
    const optimalLayout = evaluateOptimalLayout(docWidth, docLength, gutterWidth, gutterLength, marginWidth, marginLength, isMetric);
    
    if (!optimalLayout) {
        return null;
    }
    
    const currentNUp = currentLayout.docsAcross * currentLayout.docsDown;
    const optimalNUp = optimalLayout.docsAcross * optimalLayout.docsDown;
    
    return {
        current: {
            nUp: currentNUp,
            sheetSize: `${currentLayout.sheetWidth} × ${currentLayout.sheetLength}`
        },
        optimal: {
            nUp: optimalNUp,
            layout: optimalLayout,
            improvement: optimalNUp - currentNUp
        },
        isCurrentOptimal: currentNUp >= optimalNUp
    };
}