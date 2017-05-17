
import React from "react";
import ReactDOM from "react-dom";

// Sails lib
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
window.io = sailsIOClient(socketIOClient);
io.sails.autoConnect = false;

// TapEvent
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// material ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import themeConfiguration from 'config/theme';
const muiTheme = getMuiTheme(themeConfiguration);

// Font awesome
require('font-awesome/scss/font-awesome.scss');

// Configure sound manager
soundManager.setup({debugMode: false});

// Router
import router from 'router';
import { RouterProvider } from 'react-router5';

// Pages
import App from "components/App.jsx";

// constants
import * as constants from 'config/constants';

import jwtDecode from 'jwt-decode';

// actions and services
import WebSocketService from 'services/WebSocketService';
import SessionService from 'services/SessionService';

// Connect to websocket server
WebSocketService.connect();

// Render the app using router
ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <RouterProvider router={ router }>
            <App />
        </RouterProvider>
    </MuiThemeProvider>,
    document.getElementById('app')
);

// Init android interface
if (global.Android) {
    Android.setApiUri(constants.webSocketUri);

    // Add method that execute js code
    Android.navigate = (route, param) => {
        router.navigate(route, param);
    }
}

// Ask the user for permission to emit browser notifications
if ("Notification" in window) {
    Notification.requestPermission();
}
