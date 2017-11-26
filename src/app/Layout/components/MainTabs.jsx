import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import { browserHistory } from 'react-router'

import Hidden from 'material-ui/Hidden';
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
            messageCount: 0,
            hasMessage: false,
            Count: 0,
            alertCount: 0,
        };
        this.state.tabs = this.getTabList();
        this.state.tabletValue = this.findValue(this.props.router, this.state.tabs, false);
        this.state.desktopValue = this.findValue(this.props.router, this.state.tabs, true);

        // binding
        this.handleNotificationChange = this.handleNotificationChange.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount() {
        // Emit first tab count update
        let countTablet = this.state.tabs.filter(tab => (tab.tablet !== false)).length;
        let countDesktop = this.state.tabs.filter(tab => (tab.desktop !== false)).length;
        if(this.props.onTabCountUpdate) this.props.onTabCountUpdate(countTablet, countDesktop)

        // Listen store changes
        NotificationStore.addChangeListener(this.handleNotificationChange);
        AuthStore.addChangeListener(this.handleRouteChange);
        this.unlisten = this.props.router.listen(this.handleRouteChange);
    }

    componentWillUnmount() {
        // remove the store listener
        NotificationStore.removeChangeListener(this.handleNotificationChange);
        AuthStore.removeChangeListener(this.handleRouteChange);
        if(this.unlisten) {
            this.unlisten();
            this.unlisten = null;
        }
    }

    /**
     * Set the notification data in the component state
     */
    handleNotificationChange() {
        // Calculate chat notification count
        let counts = NotificationStore.newMessageCounts;
        let messageCount = 0;
        let hasMessage = false;
        const chanConfig = NotificationStore.configuration.channel;
        for (let channel in NotificationStore.newMessageCounts) {
            if(chanConfig[channel] == 'notify') {
                messageCount += NotificationStore.newMessageCounts[channel];
                hasMessage = (hasMessage || NotificationStore.newMessageCounts[channel] > 0);
            }
            else if(chanConfig[channel] == 'show') {
                hasMessage = (hasMessage || NotificationStore.newMessageCounts[channel] > 0);
            }
        }

        this.setState({
            messageCount: messageCount,
            hasMessage: hasMessage,
            alertCount: NotificationStore.newMAlertCount,
        });
    }

    handleRouteChange() {
        let tabs = this.getTabList();

        // trigger onTabCountUpdate if tab count change
        let countTablet = tabs.filter(tab => (tab.tablet !== false)).length;
        let countDesktop = tabs.filter(tab => (tab.desktop !== false)).length;
        if(countTablet != this.state.tabs.filter(tab => (tab.tablet !== false)).length
            || countDesktop != this.state.tabs.filter(tab => (tab.desktop !== false)).length) {
            if(this.props.onTabCountUpdate) this.props.onTabCountUpdate(countTablet, countDesktop)
        }

        this.setState({
            tabs: tabs,
            tabletValue: this.findValue(this.props.router, tabs, false),
            desktopValue: this.findValue(this.props.router, tabs, true),
        });
    }

    /**
     * Generate a list of object that cotnain all informations to build responsive tabs
     * @return {Array} The list of objects [{label: '', bold: true, bubble: 2, route: '/', tablet: true, desktop: true}]
     */
    getTabList() {
        let tabs = [];

        // If not authenticated then you get nothing
        if(!AuthStore.team) {
            return [];
        }

        // (Tablet) Chat
        tabs.push({
            label: 'Chat',
            route: '/chat',
            bold: this.state.hasMessage,
            bubble: this.state.messageCount,
            desktop: false,
            tablet: true,
        });

        // My space (Alert buttons+Chat)
        if(!AuthStore.can('ui/hideMyspace')) {
            tabs.push({
                label: 'Mon espace',
                route: '/myspace',
                bold: this.state.hasMessage,
                bubble: this.state.messageCount,
                desktop: true,
                tablet: true,
            });
        }

        // (Tablet) Alerts
        if(AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) {
            tabs.push({
                label: 'Alertes',
                route: '/alerts',
                bold: (this.state.alertCount > 0),
                bubble: this.state.alertCount,
                desktop: false,
                tablet: true,
            });
        }

        // (Destop) Dashboard (Alerts+Chat)
        if(AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) {
            tabs.push({
                label: 'Dashboard',
                route: '/dashboard',
                bold: (this.state.alertCount || this.state.messageCount > 0),
                bubble: this.state.messageCount + this.state.alertCount,
                desktop: true,
                tablet: false,
            });
        }
        else if(AuthStore.can('ui/hideMyspace')){
            // (Desktop) Chat
            tabs.push({
                label: 'Chat',
                route: '/chat',
                bold: this.state.hasMessage,
                bubble: this.state.messageCount,
                desktop: true,
                tablet: false,
            });
        }

        // Teams
        if((AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
            (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin'))) {
            tabs.push({
                label: 'Vue d\'ensembe',
                route: '/overview',
            });
        }

        // Stock
        if(AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) {
            tabs.push({
                label: 'Stocks',
                route: '/stocks',
            });
        }

        // Admin
        if(AuthStore.can('ui/admin')) {
            tabs.push({
                label: 'Administration',
                route: '/admin',
            });
        }

        return tabs;
    }

    /**
     * Find current tab value according to routerr.isActive()
     * @param {Object} router react-router Object
     * @param {Array} tabs Array of tabs data generated by this.getTabList()
     * @param {boolean} desktop Find for desktop tabs (if true) or for tablet tabs (if false)
     * @return {string} The value of the active tab (or false)
     */
    findValue(router, tabs, desktop) {
        for (let tab of tabs) {
            if((desktop && tab.desktop !== false) || (!desktop && tab.tablet !== false)) {
                if(router.isActive(tab.route)) {
                    return tab.route;
                }
            }
        }
        return false;
    }

    render() {
        return (
            <AppBar
                position="static"
            >
                {/* Tabs for tablet */}
                <Hidden mdUp xsDown>
                    { this.state.tabs.filter(tab => (tab.tablet !== false)).length > 1 &&
                        <Tabs
                            fullWidth
                            position="static"
                            onChange={(e,v) => browserHistory.push(v)}
                            value={this.state.tabletValue}
                        >
                            { this.state.tabs.map((tab, i) => (
                                tab.tablet !== false &&
                                <Tab
                                    key={i}
                                    label={
                                        <span>
                                            { tab.bubble > 0 &&
                                                <span className="Notification_bubble">{tab.bubble}</span>
                                            }
                                            { tab.bold ?
                                                <strong>{tab.label}</strong>
                                            :
                                                tab.label
                                            }
                                        </span>
                                    }
                                    value={tab.route}
                                />
                            ))}
                        </Tabs>
                    }
                </Hidden>

                {/* Tabs for Desktops */}
                <Hidden smDown>
                    { this.state.tabs.filter(tab => (tab.desktop !== false)).length > 1 &&
                        <Tabs
                            centered
                            position="static"
                            onChange={(e,v) => browserHistory.push(v)}
                            value={this.state.desktopValue}
                        >
                            { this.state.tabs.map((tab, i) => (
                                tab.desktop !== false &&
                                <Tab
                                    key={i}
                                    label={
                                        <span>
                                            { tab.bubble > 0 &&
                                                <span className="Notification_bubble">{tab.bubble}</span>
                                            }
                                            { tab.bold ?
                                                <strong>{tab.label}</strong>
                                            :
                                                tab.label
                                            }
                                        </span>
                                    }
                                    value={tab.route}
                                />
                            ))}
                        </Tabs>
                    }
                </Hidden>
            </AppBar>
        );
    }
}
