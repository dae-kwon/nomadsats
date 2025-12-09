import { safeEvaluate } from './mathUtils';

describe('safeEvaluate', () => {
    test('evaluates simple addition', () => {
        expect(safeEvaluate('100 + 50')).toBe(150);
    });

    test('evaluates multiplication', () => {
        expect(safeEvaluate('50 * 2')).toBe(100);
    });

    test('evaluates division', () => {
        expect(safeEvaluate('30 / 2')).toBe(15);
    });

    test('evaluates percentage', () => {
        expect(safeEvaluate('100 * 20%')).toBe(20);
        expect(safeEvaluate('50 + 10%')).toBe(50.1); // 50 + 0.1
    });

    test('evaluates complex expressions', () => {
        expect(safeEvaluate('(100 + 50) * 2')).toBe(300);
    });

    test('returns null for invalid characters', () => {
        expect(safeEvaluate('100 + abc')).toBeNull();
        expect(safeEvaluate('alert(1)')).toBeNull();
    });

    test('returns partial result for incomplete expressions', () => {
        // "100 +" -> "100"
        expect(safeEvaluate('100 +')).toBe(100);
        expect(safeEvaluate('200/')).toBe(200);
        expect(safeEvaluate('100 * (2 +')).toBe(100); // Should backtrack to "100"
        expect(safeEvaluate('100 * (2')).toBe(100);
        expect(safeEvaluate('100 * (')).toBe(100);
    });

    test('handles decimals', () => {
        expect(safeEvaluate('10.5 + 2.5')).toBe(13);
    });

    test('handles commas', () => {
        expect(safeEvaluate('30,000 + 500')).toBe(30500);
        expect(safeEvaluate('1,000 * 2')).toBe(2000);
    });

    test('ignores trailing operators', () => {
        expect(safeEvaluate('200/')).toBe(200);
        expect(safeEvaluate('200 +')).toBe(200);
        expect(safeEvaluate('200 * ')).toBe(200);
    });
});
