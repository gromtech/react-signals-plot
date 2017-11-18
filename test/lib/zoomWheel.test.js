/* eslint-env mocha */
const chai = require('chai');
const zoom = require('../../src/lib/zoom');

const expect = chai.expect;

describe('zoom-wheel', () => {
  it('should zoom-in at center point', () => {
    const orignal = {
      x: [0, 10],
      y: [0, 10]
    };
    const params = { x: 0.5, y: 0.5, value: 0.5 };
    const expected = {
      x: [2.5, 7.5],
      y: [2.5, 7.5],
    };
    const actual = zoom.getExtent(orignal, params);
    expect(actual).to.deep.equal(expected);
  });

  it('should zoom-out at center point', () => {
    const orignal = {
      x: [0, 10],
      y: [0, 10]
    };
    const params = { x: 0.5, y: 0.5, value: 2 };
    const expected = {
      x: [-5, 15],
      y: [-5, 15],
    };
    const actual = zoom.getExtent(orignal, params);
    expect(actual).to.deep.equal(expected);
  });
});
