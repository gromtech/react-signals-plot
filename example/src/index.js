import React from 'react';
import ReactDOM from 'react-dom';
/* eslint-disable import/no-extraneous-dependencies */
import { ThemeProvider as MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
/* eslint-enable import/no-extraneous-dependencies */
import ReactSignalsPlot from '../../src/ReactSignalsPlot';
import sinSeries from '../series/sin';
import packageJson from '../../package.json';

const muiTheme = createMuiTheme({
    palette: {
        primary1Color: blue[500],
        primary2Color: blue[700]
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
            series: sinSeries(size),
            settingsUpdating: false,
            zoomByRect: false
        };
    }

    resizeData(size) {
        this.setState({
            settingsUpdating: true,
            size: size
        });
        setTimeout(() => {
            this.setState({
                series: sinSeries(size),
                settingsUpdating: false
            });
        });
    }

    getDataSizeControl() {
        const { size, settingsUpdating } = this.state;

        return (
            <div>
                <InputLabel id="number-of-points-label">Number of points</InputLabel>
                <SelectField
                    style={ { width: '100%' } }
                    labelId="number-of-points-label"
                    value={ size }
                    disabled={ settingsUpdating }
                    onChange={ event => this.resizeData(event.target.value) }
                >
                    <MenuItem value={ 1000 }>1000</MenuItem>
                    <MenuItem value={ 10000 }>10000</MenuItem>
                    <MenuItem value={ 100000 }>100000</MenuItem>
                    <MenuItem value={ 1000000 }>1000000</MenuItem>
                </SelectField>
            </div>
        );
    }

    getSamplesLimitControl() {
        const { samplesLimit, settingsUpdating } = this.state;

        return (
            <div>
                <InputLabel id="number-of-visible-label">Number of visible points</InputLabel>
                <SelectField
                    style={ { width: '100%' } }
                    labelId="number-of-visible-label"
                    value={ samplesLimit }
                    disabled={ settingsUpdating }
                    onChange={ event => this.setState({ samplesLimit: event.target.value }) }
                >
                    <MenuItem value={ 100 }>100</MenuItem>
                    <MenuItem value={ 500 }>500</MenuItem>
                    <MenuItem value={ 1000 }>1000</MenuItem>
                    <MenuItem value={ 2000 }>2000</MenuItem>
                </SelectField>
            </div>
        );
    }

    getZoomControl() {
        const { zoomByRect, settingsUpdating } = this.state;

        return (
            <Checkbox
                label="Zoom by rect (click events)"
                checked={ zoomByRect }
                onChange={ event => this.setState({ zoomByRect: event.target.checked }) }
                disabled={ settingsUpdating }
            />
        );
    }

    renderDrawer() {
        const { openDrawer } = this.state;

        return (
            <Drawer
                anchor="left"
                width={ 300 }
                open={ openDrawer }
                onClose={ () => this.setState({ openDrawer: false }) }
            >
                <AppBar position="static" style={ { height: 64 } }>
                    <Typography variant="h6" style={ { flexGrow: 1 } }>Settings</Typography>
                </AppBar>
                <div style={ { textAlign: 'left', padding: 10 } }>
                    {this.getDataSizeControl()}
                    {this.getSamplesLimitControl()}
                    {this.getZoomControl()}
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
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={ () => this.setState({ openDrawer: true }) }
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={ { flexGrow: 1 } }>
                        {`react-signals-plot ${packageJson.version}`}
                    </Typography>
                    {rightButton}
                </Toolbar>
            </AppBar>
        );
    }

    render() {
        const interactive = true;
        const { series, zoomByRect, samplesLimit } = this.state;
        return (
            <MuiThemeProvider theme={ muiTheme }>
                <div style={ { width: '100%', height: '100%', overflow: 'hidden' } }>
                    {this.getAppBar()}
                    {this.renderDrawer()}
                    <ReactSignalsPlot
                        style={ { width: '100%', height: 'calc(100% - 120px)' } }
                        data={ series.data }
                        samplesLimit={ samplesLimit }
                        labels={ series.labels }
                        interactive={ interactive }
                        zoomByRect={ zoomByRect }
                    />
                    <div className="footer" style={ { paddingTop: 20 } }>
                        Roman Guseinov, 2020
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
