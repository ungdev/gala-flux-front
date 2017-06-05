import React, { createElement } from 'react';

import AuthStore from "stores/AuthStore";

import Layout from "app/Layout/Layout.jsx";

import {} from 'app/App.scss';

/**
 * Root of all react components
  * @param {Object} router react-router router object
 */
export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // team: AuthStore.team,
            // homepage: LoginHomepage,
            // route: router.getState(),
        };

        // binding
        // this._handleAuthStoreChange = this._handleAuthStoreChange.bind(this);
    }

    componentDidMount() {
        // Re-render every route change
        // router.addListener(route => {
        //     this.setState({
        //         route: route,
        //     });
        //
        //     // Update android interface route
        //     if (global.Android) {
        //         Android.setRoute(route.name);
        //         if(route.params.channel) {
        //             Android.setChannel(route.params.channel);
        //         }
        //         else {
        //             Android.setChannel("");
        //         }
        //     }
        // });
        //
        // // Init android interface route
        // if (global.Android && router.getState()) {
        //     let route = router.getState();
        //     Android.setRoute(route.name);
        //     if(route.params.channel) {
        //         Android.setChannel(route.params.channel);
        //     }
        //     else {
        //         Android.setChannel("");
        //     }
        // }
        //
        // // listen the stores changes
        // AuthStore.addChangeListener(this._handleAuthStoreChange);
        //
        // // init
        // this._handleAuthStoreChange();

    }

    // componentWillUnmount() {
    //     AuthStore.removeChangeListener(this._handleAuthStoreChange);
    // }

    /**
     * Set the state with the new data of the store
     */
    // _handleAuthStoreChange() {
    //     this.setState({
    //         team: AuthStore.team
    //     });
    //
    //     if (this.state.team) {
    //         if (AuthStore.can('ui/admin')) {
    //             this.setState({homepage: AdminHomepage});
    //         } else {
    //             this.setState({homepage: BarHomepage});
    //         }
    //     }
    //     else {
    //         this.setState({homepage: LoginHomepage});
    //     }
    // }

    // {createElement(this.state.homepage, {route: this.state.route})}

    render() {
        return (
            <Layout router={this.props.router}>
                {this.props.children}
            </Layout>
        );
    }
}
