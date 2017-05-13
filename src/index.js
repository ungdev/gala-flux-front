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

// Check if there is a Firebase token in the url parameters
SessionService.getFirebaseToken();

// Render the app using router
ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <RouterProvider router={ router }>
            <App />
        </RouterProvider>
    </MuiThemeProvider>,
    document.getElementById('app')
);

/**
 * Check if the user is authenticated
 * used to protect some routes
 *
 * Parameters are from react-router (onEnter prop)
 *
 * @param nextState
 * @param replace
 * @param callback
 * @returns callback
 */
function requireAuth (nextState, replace, callback) {
    // if there is a valid JWT in the localStorage, continue
    let jwt = localStorage.getItem(constants.jwtName);
    if(jwt) {
        try {
            jwtDecode(jwt);
            return callback();
        } catch (e) {
            console.error('JWT Decode error:', e);
            localStorage.removeItem(constants.jwtName);
            replace('/');
            return callback();
        }
    }
    else {
        replace('/');
    }
}
