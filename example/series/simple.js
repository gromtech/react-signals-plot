const data = [
  {
    id: 'EX',
    values: [
      { x: 1, y: 5 },
      { x: 2, y: 10 },
      { x: 3, y: 1 },
      { x: 4, y: 3 },
      { x: 5, y: 7 }
    ]
  },
  {
    id: 'EY',
    values: [
      { x: 1, y: 2 },
      { x: 2, y: 0 },
      { x: 3, y: 5 },
      { x: 4, y: 7 },
      { x: 5, y: 7 }
    ]
  }
];

export default {
  data: data,
  labels: {
    x: 'T, s',
    y: 'EMF, V'
  }
};
