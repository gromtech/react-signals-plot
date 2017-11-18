const MIN_DISTANCE = 0.01;

function getZoomedByWheel(extent, params) {
  let xLen = extent.x[1] - extent.x[0];
  let yLen = extent.y[1] - extent.y[0];
  const x0 = (params.x * xLen) + extent.x[0];
  const y0 = (params.y * yLen) + extent.y[0];
  xLen *= params.value;
  yLen *= params.value;

  const x1 = x0 - (xLen * params.x);
  const x2 = x1 + xLen;
  const y1 = y0 - (yLen * params.y);
  const y2 = y1 + yLen;
  return {
    x: [x1, x2],
    y: [y1, y2]
  };
}

function horizontalZoomEnabled(shifts) {
  let enabled = true;
  if (Math.abs(shifts[0].x - shifts[1].x) < MIN_DISTANCE) {
    enabled = false;
  }
  return enabled;
}

function vertivalZoomEnabled(shifts) {
  let enabled = true;
  if (Math.abs(shifts[0].y - shifts[1].y) < MIN_DISTANCE) {
    enabled = false;
  }
  return enabled;
}

function getRange(value1, value2) {
  let min = value1;
  let max = value2;
  if (value1 > value2) {
    min = value2;
    max = value1;
  }
  return {
    min: min - MIN_DISTANCE,
    max: max + MIN_DISTANCE
  };
}

function zoomHorizontally(extent, x0, x1, x2) {
  const { min, max } = getRange(x1, x2);
  let zoomed = extent;
  if ((x0 < min) || (x0 > max)) {
    const scale = Math.abs((x1 - x0) / (x2 - x0));
    const len = (extent.x[1] - extent.x[0]) * scale;
    const point = (extent.x[1] - extent.x[0]) * x1 + extent.x[0];
    const minX = point - len * x2;
    zoomed = {
      x: [minX, minX + len],
      y: extent.y
    };
  }
  return zoomed;
}

function zoomVertically(extent, y0, y1, y2) {
  const { min, max } = getRange(y1, y2);
  let zoomed = extent;
  if ((y0 < min) || (y0 > max)) {
    const scale = Math.abs((y1 - y0) / (y2 - y0));
    const len = (extent.y[1] - extent.y[0]) * scale;
    const point = (extent.y[1] - extent.y[0]) * y1 + extent.y[0];
    const minY = point - len * y2;
    zoomed = {
      x: extent.x,
      y: [minY, minY + len]
    };
  }
  return zoomed;
}

function getZoomedByTouches(extent, params) {
  let zoomed = extent;
  if (extent && params && Array.isArray(params.shifts)) {
    const shifts = params.shifts;
    if (shifts.length === 2) {
      const canZoomHorizontally = horizontalZoomEnabled(shifts);
      const canZoomVertically = vertivalZoomEnabled(shifts);
      shifts.forEach((shift, index) => {
        if (canZoomHorizontally && (Math.abs(shift.x1 - shift.x2) > 0.00001)) {
          const x0 = shifts[1 - index].x1;
          zoomed = zoomHorizontally(zoomed, x0, shift.x1, shift.x2);
        }
        if (canZoomVertically && (Math.abs(shift.y1 - shift.y2) > 0.00001)) {
          const y0 = shifts[1 - index].y1;
          zoomed = zoomVertically(zoomed, y0, shift.y1, shift.y2);
        }
      });
    }
  }
  return zoomed;
}

/**
 * Get zoomed extent
 * @param {Object} extent - extent
 * @param {Object} params -params
 * @return {Object} extent
 */
function getZoomedExtent(extent, params) {
  let zoomed = extent;
  if (params) {
    if (params.value) {
      zoomed = getZoomedByWheel(extent, params);
    } else if (Array.isArray(params.shifts)) {
      zoomed = getZoomedByTouches(extent, params);
    }
  }
  return zoomed;
}

module.exports = {
  getExtent: getZoomedExtent
};
