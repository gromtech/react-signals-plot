function getNearestSampleIndex(samples, x, index) {
  let result = index;
  if (index > 0) {
    if (Math.abs(samples[index - 1].x - x) < Math.abs(samples[index].x - x)) {
      result = index - 1;
    }
  }
  if (index < (samples.length - 1)) {
    if (Math.abs(samples[index + 1].x - x) < Math.abs(samples[result].x - x)) {
      result = index + 1;
    }
  }
  return result;
}

/**
 * Binary search
 * @param {Object[]} samples - Series data
 * @param {number} samples[].x - X value
 * @param {number} samples[].y - Y value
 * @param {number} x - search
 * @return {number} nearest to x sample index
 */
function binary(samples, x) {
  let index = 0;
  if (Array.isArray(samples) && (samples.length > 1)) {
    let first = 0;
    let last = samples.length - 1;
    if (x <= samples[first].x) {
      index = first;
    } else if (x >= samples[last].x) {
      index = last;
    } else {
      let middle = 0;
      while (first < last) {
        middle = Math.floor((last + middle) / 2);
        if (samples[middle].x === x) {
          first = middle;
          last = middle;
        } else if (samples[middle].x < x) {
          first = middle + 1;
        } else {
          last = middle - 1;
        }
      }
      index = getNearestSampleIndex(samples, x, first);
    }
  } else {
    throw new Error('Samples should be an array');
  }
  return index;
}

/**
 * Get indexes of range which includes x values from x1 to x2
 * @param {Object[]} samples - Series data
 * @param {number} samples[].x - X value
 * @param {number} samples[].y - Y value
 * @param {number} x1 - search
 * @param {number} x2 - search
 * @return {Object} range
 */
function range(samples, x1, x2) {
  let first = binary(samples, x1);
  let last = binary(samples, x2);
  if ((first > 0) && (samples[first].x > x1)) {
    first--;
  }
  if ((last < (samples.length - 1)) && (samples[last].x < x2)) {
    last++;
  }
  return {
    first: first,
    last: last
  };
}

module.exports = {
  binary: binary,
  range: range
};
