import Zoomer from './Zoomer';

class DefaultZoomer extends Zoomer {
    getZoomedByWheel(extent, params) {
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

    getZoomedByTouches(extent, params) {
        let zoomed = extent;
        if (extent && params && Array.isArray(params.shifts)) {
            const shifts = params.shifts;
            if (shifts.length === 2) {
                zoomed = {
                    x: this.getAxisBounds(extent.x[0], extent.x[1], shifts[0].x1, shifts[0].x2,
                        shifts[1].x1, shifts[1].x2, 8),
                    y: this.getAxisBounds(extent.y[0], extent.y[1], shifts[0].y1, shifts[0].y2,
                        shifts[1].y1, shifts[1].y2, 8),
                };
            }
        }
        return zoomed;
    }

    getAxisBounds(left, right, origin0, target0, origin1, target1, expandCoefficient) {
        const delta = Math.abs(origin0 - origin1) - Math.abs(target0 - target1);
        const scale = Math.pow(expandCoefficient || 2, delta);

        const length0 = right - left;
        const center0 = (origin0 + origin1) / 2;
        const value0 = left + length0 * center0;
        const center1 = (target0 + target1) / 2;

        const length1 = length0 * scale;
        const left1 = value0 - length1 * center1;
        const right1 = left1 + length1;

        return [left1, right1];
    }

    getZoomedByRect(extent, params) {
        let zoomed = extent;
        if (extent && params && params.rect) {
            const lenX = extent.x[1] - extent.x[0];
            const lenY = extent.y[1] - extent.y[0];
            zoomed = {
                x: [
                    extent.x[0] + lenX * params.rect.minX,
                    extent.x[0] + lenX * params.rect.maxX,
                ],
                y: [
                    extent.y[0] + lenY * params.rect.minY,
                    extent.y[0] + lenY * params.rect.maxY,
                ]
            };
        }
        return zoomed;
    }
}

export default DefaultZoomer;
