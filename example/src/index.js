import React from 'react';
import ReactDOM from 'react-dom';
/* eslint-disable import/no-extraneous-dependencies */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { AppBar, IconButton, SvgIcon } from 'material-ui';
/* eslint-enable import/no-extraneous-dependencies */
import ReactSignalsPlot from '../../src/ReactSignalsPlot';
import series from '../series/sin';

injectTapEventPlugin();

const GitHubIcon = props => (
  <SvgIcon { ...props }>
    {
      /* eslint-disable max-len */
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
      />
      /* eslint-enable max-len */
    }
  </SvgIcon>
);

function getAppBar() {
  const rightButton = (
    <IconButton
      href="https://github.com/gromtech/react-signals-plot"
    >
      <GitHubIcon />
    </IconButton>
  );
  return (
    <AppBar
      title="react-signals-plot"
      showMenuIconButton={ false }
      iconElementRight={ rightButton }
    />
  );
}

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
      <div style={ { textAlign: 'left', paddingTop: 10, paddingLeft: 10 } }>
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
      <MuiThemeProvider>
        <div style={ { width: '100%', height: '100%' } }>
          { getAppBar() }
          { this.renderToolbar() }
          <ReactSignalsPlot
            style={ { width: '100%', height: 'calc(100% - 120px)' } }
            data={ this.state.series.data }
            samplesLimit={ 100 }
            labels={ this.state.series.labels }
            interactive={ interactive }
          />
          <div className="footer">
            Roman Guseinov, 2017
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
