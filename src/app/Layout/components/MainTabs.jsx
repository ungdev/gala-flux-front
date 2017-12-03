import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import { browserHistory } from 'react-router'

import Hidden from 'material-ui/Hidden';
import MainMenu from 'app/Layout/components/MainMenu.jsx';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';

/**
 * @param {Object} router react-router router object
 * @param {function(countTablet, countDesktop)} onTabCountUpdate Will be triggeered each time number of tabs change (if <=1, tabs are hidden)
 */
export default class MainTabs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: decodeURI(this.props.router.getCurrentLocation().pathname),
        };

        // binding
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount() {
        this.unlisten = this.props.router.listen(this.handleRouteChange);
    }

    componentWillUnmount() {
        if(this.unlisten) {
            this.unlisten();
            this.unlisten = null;
        }
    }

    handleRouteChange(currentLocation) {
        this.setState({
            route: decodeURI(currentLocation.pathname),
        });
    }

    render() {
        return (
            <AppBar
                position="static"
            >
                {/* Tabs for tablet */}
                <Hidden mdUp xsDown>
                    <MainMenu
                        tabs
                        fullWidth
                        position="static"
                        onChange={(e,v) => browserHistory.push(v)}
                        value={this.state.route}
                        router={this.props.router}
                    />
                </Hidden>

                {/* Tabs for Desktops */}
                <Hidden smDown>
                    <MainMenu
                        tabs
                        centered
                        position="static"
                        onChange={(e,v) => browserHistory.push(v)}
                        value={this.state.route}
                        router={this.props.router}
                    />
                </Hidden>
            </AppBar>
        );
    }
}
