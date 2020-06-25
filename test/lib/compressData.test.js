/* eslint-env mocha */
const { assert } = require('chai');
const { compressData } = require('../../src/lib/compress');

function getSample(x, y) {
    return {
        x: x,
        y: y
    };
}

describe('compressData', () => {
    it('should return compressed data', () => {
        const samples = [1, 2, 3, 4, 5].map((y, x) => getSample(x, y));
        const res = compressData(samples);
        assert.deepEqual(res, [samples[0], samples[3], samples[4]]);
    });
    it('should compressed data with equal Y values', () => {
        const samples = [1, 1, 1, 1, 1].map((y, x) => getSample(x, y));
        const res = compressData(samples);
        assert.deepEqual(res, [samples[0], samples[3], samples[4]]);
    });
});
