function getMinMax(data, index) {
  let last = index + 4;
  if (last > data.length) {
    last = data.length;
  }
  const blockSize = last - index;
  let minmax = [];
  if (blockSize < 3) {
    for (let i = index; i < last; i++) {
      minmax.push(data[i]);
    }
  } else {
    let min = data[index];
    let max = data[index];
    for (let i = index + 1; i < last; i++) {
      if (data[i].y < min.y) {
        min = data[i];
      }
      if (data[i].y >= max.y) {
        max = data[i];
      }
    }
    if (min.x < max.x) {
      minmax = [min, max];
    } else {
      minmax = [max, min];
    }
  }
  return minmax;
}

/**
 * Compress block of 4 samples
 * @param {Object[]} data - Series data
 * @param {number} data[].x - X value
 * @param {number} data[].y - Y value
 * @param {number} index - First index of block
 */
function compressBlock(data, index) {
  let compressed = [];
  if (Array.isArray(data)) {
    const len = data.length;
    if (len > 4) {
      compressed = getMinMax(data, index);
      if (compressed.length == 2) {
        if ((index === 0) && (compressed[0].x > data[0].x)) {
          compressed.unshift(data[0]);
        } else if (((index + 4) >= len) && (compressed[1].x < data[len - 1].x)) {
          compressed.push(data[len - 1]);
        }
      }
    } else {
      compressed = data;
    }
  } else {
    throw new Error('Incorrect input data type for compressBlock function');
  }
  return compressed;
}

/**
 * Compress samples
 * @param {Object[]} samples - Series data
 * @param {number} samples[].x - X value
 * @param {number} samples[].y - Y value
 */
function compressData(samples) {
  let compressed = [];
  if (Array.isArray(samples)) {
    if (samples.length > 4) {
      let index = 0;
      while (index < samples.length) {
        const compressedBlock = compressBlock(samples, index);
        compressedBlock.forEach(sample => compressed.push(sample));
        index += 4;
      }
    } else {
      compressed = samples;
    }
  } else {
    throw new Error('Samples should be an array');
  }
  return compressed;
}

module.exports = {
  compressBlock: compressBlock,
  compressData: compressData
};
