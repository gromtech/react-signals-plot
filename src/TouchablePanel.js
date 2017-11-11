import React from 'react';
import PropTypes from 'prop-types';

class TouchablePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp.bind(this));
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }

  getCoordinates(event) {
    let coordinates = null;
    if (this.container) {
      const { clientX, clientY } = event;
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

      coordinates = {
        x: x,
        y: y
      };
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
    this.mouseDownCoords = this.getCoordinates(event);
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
