function getSeries(size) {
    const data = [];
    const names = ['EX', 'EY'];

    names.forEach((name, idx) => {
        const signal = {
            id: name,
            values: []
        };
        for (let i = 0; i < size; i++) {
            const t = 10000 * i / size;
            let y = Math.sin(((0.01 * t * (idx + 1)) / Math.PI) + (idx * 2));
            y += 0.5 * Math.sin(((0.02 * t * (idx + 1)) / Math.PI) + (idx * 2));
            y += 0.25 * Math.sin(((0.08 * t * (idx + 1)) / Math.PI) + (idx * 2));
            signal.values.push({
                x: i,
                y: y
            });
        }
        data.push(signal);
    });

    return {
        data: data,
        labels: {
            x: 'T, s',
            y: 'EMF, V'
        }
    };
}

export default getSeries;
