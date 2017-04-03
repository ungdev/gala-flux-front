import React from 'react';

import AppNavbar from "./partials/AppNavbar.jsx";
import AppFooter from "./partials/AppFooter.jsx";
import ErrorNotification from "./partials/ErrorNotification.jsx";
import SnackbarNotification from "./partials/SnackbarNotification.jsx";
import LoadingNotification from "./partials/LoadingNotification.jsx";

export default class App extends React.Component {

    render() {
        const style = {
            main: {
                position: 'fixed',
                top: '64px',
                bottom: '0px',
                width: '100%',
                overflow: 'auto',
            },
        };

        return (
            <div className="hideContainer">
                <ErrorNotification />
                <SnackbarNotification />
                <LoadingNotification />
                <AppNavbar />
                <main style={style.main}>
                    {this.props.children}
                </main>
                <AppFooter />
            </div>
        );
    }

}
