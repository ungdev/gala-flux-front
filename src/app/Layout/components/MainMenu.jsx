import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import { browserHistory } from 'react-router'
import { withStyles } from 'material-ui/styles';

import Hidden from 'material-ui/Hidden';
import Tabs, { Tab } from 'material-ui/Tabs';
import NotificationBubble from 'app/components/NotificationBubble.jsx';
import SelectableListItem from 'app/components/SelectableListItem.jsx';

const styles = theme => ({
    mdUpHidden: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    mdDownHidden: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    smUpHidden: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    smDownHidden: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
});

/**
 * @param {Object} router react-router router object
 * @param {bool} tabs If true, tabs will be rendered instead of SelectableListItem.
 * In this mode, every other param will be forwared to the Tabs element.
 */
class MainMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            /**
             * route to notification count object
             */
            notifications: {},
            /**
             * route to boolean if there is something new to see
             */
            news: {},

            items: this.getItemList(),

            /**
             * Value can be different than route because we also match parent routes
             */
            value: false,
        };

        // Find the active route
        this.state.value = false;
        for(let item of this.state.items) {
            if(this.props.router && this.props.router.isActive(item.route)) {
                this.state.value = item.route;
                // We want the last one, so we don't break
            }
        }

        // binding
        this.handleNotificationChange = this.handleNotificationChange.bind(this);
    }

    componentDidMount() {
        // Listen store changes
        NotificationStore.addChangeListener(this.handleNotificationChange);
        this.handleNotificationChange();
    }

    componentWillUnmount() {
        // remove the store listener
        NotificationStore.removeChangeListener(this.handleNotificationChange);
    }

    componentWillReceiveProps(nextProps) {
        // Find the current active path
        let value = false;
        for(let item of this.state.items) {
            if(nextProps.router && nextProps.router.isActive(item.route)) {
                value = item.route;
                // We want the last one, so we don't break
            }
        }
        this.setState({ value });
    }

    /**
     * Set the notification data in the component state
     */
    handleNotificationChange() {
        // Calculate chat notification count
        let notifications = {};
        let news = {};
        const chanConfig = NotificationStore.configuration.channel;
        for (let channel in NotificationStore.newMessageCounts) {
            if(NotificationStore.newMessageCounts[channel] > 0) {
                if(chanConfig[channel] == 'notify') {
                    notifications['/chat'] = (notifications['/chat'] ? notifications['/chat'] : 0) + NotificationStore.newMessageCounts[channel];
                    notifications['/myspace'] = (notifications['/myspace'] ? notifications['/myspace'] : 0) + NotificationStore.newMessageCounts[channel];
                    notifications['/dashboard'] = (notifications['/dashboard'] ? notifications['/dashboard'] : 0) + NotificationStore.newMessageCounts[channel];
                }
                if(chanConfig[channel] == 'notify' || chanConfig[channel] == 'show') {
                    news['/chat'] = true;
                    news['/myspace'] = true;
                    news['/dashboard'] = true;
                }
            }
        }
        // Get alert count
        notifications['/alerts'] = (notifications['/alerts'] ? notifications['/alerts'] : 0) + NotificationStore.newMAlertCount;
        news['/alerts'] = NotificationStore.newMAlertCount > 0;
        notifications['/dashboard'] = (notifications['/dashboard'] ? notifications['/dashboard'] : 0) + NotificationStore.newMAlertCount;
        news['/dashboard'] = NotificationStore.newMAlertCount > 0;

        this.setState({notifications, news});
    }

    /**
     * Generate a list of object that cotnain all informations to build responsive tabs
     * @return {Array} The list of objects [{label: '', bold: true, bubble: 2, route: '/', tablet: true, desktop: true}]
     */
    getItemList() {
        let items = [];

        // If not authenticated then you get nothing
        if(!AuthStore.team) {
            return [];
        }

        // Chat
        items.push({
            label: 'Chat',
            route: '/chat',
            hidden: {
                mdUp: true,
            },
        });

        // My space (Alert buttons+Chat)
        if(!AuthStore.can('ui/hideMyspace')) {
            items.push({
                label: 'Mon espace',
                route: '/myspace',
                hidden: {
                    smDown: true,
                },
            });
            items.push({
                label: 'Mes alertes',
                route: '/myalerts',
                hidden: {
                    smUp: true,
                },
            });
            items.push({
                label: 'Mon stock',
                route: '/mystock',
                hidden: {
                    smUp: true,
                },
            });
        }

        // Alerts
        if(AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) {
            items.push({
                label: 'Alertes',
                route: '/alerts',
                hidden: {
                    mdUp: true,
                },
            });

            items.push({
                label: 'Dashboard',
                route: '/dashboard',
                hidden: {
                    mdDown: true,
                },
            });
        }

        // Teams
        if((AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
            (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin'))) {
            items.push({
                label: 'Vue d\'ensembe',
                route: '/overview',
            });
        }

        // Stock
        if(AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) {
            items.push({
                label: 'Stocks',
                route: '/stocks',
            });
        }

        // Admin
        if(AuthStore.can('ui/admin')) {
            items.push({
                label: 'Administration',
                route: '/admin',
            });
        }

        return items;
    }

    render() {
        if(this.state.items < 2) {
            return null;
        }

        const { classes } = this.props;
        if(!this.props.tabs) {
            return (
                    <div>
                        { this.state.items.map((item, i) => (
                            <Hidden
                                {...(item.hidden || {})}
                                key={item.route + item.label}
                            >
                                <SelectableListItem
                                    value={item.route}
                                >
                                    <NotificationBubble count={this.state.notifications[item.route]} />
                                    {this.state.news[item.route] ?
                                        <strong>{item.label}</strong>
                                    :
                                        item.label
                                    }
                                </SelectableListItem>
                            </Hidden>
                        ))}
                    </div>
                );
        }
        // Tabs mode
        else {
            let { router, tabs, classes, ...props } = this.props;
            props.value = this.state.value;
            return (
                <Tabs {...props}>
                    { this.state.items.map((item, i) => (
                        <Tab
                            label={
                                <span>
                                    <NotificationBubble count={this.state.notifications[item.route]} />
                                    {this.state.news[item.route] ?
                                        <strong>{item.label}</strong>
                                    :
                                        item.label
                                    }
                                </span>
                            }
                            value={item.route}
                            key={item.route + item.label}
                            className={
                                (item.hidden && item.hidden.mdUp ? classes.mdUpHidden + ' ' : '')
                                + (item.hidden && item.hidden.smDown ? classes.smDownHidden + ' ' : '')
                                + (item.hidden && item.hidden.smUp ? classes.smUpHidden + ' ' : '')
                                + (item.hidden && item.hidden.mdDown ? classes.mdDownHidden + ' ' : '')
                            }
                        />
                    ))}
                </Tabs>
            );
        }
    }
}

export default withStyles(styles)(MainMenu);
