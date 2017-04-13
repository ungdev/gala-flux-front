import React from "react";
import ReactDOM from "react-dom";

// TapEvent
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// material ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import themeConfiguration from './config/theme';
const muiTheme = getMuiTheme(themeConfiguration);

// Router
import router from './router';
import { RouterProvider } from 'react-router5';

// Pages
import App from "./components/App.jsx";

// constants
import * as constants from './config/constants';

import jwtDecode from 'jwt-decode';

// actions and services
import WebSocketService from './services/WebSocketService';

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
            console.log('JWT Decode error:', e);
            localStorage.removeItem(constants.jwtName);
            replace('/');
            return callback();
        }
    }
    else {
        replace('/');
    }
}
