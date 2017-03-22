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

ReactDOM.render(
    <MuiThemeProvider>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={HomePage} />
                <Route path="bar" component={BarPage} onEnter={AuthService.requireAuth}/>
                <Route path="log" component={LogPage} onEnter={AuthService.requireAuth}/>
            </Route>
        </Router>
    </MuiThemeProvider>,
    document.getElementById('app')
);