import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

// TapEvent
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// material ui
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import themeConfiguration from 'config/theme';
const theme = createMuiTheme(themeConfiguration);

// Loading fonts
require('font-awesome/scss/font-awesome.scss');
require('typeface-roboto');

// Configure sound manager
import Sound from 'react-sound';
soundManager.setup({debugMode: false});

// Pages
import BootComponent from "app/Boot.jsx";

// Config
import * as constants from 'config/constants';
import routes from 'config/routes.jsx';

// actions and services
import WebSocketService from 'services/WebSocketService';
import SessionService from 'services/SessionService';

// Connect to websocket server
const websocket = new WebSocketService();

// Render the app using router
render((
    <MuiThemeProvider theme={theme}>
        <BootComponent>
            <Router history={browserHistory}>
                {routes}
            </Router>
        </BootComponent>
    </MuiThemeProvider>
), document.getElementById('app'));



// Init android interface
if (global.Android) {
    Android.setApiUri(constants.webSocketUri);

    // Add method that execute js code
    Android.navigate = (route, param) => {
        // browserHistory.push(route, param); // TODO fix
    }
}

// Ask the user for permission to emit browser notifications
if ("Notification" in window) {
    Notification.requestPermission();
}
