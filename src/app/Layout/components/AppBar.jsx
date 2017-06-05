import React from 'react';

import MaterialAppBar from 'material-ui/AppBar';

import MainDrawer from 'app/Layout/components/MainDrawer.jsx';
import AuthMenu from 'app/Layout/components/AuthMenu.jsx';

require('./AppBar.scss');

/**
 * This is the top bar shown on every pages of the layout
 */
export default class AppBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: 'Flux',
        };

        // this._handleRouteUpdate = this._handleRouteUpdate.bind(this);
    }

    // componentDidMount() {
    //     // Re-render every route change
    //     router.addListener((route) => {
    //         this._handleRouteUpdate(route);
    //     });
    //
    //     // Init route
    //     this._handleRouteUpdate(router.getState());
    // }

    // _handleRouteUpdate(route) {
    //     for (let routeConf of routes) {
    //         if(routeConf.name === route.name && routeConf.title) {
    //             let title = routeConf.title;
    //             if(typeof routeConf.title === 'function') {
    //                 title = routeConf.title(route);
    //             }
    //             this.setState({title: title});
    //             return;
    //         }
    //     }
    //     this.setState({title: 'Flux'});
    // }


    render() {
        return (
            <MaterialAppBar
                title={this.state.title}
                className="Layout__AppBar"
                iconElementRight={<AuthMenu />}
                iconElementLeft={<MainDrawer />}
            />
        );
    }
}
