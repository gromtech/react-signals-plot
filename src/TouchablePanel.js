import React from 'react';
import PropTypes from 'prop-types';

class TouchablePanel extends React.Component {
  constructor(props) {
    super(props);
    this.touches = {};
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    window.addEventListener('touchend', this.onTouchEnd.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp.bind(this));
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('touchmove', this.onTouchMove.bind(this));
    window.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }

  getNormalizedCoordinates(clientX, clientY, id) {
    const rect = this.container.getBoundingClientRect();
    const { height, width } = rect;

    let x = clientX - rect.x;
    let y = clientY - rect.y;
    if (x < 0) {
      x = 0;
    } else if (x > width) {
      x = width;
    }

    if (y < 0) {
      y = 0;
    } else if (y > height) {
      y = height;
    }

    // invert Y
    y = height - y;

    // make relative coordinates
    x /= width;
    y /= height;

    return { x: x, y: y, id: id };
  }

  getCoordinates(event) {
    let coordinates = null;
    if (this.container) {
      const touches = event.changedTouches;
      if (touches && (touches.length > 0)) {
        // touch events
        coordinates = [];
        for (let i = 0; i < touches.length; i++) {
          const { clientX, clientY, identifier } = touches[i];
          if (identifier < 2) {
            coordinates.push(this.getNormalizedCoordinates(clientX, clientY, identifier));
          }
        }

        if (coordinates.length === 1) {
          coordinates = coordinates[0];
        }
      } else {
        // mouse events
        coordinates = this.getNormalizedCoordinates(event.clientX, event.clientY);
      }
    } else {
      throw new Error('Container not found.');
    }
    return coordinates;
  }

  onMouseWheel(event) {
    event.stopPropagation();
    const delta = event.deltaY || event.detail || event.wheelDelta;
    const zoom = Object.assign({}, this.getCoordinates(event), {
      value: delta < 0 ? 0.5 : 2
    });
    if (this.props.onZoom) {
      this.props.onZoom(zoom);
    }
  }

  onMouseDown(event) {
    if (event.type === 'touchstart') {
      this.onTouchStart(event);
    } else if (!this.isTouch) {
      this.mouseDownCoords = this.getCoordinates(event);
    }
  }

  onTouchStart(event) {
    this.isTouch = true;
    const coords = this.getCoordinates(event);
    if (coords.id < 2) {
      this.touches[coords.id] = coords;
    }
  }

  onTouchEnd(event) {
    if (event.changedTouches && event.changedTouches[0]) {
      const id = event.changedTouches[0].identifier;
      if (this.touches[id]) {
        delete this.touches[id];
      }
    }
  }

  onMouseUp() {
    if (this.mouseDownCoords) {
      this.mouseDownCoords = null;
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onMouseMove(event) {
    if (this.mouseDownCoords) {
      event.stopPropagation();
      event.preventDefault();
      const prev = this.mouseDownCoords;
      const current = this.getCoordinates(event);
      const shift = {
        x: current.x - prev.x,
        y: current.y - prev.y,
      };
      this.mouseDownCoords = current;
      if (this.props.onMove) {
        this.props.onMove(shift);
      }
    }
  }

  prepareShifts(newTouches) {
    const shiftsMap = {};
    Object.keys(this.touches).forEach((id) => {
      const { x, y } = this.touches[id];
      shiftsMap[id] = { x1: x, y1: y, x2: x, y2: y, id: id };
    });
    newTouches.forEach((touch) => {
      const shift = shiftsMap[touch.id];
      if (shift) {
        shift.x2 = touch.x;
        shift.y2 = touch.y;
        // update touch coordinates
        this.touches[touch.id] = touch;
      }
    });
    return Object.values(shiftsMap);
  }

  onTouchMove(event) {
    if (Object.keys(this.touches).length > 0) {
      event.stopPropagation();
      event.preventDefault();
      const coords = [].concat(this.getCoordinates(event));
      if (coords.length > 0) {
        const shifts = this.prepareShifts(coords);
        if (shifts.length === 1) {
          const shift = {
            x: shifts[0].x2 - shifts[0].x1,
            y: shifts[0].y2 - shifts[0].y1,
          };
          if (this.props.onMove) {
            this.props.onMove(shift);
          }
        } else if (this.props.onZoom) {
          this.props.onZoom({
            shifts: shifts
          });
        }
      }
    }
  }

  setContainer(container) {
    this.container = container;
  }

  render() {
    return (
      <div
        ref={ c => this.setContainer(c) }
        style={ this.props.style }
        onWheel={ event => this.onMouseWheel(event) }
        onMouseDown={ event => this.onMouseDown(event) }
        onTouchStart={ event => this.onMouseDown(event) }
      />
    );
  }
}

TouchablePanel.propTypes = {
  style: PropTypes.object,
  onMove: PropTypes.func,
  onZoom: PropTypes.func
};

TouchablePanel.defaultProps = {
  style: null,
  onMove: null,
  onZoom: null
};

export default TouchablePanel;
