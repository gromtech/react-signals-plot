import React from 'react';
import ReactDOM from 'react-dom';
/* eslint-disable import/no-extraneous-dependencies */
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { blue500, blue700 } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
/* eslint-enable import/no-extraneous-dependencies */
import ReactSignalsPlot from '../../src/ReactSignalsPlot';
import series from '../series/sin';
import packageJson from '../../package.json';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue500,
    primary2Color: blue700
  }
});

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

class App extends React.Component {
  constructor(props) {
    super(props);
    const size = 10000;
    this.state = {
      size: size,
      samplesLimit: 100,
      series: series(size),
      settingsUpdating: false,
      zoomByRect: false
    };
  }

  onSizeChanged(event) {
    this.setState({
      size: event.target.value
    });
  }

  resizeData(size) {
    this.setState({
      settingsUpdating: true,
      size: size
    });
    setTimeout(() => {
      this.setState({
        series: series(size),
        settingsUpdating: false
      });
    });
  }

  getDataSizeControl() {
    return (
      <SelectField
        style={ { width: '100%' } }
        floatingLabelText="Number of points"
        value={ this.state.size }
        disabled={ this.state.settingsUpdating }
        onChange={ (event, index, value) => this.resizeData(value) }
      >
        <MenuItem value={ 1000 } primaryText="1000" />
        <MenuItem value={ 10000 } primaryText="10000" />
        <MenuItem value={ 100000 } primaryText="100000" />
        <MenuItem value={ 1000000 } primaryText="1000000" />
      </SelectField>
    );
  }

  getSamplesLimitControl() {
    return (
      <SelectField
        style={ { width: '100%' } }
        floatingLabelText="Number of visible points"
        value={ this.state.samplesLimit }
        disabled={ this.state.settingsUpdating }
        onChange={ (event, index, value) => this.setState({ samplesLimit: value }) }
      >
        <MenuItem value={ 100 } primaryText="100" />
        <MenuItem value={ 500 } primaryText="500" />
        <MenuItem value={ 1000 } primaryText="1000" />
        <MenuItem value={ 2000 } primaryText="2000" />
      </SelectField>
    );
  }

  getZoomControl() {
    return (
      <Checkbox
        label="Zoom by rect (click events)"
        checked={ this.state.zoomByRect }
        onCheck={ event => this.setState({ zoomByRect: event.target.checked }) }
        disabled={ this.state.settingsUpdating }
      />
    );
  }

  renderDrawer() {
    return (
      <Drawer
        docked={ false }
        width={ 300 }
        open={ this.state.openDrawer }
        onRequestChange={ open => this.setState({ openDrawer: open }) }
      >
        <AppBar
          title="Settings"
          showMenuIconButton={ false }
        />
        <div style={ { textAlign: 'left', padding: 10 } }>
          { this.getDataSizeControl() }
          { this.getSamplesLimitControl() }
          { this.getZoomControl() }
        </div>
      </Drawer>
    );
  }

  getAppBar() {
    const rightButton = (
      <IconButton
        href="https://github.com/gromtech/react-signals-plot"
      >
        <GitHubIcon />
      </IconButton>
    );
    return (
      <AppBar
        title={ `react-signals-plot ${packageJson.version}` }
        iconElementRight={ rightButton }
        onLeftIconButtonTouchTap={ () => this.setState({ openDrawer: true }) }
      />
    );
  }

  render() {
    const interactive = true;
    return (
      <MuiThemeProvider muiTheme={ muiTheme }>
        <div style={ { width: '100%', height: '100%', overflow: 'hidden' } }>
          { this.getAppBar() }
          { this.renderDrawer() }
          <ReactSignalsPlot
            style={ { width: '100%', height: 'calc(100% - 120px)' } }
            data={ this.state.series.data }
            samplesLimit={ this.state.samplesLimit }
            labels={ this.state.series.labels }
            interactive={ interactive }
            zoomByRect={ this.state.zoomByRect }
          />
          <div className="footer" style={ { paddingTop: 20 } }>
            Roman Guseinov, 2017
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
