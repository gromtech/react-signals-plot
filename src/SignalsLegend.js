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
        const { onItemClick } = this.props;

        if (onItemClick) {
            onItemClick(signal);
        }
    }

    renderItem(signal) {
        const color = signal.visible ? signal.color : 'lightgray';
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
                className="legend-signal"
                key={ `${signal.name}/${signal.color}` }
                onClick={ () => this.onItemClick(signal) }
            >
                <div className="legend-signal-color" style={ { background: color } } />
                <div className="legend-signal-text" style={ { color: color } }>
                    {signal.name}
                </div>
            </div>
        );
    }

    render() {
        const { style } = this.props;
        const { signals } = this.state;

        return (
            <div style={ style } className="legend-container">
                {
                    signals.map(signal => this.renderItem(signal))
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
