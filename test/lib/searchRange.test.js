/* eslint-env mocha */
const { expect } = require('chai');
const search = require('../../src/lib/search');

describe('search.range', () => {
    it('should return range in the middle', () => {
        const samples = [1, 2, 3, 4, 5].map(x => ({ x: x, y: 0 }));
        const res = search.range(samples, 2, 4);
        expect(res).to.deep.equal({ first: 1, last: 3 });
    });

    it('should return entire range', () => {
        const samples = [1, 2, 3, 4, 5].map(x => ({ x: x, y: 0 }));
        const res = search.range(samples, 1.9, 4.1);
        expect(res).to.deep.equal({ first: 0, last: 4 });
    });
});
