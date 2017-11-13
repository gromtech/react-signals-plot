import React from 'react';
import ReactDOM from 'react-dom';
import ReactSignalsPlot from '../../src/ReactSignalsPlot';
import series from '../series/sin';

class App extends React.Component {
  constructor(props) {
    super(props);
    const size = 10000;
    this.state = {
      size: `${size}`,
      series: series(size),
      btnDisabled: false
    };
  }

  onSizeChanged(event) {
    this.setState({
      size: event.target.value
    });
  }

  resizeData() {
    let size = this.state.size;
    size = Number.parseInt(size, 10);
    if ((!isNaN(size)) && (size > 0) && (`${size}` === this.state.size)) {
      // size is correct
      console.log('resize', size);
      this.setState({
        btnDisabled: true
      });
      setTimeout(() => {
        this.setState({
          series: series(size),
          btnDisabled: false
        });
      });
    }
  }

  renderToolbar() {
    return (
      <div style={ { textAlign: 'left' } }>
        <span>Number of points:</span>
        <input
          type="text"
          size="8"
          style={ { marginLeft: 10 } }
          value={ this.state.size }
          onChange={ event => this.onSizeChanged(event) }
        />
        <button
          style={ { marginLeft: 10 } }
          disabled={ this.state.btnDisabled }
          onClick={ () => this.resizeData() }
        >
          SAVE
        </button>
      </div>
    );
  }

  render() {
    const interactive = true;
    return (
      <div>
        { this.renderToolbar() }
        <ReactSignalsPlot
          style={ { width: '100%', height: 250 } }
          data={ this.state.series.data }
          samplesLimit={ 100 }
          labels={ this.state.series.labels }
          interactive={ interactive }
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
