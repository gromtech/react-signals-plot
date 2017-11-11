import React from 'react';
import ReactDOM from 'react-dom';
import ReactSignalsPlot from '../../src/ReactSignalsPlot';
import series from '../series/sin';

class App extends React.Component {
  render() {
    const interactive = true;
    return (
      <ReactSignalsPlot
        style={ { width: '100%', height: 250 } }
        data={ series.data }
        samplesLimit={ 250 }
        labels={ series.labels }
        interactive={ interactive }
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
