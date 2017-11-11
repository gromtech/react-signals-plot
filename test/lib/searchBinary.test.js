/* eslint-env mocha */
const chai = require('chai');
const search = require('../../src/lib/search');

const expect = chai.expect;

describe('search.binary', () => {
  it('should return middle index (odd array)', () => {
    const samples = [1, 2, 3, 4, 5].map(x => ({ x: x, y: 0 }));
    const res = search.binary(samples, 3);
    expect(res).to.equal(2);
  });

  it('should return middle index (even array)', () => {
    const samples = [1, 2, 3, 4, 5, 6].map(x => ({ x: x, y: 0 }));
    const res = search.binary(samples, 4);
    expect(res).to.equal(3);
  });

  it('should return first index', () => {
    const samples = [1, 2, 3, 4, 5, 6, 7].map(x => ({ x: x, y: 0 }));
    const res = search.binary(samples, 0);
    expect(res).to.equal(0);
  });

  it('should return last index', () => {
    const samples = [1, 2, 3, 4, 5, 6, 7].map(x => ({ x: x, y: 0 }));
    const res = search.binary(samples, 8);
    expect(res).to.equal(6);
  });

  it('should return nearest sample index', () => {
    const samples = [1, 2, 3, 4, 5, 6, 7].map(x => ({ x: x, y: 0 }));
    const res = search.binary(samples, 4.1);
    expect(res).to.equal(3);
  });
});
