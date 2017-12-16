import React from 'react';
import PropTypes from 'prop-types';
import './SignalsLegend.scss';

class SignalsLegend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signals: props.signals
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      signals: nextProps.signals
    });
  }

  onItemClick(signal) {
    if (this.props.onItemClick) {
      this.props.onItemClick(signal);
    }
  }

  renderItem(signal) {
    const color = signal.visible ? signal.color : 'lightgray';
    return (
      <div
        className="legend-signal"
        key={ `${signal.name}/${signal.color}` }
        onClick={ () => this.onItemClick(signal) }
      >
        <div className="legend-signal-color" style={ { background: color } } />
        <div className="legend-signal-text" style={ { color: color } }>
          { signal.name }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={ this.props.style } className="legend-container">
        {
          this.state.signals.map(signal => this.renderItem(signal))
        }
      </div>
    );
  }
}

SignalsLegend.propTypes = {
  style: PropTypes.object,
  signals: PropTypes.array,
  onItemClick: PropTypes.func
};

SignalsLegend.defaultProps = {
  style: null,
  signals: [],
  onItemClick: null
};

export default SignalsLegend;
