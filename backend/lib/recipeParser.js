function stripTrailingParenthetical(str) {
    return str.replace(/\s*\(.*\)\s*$/, '');
}

const fractionMap = {
    '¼': 0.25, '1/4': 0.25, '&frac14;': 0.25,
    '½': 0.5, '1/2': 0.5, '&frac12;': 0.5,
    '¾': 0.75, '3/4': 0.75, '&frac34;': 0.75,
    '⅛': 0.125, '1/8': 0.125, '&frac18;': 0.125,
};

function parseIngredient(raw) {
    const cleaned = stripTrailingParenthetical(raw);
    const [quantityRaw, unit, ...nameParts] = cleaned.split(/\s+/);
    const quantity = fractionMap[quantityRaw] ? fractionMap[quantityRaw] : parseFloat(quantityRaw);
    const name = nameParts.join(' ');
    return { quantity, unit, name };
}

module.exports = { parseIngredient };
