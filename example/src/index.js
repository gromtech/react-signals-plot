import React from 'react';
import ReactDOM from 'react-dom';
import ReactSignalsPlot from '../../src/ReactSignalsPlot';
import series from '../series/sin';

class App extends React.Component {
  render() {
    return (
      <ReactSignalsPlot
        style={ { width: '100%', height: 250 } }
        data={ series.data }
        samplesLimit={ 300 }
        labels={ series.labels }
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
