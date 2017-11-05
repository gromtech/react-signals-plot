import { compressData } from './lib/compress';

class DataSource {
  constructor(data, samplesLimit) {
    this.samplesLimit = samplesLimit;
    this.preprocess(data);
  }

  preprocess(data) {
    if (Array.isArray(data) && (data.length > 0)) {
      // eval compressed series
      this.raw = data;
      this.compressed = [data];
      let samples = data;
      while (samples.length > 4) {
        samples = compressData(samples);
        this.compressed.push(samples);
      }
      // eval extent
      let minX = null;
      let maxX = null;
      let minY = null;
      let maxY = null;
      data.forEach((sample) => {
        if ((minX === null) || (sample.x < minX)) {
          minX = sample.x;
        }
        if ((maxX === null) || (sample.x > maxX)) {
          maxX = sample.x;
        }
        if ((minY === null) || (sample.y < minY)) {
          minY = sample.y;
        }
        if ((maxY === null) || (sample.y > maxY)) {
          maxY = sample.y;
        }
      });
      this.extent = {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
      };
    } else {
      this.raw = [];
      this.compressed = [[]];
      this.extent = {
        minX: 0,
        maxX: 1,
        minY: 0,
        maxY: 1
      };
    }
  }

  getExtent() {
    return {
      x: [this.extent.minX, this.extent.maxX],
      y: [this.extent.minY, this.extent.maxY]
    }
  }

  getData(min, max) {
    // TODO use binary search
    let data = [];
    if ((!min) && (!max)) {
      for (let i = 0; i < this.compressed.length; i++) {
        const samples = this.compressed[i];
        if (samples.length <= this.samplesLimit) {
          data = samples;
          break;
        }
      }
    }
    return data;
  }
}

export default DataSource;
