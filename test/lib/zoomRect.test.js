/* eslint-env mocha */
const chai = require('chai');
const zoom = require('../../src/lib/zoom');

const expect = chai.expect;

describe('zoom-rect', () => {
  it('should zoom-in', () => {
    const orignal = {
      x: [10, 20],
      y: [20, 30]
    };
    const params = {
      rect: {
        minX: 0.1,
        maxX: 0.9,
        minY: 0.1,
        maxY: 0.5
      }
    };
    const expected = {
      x: [11, 19],
      y: [21, 25],
    };
    const actual = zoom.getExtent(orignal, params);
    expect(actual).to.deep.equal(expected);
  });
});
