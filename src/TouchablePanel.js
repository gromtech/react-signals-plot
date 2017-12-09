import React from 'react';
import PropTypes from 'prop-types';
import './TouchablePanel.scss';

class TouchablePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomByRect: props.zoomByRect,
      firstPoint: null, // zoom rect
      currentPoint: null // zoom rect
    };
    this.touches = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      zoomByRect: nextProps.zoomByRect
    });
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
    event.preventDefault();
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
      if (this.state.zoomByRect) {
        this.setState({
          firstPoint: {
            coordinates: this.getCoordinates(event)
          }
        });
      } else {
        this.mouseDownCoords = this.getCoordinates(event);
      }
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
    if (this.state.zoomByRect) {
      event.stopPropagation();
      event.preventDefault();
      const rect = this.getRect();
      this.setState({
        firstPoint: null,
        currentPoint: null
      });
      if (rect && this.props.onZoom) {
        if (rect.backward) {
          this.props.onZoom({ reset: true });
        } else {
          this.props.onZoom({ rect: rect });
        }
      }
    } else if (this.mouseDownCoords) {
      event.stopPropagation();
      event.preventDefault();
      this.mouseDownCoords = null;
    }
  }

  onMouseMove(event) {
    if (this.state.zoomByRect && this.state.firstPoint) {
      event.stopPropagation();
      event.preventDefault();
      this.setState({
        currentPoint: {
          coordinates: this.getCoordinates(event)
        }
      });
    } else if (this.mouseDownCoords) {
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

  getRect() {
    let rect = null;
    const { zoomByRect, firstPoint, currentPoint } = this.state;
    if (zoomByRect && firstPoint && currentPoint) {
      const p1 = firstPoint.coordinates;
      const p2 = currentPoint.coordinates;
      rect = {};
      if (p1.x < p2.x) {
        rect.minX = p1.x;
        rect.maxX = p2.x;
      } else {
        rect.backward = true;
        rect.minX = p2.x;
        rect.maxX = p1.x;
      }
      if (p1.y < p2.y) {
        rect.minY = p1.y;
        rect.maxY = p2.y;
      } else {
        rect.minY = p2.y;
        rect.maxY = p1.y;
      }
    }
    return rect;
  }

  renderZoomRect() {
    let zoomRect = null;
    const rect = this.getRect();
    if (rect) {
      const { height, width } = this.container.getBoundingClientRect();
      const style = {
        position: 'absolute',
        left: Math.round(width * rect.minX),
        right: Math.round(width * (1 - rect.maxX)),
        top: Math.round(height * (1 - rect.maxY)),
        bottom: Math.round(height * rect.minY)
      };
      zoomRect = (
        <div style={ style } className="chart-zoom-rect" />
      );
    }
    return zoomRect;
  }

  render() {
    return (
      <div
        ref={ c => this.setContainer(c) }
        style={ this.props.style }
        onWheel={ event => this.onMouseWheel(event) }
        onMouseDown={ event => this.onMouseDown(event) }
        onTouchStart={ event => this.onMouseDown(event) }
      >
        { this.renderZoomRect() }
      </div>
    );
  }
}

TouchablePanel.propTypes = {
  style: PropTypes.object,
  onMove: PropTypes.func,
  onZoom: PropTypes.func,
  zoomByRect: PropTypes.bool
};

TouchablePanel.defaultProps = {
  style: null,
  onMove: null,
  onZoom: null,
  zoomByRect: false
};

export default TouchablePanel;
