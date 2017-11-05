const data = [];

const names = ['EX', 'EY'];

names.forEach((name, idx) => {
  const signal = {
    id: name,
    values: []
  };
  for (let i = 0; i < 1000; i++) {
    signal.values.push({
      x: i,
      y: Math.sin(0.1*i*(idx + 1) / Math.PI + idx*2)
    });
  }
  data.push(signal);
});

export default {
  data: data,
  labels: {
    x: 'T, s',
    y: 'EMF, V'
  }
};
