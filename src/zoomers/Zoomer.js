/* eslint "no-unused-vars": "off" */

class Zoomer {
    constructor() {
        if (new.target === Zoomer) {
            throw new TypeError("Cannot create an abstract Zoomer instance.");
        }
    }

    getZoomedByWheel(extent, params) {
        throw new TypeError("Abstract method getZoomedByWheel can not be executed.");
    }

    getZoomedByTouches(extent, params) {
        throw new TypeError("Abstract method getZoomedByTouches can not be executed.");
    }

    getZoomedByRect(extent, params) {
        throw new TypeError("Abstract method getZoomedByRect can not be executed.");
    }

    /**
     * Get zoomed extent
     * @param {Object} extent - extent
     * @param {Object} params -params
     * @return {Object} extent
     */
    getExtent(extent, params) {
        let zoomed = extent;
        if (params) {
            if (params.value) {
                zoomed = this.getZoomedByWheel(extent, params);
            } else if (Array.isArray(params.shifts)) {
                zoomed = this.getZoomedByTouches(extent, params);
            } else if (params.rect) {
                zoomed = this.getZoomedByRect(extent, params);
            }
        }
        return zoomed;
    }
}

export default Zoomer;
