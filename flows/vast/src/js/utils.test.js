const rewire = require('rewire');
const utils = rewire('./utils');
const intersect = utils.__get__('intersect');

describe('intersect', () => {
    it('should return single element if one match', () => {
        const actual = intersect(['a', 'b'], ['a']);
        const expected = ['a'];

        expect(actual).toEqual(expected);
    });

    it('should return null if no match', () => {
        const actual = intersect(['a', 'b'], ['c', 'd']);
        const expected = null;

        expect(actual).toEqual(expected);
    });

    it('should return null if array a is empty', () => {
        const actual = intersect([], ['c', 'd']);
        const expected = null;

        expect(actual).toEqual(expected);
    });

    it('should return null if array b is empty', () => {
        const actual = intersect(['a', 'b'], []);
        const expected = null;

        expect(actual).toEqual(expected);
    });

    it('should return multiple items if more than one match in order of first array', () => {
        const actual = intersect(['a', 'f', 'b'], ['b', 'a', 'd']);
        const expected = ['a', 'b'];

        expect(actual).toEqual(expected);
    });
});
