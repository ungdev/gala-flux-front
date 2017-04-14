import React, { createElement } from 'react';

import AuthStore from "../stores/AuthStore";

import AppNavbar from "./partials/AppNavbar.jsx";
import AppFooter from "./partials/AppFooter.jsx";
import ErrorNotification from "./partials/ErrorNotification.jsx";
import SnackbarNotification from "./partials/SnackbarNotification.jsx";
import LoadingNotification from "./partials/LoadingNotification.jsx";

// homepages
import AdminHomepage from "./homepages/AdminHomepage.jsx";
import LoginHomepage from "./homepages/LoginHomepage.jsx";
import BarHomepage from "./homepages/BarHomepage.jsx";

import { BaseLink, withRoute } from 'react-router5';

require('../styles/App.scss');

export default class App extends React.Component {

        constructor(props) {
            super(props);

            this.state = {
                team: AuthStore.team,
                homepage: LoginHomepage,
            };

            this.router = props.router;

            // binding
            this._handleAuthStoreChange = this._handleAuthStoreChange.bind(this);
        }

        componentDidMount() {

            // listen the stores changes
            AuthStore.addChangeListener(this._handleAuthStoreChange);

            // init
            this._handleAuthStoreChange();

        }

        componentWillUnmount() {
            AuthStore.removeChangeListener(this._handleAuthStoreChange);
        }

        /**
         * Set the state with the new data of the store
         */
        _handleAuthStoreChange() {
            console.log('_handleAuthStoreChange');
            this.setState({
                team: AuthStore.team
            });

            if (AuthStore.team) {
                if (AuthStore.team.group === "bar") {
                    this.setState({homepage: BarHomepage});
                } else {
                    this.setState({homepage: AdminHomepage});
                }
            }
            else {
                this.setState({homepage: LoginHomepage});
            }
        }



    render() {
        return (
            <div>
                <AppNavbar />
                <main className="main">
                    {createElement(this.state.homepage)}
                </main>
                <AppFooter />
                <SnackbarNotification />
                <LoadingNotification />
                <ErrorNotification />
            </div>
        );
    }
}
