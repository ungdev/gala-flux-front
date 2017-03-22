import React from "react";
import ReactDOM from "react-dom";

import { browserHistory, Router, Route, IndexRoute } from 'react-router';

import AuthService from './services/AuthService';

// material ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Pages
import App from "./components/App.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import BarPage from "./components/pages/BarPage.jsx";
import LogPage from "./components/pages/LogPage.jsx";

/**
 * Check if there is a JWT token in the localStorage
 * Redirect to the root if not
 *
 * @param nextState
 * @param replace
 * @param callback
 * @returns {*}
 */
function requireAuth (nextState, replace, callback) {
    // if there is a token, continue
    console.log('check token');
    if (AuthService.isAuthenticated()) {
        return callback();
    }
    // if there is no token, check the IP address
    console.log('check ip address');
    AuthService.checkIpAddress(resp => {
        console.log(resp);
        AuthService.saveJWT('fakejwt');
        return callback();
    }, error => {
        console.log("error : ", error);
        replace('/');
        return callback();
    });
}

ReactDOM.render(
    <MuiThemeProvider>
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