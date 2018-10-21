/* eslint-env mocha */
import chai from 'chai';
import TouchAccurateZoomer from '../../src/zoomers/TouchAccurateZoomer';

chai.use(require('chai-roughly'));

const expect = chai.expect;
const zoomer = new TouchAccurateZoomer();

describe('zoom-touches', () => {
  it('should return original extent if shifts number !== 2', () => {
    const orignal = {
      x: [0, 10],
      y: [0, 10]
    };
    const params = {
      shifts: []
    };
    for (let i = 0; i < 4; i++) {
      if (i !== 2) {
        const actual = zoomer.getExtent(orignal, params);
        expect(actual).to.roughly.deep.equal(orignal);
      }
      params.shifts.push({ x1: 0, y1: 0, x2: 1, y2: 1 });
    }
  });

  it('should zoom-in horizontally (one point moved)', () => {
    const orignal = {
      x: [0, 10],
      y: [0, 10]
    };
    const params = {
      shifts: [
        { x1: 0.1, y1: 0.1, x2: 0.1, y2: 0.1 },
        { x1: 0.2, y1: 0.1, x2: 0.3, y2: 0.1 }
      ]
    };
    const expected = {
      x: [0.5, 5.5],
      y: [0, 10]
    };
    const actual = zoomer.getExtent(orignal, params);
    expect(actual).to.roughly.deep.equal(expected);
  });

  it('should zoom-out horizontally (one point moved)', () => {
    const orignal = {
      x: [0, 10],
      y: [0, 10]
    };
    const params = {
      shifts: [
        { x1: 0.1, y1: 0.1, x2: 0.1, y2: 0.1 },
        { x1: 0.3, y1: 0.1, x2: 0.2, y2: 0.1 }
      ]
    };
    const expected = {
      x: [-1, 19],
      y: [0, 10]
    };
    const actual = zoomer.getExtent(orignal, params);
    expect(actual).to.roughly.deep.equal(expected);
  });

  it('should zoom-in vertically (one point moved)', () => {
    const orignal = {
      x: [0, 10],
      y: [0, 10]
    };
    const params = {
      shifts: [
        { x1: 0.1, y1: 0.2, x2: 0.1, y2: 0.3 },
        { x1: 0.1, y1: 0.1, x2: 0.1, y2: 0.1 }
      ]
    };
    const expected = {
      x: [0, 10],
      y: [0.5, 5.5]
    };
    const actual = zoomer.getExtent(orignal, params);
    expect(actual).to.roughly.deep.equal(expected);
  });

  it('should zoom-out vertically (one point moved)', () => {
    const orignal = {
      x: [0, 10],
      y: [0, 10]
    };
    const params = {
      shifts: [
        { x1: 0.1, y1: 0.3, x2: 0.1, y2: 0.2 },
        { x1: 0.1, y1: 0.1, x2: 0.1, y2: 0.1 }
      ]
    };
    const expected = {
      x: [0, 10],
      y: [-1, 19]
    };
    const actual = zoomer.getExtent(orignal, params);
    expect(actual).to.roughly.deep.equal(expected);
  });
});
