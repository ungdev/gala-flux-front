import React from 'react';

import AppNavbar from "./partials/AppNavbar.jsx";
import AppFooter from "./partials/AppFooter.jsx";
import ErrorNotification from "./partials/ErrorNotification.jsx";
import SnackbarNotification from "./partials/SnackbarNotification.jsx";
import LoadingNotification from "./partials/LoadingNotification.jsx";
require('../styles/App.scss');

export default class App extends React.Component {

    render() {

        return (
            <div className="hide-container">
                <ErrorNotification />
                <SnackbarNotification />
                <LoadingNotification />
                <AppNavbar />
                <main className="main">
                    {this.props.children}
                </main>
                <AppFooter />
            </div>
        );
    }
}
