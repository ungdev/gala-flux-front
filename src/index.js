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

// constants
import * as constants from './config/constants';

// actions and services
import AuthService from './services/AuthService';
import AuthActions from './actions/AuthActions';

// This code is executed when the app is loaded
// So if there is a jwt in the localStorage, try to authenticate the webSocket connexion
AuthService.tryToAuthenticateConnexion(localStorage.getItem(constants.jwtName));

// Render the app using react router
ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={HomePage} />
                <Route path="bar" component={BarPage} onEnter={requireAuth}/>
                <Route path="log" component={LogPage} onEnter={requireAuth}/>
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
    // if there is a JWT in the localStorage, continue
    if (localStorage.getItem(constants.jwtName)) {
        return callback();
    }
    // if there is no JWT, send a request to the server in order to try
    // to authenticate the user by his IP address
    AuthService.checkIpAddress(
        success => {
            // save the JWT. Now the User can access the route.
            AuthActions.saveJWT(success.body.jwt);
            return callback();
        },
        error => {
            // if the IP address is not valid, redirect him to the home page
            // so he can login with EtuUTT
            replace('/');
            return callback();
        }
    );
}
