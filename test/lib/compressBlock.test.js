/* eslint-env mocha */
const { assert } = require('chai');
const { compressBlock } = require('../../src/lib/compress');

function getSample(x, y) {
    return {
        x: x,
        y: y
    };
}

describe('compressBlock', () => {
    it('should return input samples if length less or equal 4', () => {
        const samples = [1, 2, 3, 4].map(value => getSample(value, value));
        const data = [];
        for (let i = 0; i <= 4; i++) {
            if (i > 0) {
                data.push(samples[i - 1]);
            }
            const res = compressBlock(data, 0);
            assert.deepEqual(res, data, `lenght should be ${i}`);
        }
    });

    it('should return min and max values of block', () => {
        const samples = [1, 2, 3, 4, 5].map(value => getSample(value, value));
        const res = compressBlock(samples, 0);
        assert.deepEqual(res, [samples[0], samples[3]]);
    });

    it('should return max value first', () => {
        const samples = [5, 4, 3, 2, 1].map((y, x) => getSample(x, y));
        const res = compressBlock(samples, 0);
        assert.deepEqual(res, [samples[0], samples[3]]);
    });

    it('should return first sample', () => {
        const samples = [3, 2, 3, 4, 5].map((y, x) => getSample(x, y));
        const res = compressBlock(samples, 0);
        assert.deepEqual(res, [samples[0], samples[1], samples[3]]);
    });

    it('should return last sample', () => {
        const samples = [1, 2, 3, 4, 3].map((y, x) => getSample(x, y));
        const res = compressBlock(samples, 1);
        assert.deepEqual(res, [samples[1], samples[3], samples[4]]);
    });

    it('should return all block samples if length less then 3', () => {
        const samples = [1, 2, 3, 4, 5].map((y, x) => getSample(x, y));
        const res = compressBlock(samples, 3);
        assert.deepEqual(res, [samples[3], samples[4]]);
    });
});
