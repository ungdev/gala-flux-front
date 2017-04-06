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

// react router
import { browserHistory, Router, Route, IndexRoute } from 'react-router';

// Pages
import App from "./components/App.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import BarPage from "./components/pages/BarPage.jsx";
import LogPage from "./components/pages/LogPage.jsx";
import TeamsPage from "./components/pages/TeamsPage.jsx";
import AlertPage from "./components/pages/AlertPage.jsx";
import BarrelsPage from "./components/pages/BarrelsPage.jsx";

// constants
import * as constants from './config/constants';

import jwtDecode from 'jwt-decode';

// actions and services
import WebSocketService from './services/WebSocketService';
import AuthService from './services/AuthService';
import AuthActions from './actions/AuthActions';
import NotificationActions from './actions/NotificationActions';

// Connect to websocket server
WebSocketService.connect();

// Render the app using react router
ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={HomePage} />
                <Route path="bar" component={BarPage} onEnter={requireAuth} />
                <Route path="log" component={LogPage} onEnter={requireAuth} />
                <Route path="teams" component={TeamsPage} onEnter={requireAuth} />
                <Route path="alert" component={AlertPage} onEnter={requireAuth} />
                <Route path="barrels" component={BarrelsPage} onEnter={requireAuth} />
            </Route>
        </Router>
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
