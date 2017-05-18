import React, { createElement } from 'react';
import router from 'router';

import AuthStore from "stores/AuthStore";

import AppNavbar from "components/partials/AppNavbar.jsx";
import AppFooter from "components/partials/AppFooter.jsx";
import ErrorNotification from "components/partials/ErrorNotification.jsx";
import FluxNotification from "components/partials/FluxNotification.jsx";
import SnackbarNotification from "components/partials/SnackbarNotification.jsx";

// homepages
import AdminHomepage from "components/homepages/AdminHomepage.jsx";
import LoginHomepage from "components/homepages/LoginHomepage.jsx";
import BarHomepage from "components/homepages/BarHomepage.jsx";

require('styles/App.scss');
require('styles/fonts/roboto/roboto.scss');

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            team: AuthStore.team,
            homepage: LoginHomepage,
            route: router.getState(),
        };

        // binding
        this._handleAuthStoreChange = this._handleAuthStoreChange.bind(this);
    }

    componentDidMount() {
        // Re-render every route change
        router.addListener(route => {
            this.setState({
                route: route,
            });

            // Update android interface route
            if (global.Android) {
                Android.setRoute(route.name);
                if(route.params.channel) {
                    Android.setChannel(route.params.channel);
                }
                else {
                    Android.setChannel("");
                }
            }
        });

        // Init android interface route
        if (global.Android && router.getState()) {
            let route = router.getState();
            Android.setRoute(route.name);
            if(route.params.channel) {
                Android.setChannel(route.params.channel);
            }
            else {
                Android.setChannel("");
            }
        }

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
        this.setState({
            team: AuthStore.team
        });

        if (this.state.team) {
            if (AuthStore.can('ui/admin')) {
                this.setState({homepage: AdminHomepage});
            } else {
                this.setState({homepage: BarHomepage});
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
                    {createElement(this.state.homepage, {route: this.state.route})}
                </main>
                <AppFooter />
                <FluxNotification />
                <SnackbarNotification />
                <ErrorNotification />
            </div>
        );
    }
}
