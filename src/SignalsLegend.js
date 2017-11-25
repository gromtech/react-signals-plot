import React from 'react';
import PropTypes from 'prop-types';
import './SignalsLegend.scss';

function createLegendItem(signal) {
  return (
    <div className="legend-signal" key={ `${signal.name}/${signal.color}` }>
      <div className="legend-signal-color" style={ { background: signal.color } } />
      <div className="legend-signal-text">{ signal.name }</div>
    </div>
  );
}

class SignalsLegend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signals: props.signals
    };
  }

  render() {
    return (
      <div style={ this.props.style } className="legend-container">
        {
          this.state.signals.map(signal => createLegendItem(signal))
        }
      </div>
    );
  }
}

SignalsLegend.propTypes = {
  style: PropTypes.object,
  signals: PropTypes.array
};

SignalsLegend.defaultProps = {
  style: null,
  signals: []
};

export default SignalsLegend;
