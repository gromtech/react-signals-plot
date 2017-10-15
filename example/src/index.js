import React from 'react';
import ReactDOM from 'react-dom';
import ReactSignalsPlot from '../../src/ReactSignalsPlot';
import series from '../series/simple';

class App extends React.Component {
  render() {
    return (
      <div>
        <ReactSignalsPlot
          style={ { width: '100%', height: 250 } }
          data={ series.data }
          labels={ series.labels }
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
