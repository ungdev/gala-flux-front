import React from "react";
import ReactDOM from "react-dom";

import { browserHistory, Router, Route, IndexRoute } from 'react-router';

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
    const token = localStorage.getItem('@token');
    if (!token) replace('/');
    return callback();
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="bar" component={BarPage} onEnter={requireAuth}/>
            <Route path="log" component={LogPage} onEnter={requireAuth}/>
        </Route>
    </Router>,
    document.getElementById('app')
);