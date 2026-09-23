const { normalizeUnit, normalizeIngredient } = require('../../lib/normalize');

describe('normalizeUnit', () => {
    it('converts a synonym to its canonical form', () => {
        expect(normalizeUnit('pound')).toBe('lb');
        expect(normalizeUnit('pounds')).toBe('lb');
        expect(normalizeUnit('tablespoons')).toBe('tbsp');
    });

    it('converts uppercase input to lowercase', () => {
        expect(normalizeUnit('OZ')).toBe('oz');
    });

    it('trims trailing spaces', () => {
        expect(normalizeUnit('tsp   ')).toBe('tsp');
    });

    it('strips a trailing period', () => {
        expect(normalizeUnit('tbsp.')).toBe('tbsp');
    });

    it('returns the cleaned string unchanged when there is no synonym match', () => {
        expect(normalizeUnit('g')).toBe('g');
    });
});

describe('normalizeIngredient', () => {
    it('trims trailing spaces', () => {
        expect(normalizeIngredient('flour   ')).toBe('flour');
    });

    it('converts to lowercase', () => {
        expect(normalizeIngredient('FLOUR')).toBe('flour');
    });
});
