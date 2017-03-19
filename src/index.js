import React from "react";
import ReactDOM from "react-dom";

import { browserHistory, Router, Route, IndexRoute } from 'react-router';

// Pages
import App from "./components/App.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import BarPage from "./components/pages/BarPage.jsx";
import LogPage from "./components/pages/LogPage.jsx";

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="bar" component={BarPage} />
            <Route path="log" component={LogPage} />
        </Route>
    </Router>,
    document.getElementById('app')
);