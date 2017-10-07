import React from 'react';
import ReactDOM from 'react-dom';
import ReactSignalsPlot from 'react-signals-plot';

const App = React.createClass({
  render() {
    return (
      <div>
        <ReactSignalsPlot />
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
