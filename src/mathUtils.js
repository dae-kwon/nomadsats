export const safeEvaluate = (expression) => {
    try {
        // 0. Pre-process: Remove commas from numbers (e.g. "30,000" -> "30000")
        const noCommas = expression.replace(/,/g, '');

        // 1. Sanitize: Allow digits, operators, parens, dots, spaces, %
        if (!/^[\d+\-*/().\s%]+$/.test(noCommas)) return null;

        // 2. Handle Percentage: "100 * 20%" -> "100 * 0.20"
        let sanitized = noCommas.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

        // 3. Iterative Evaluate: Remove trailing characters until valid
        while (sanitized.length > 0) {
            try {
                // eslint-disable-next-line no-new-func
                const result = new Function(`return (${sanitized})`)();
                if (isFinite(result) && !isNaN(result)) return result;
            } catch (e) {
                // Continue to next iteration
            }
            sanitized = sanitized.slice(0, -1);
        }

        return null;
    } catch (e) {
        return null;
    }
};
