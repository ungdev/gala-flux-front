import React from 'react';
import router from 'router';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';
import ChatMenu from 'components/chat/ChatMenu.jsx'

import { ListItem } from 'material-ui/List';
import SelectableList from 'components/partials/SelectableList.jsx';

require('styles/partials/AdminMenu.scss');

/**
 * This component will print a menu for the admin panel
 * @param {object} route The route state
 * @param {function(route)} onChange Function called when another item is selected with item value as paramater
 * in the drawer instead of the admin submenu
 */
export default class AdminMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            route: props.route,
            messageCount: 0,
            hasMessage: false,
            alertCount: 0,
        };

        // binding
        this._handleChange = this._handleChange.bind(this);
        this._updateData = this._updateData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            route: nextProps.route,
        });
    }

    _handleChange(route) {
        router.navigate(route);

        if(this.props.onChange) {
            this.props.onChange(route);
        }
    }

    componentDidMount() {
        // Listen store changes
        NotificationStore.addChangeListener(this._updateData);
    }

    componentWillUnmount() {
        // remove the store listener
        NotificationStore.removeChangeListener(this._updateData);
    }

    /**
     * Set the notification data in the component state
     */
    _updateData() {

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

    render() {

        return (
            <div className={this.props.className}>
                <SelectableList onChange={this._handleChange} value={this.state.route.name} className="AdminMenu">

                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                        <ListItem value="alert" className="AdminMenu__mainItem NotificationScrollIndicatorLine" data-count={(this.state.alertCount || 0)}>
                            { this.state.alertCount != 0 && <span className="Notification_bubble">{this.state.alertCount}</span> }
                            <div>Alertes</div>
                        </ListItem>
                    }
                    <ListItem value="chat" className="AdminMenu__mainItem">Chat</ListItem>
                    <div className="show-xs">
                        <ChatMenu route={this.state.route} onChange={(channel) => this.props.onChange('chat.channel', {channel: channel})} />
                    </div>

                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                    (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <ListItem value="bars" className="AdminMenu__mainItem">Bars</ListItem>
                    }

                    { (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <ListItem value="stock" className="AdminMenu__mainItem">Gestion du stock</ListItem>
                    }
                    <ListItem value="admin" className="AdminMenu__mainItem">Administration</ListItem>


                    { ((AuthStore.can('team/read') || AuthStore.can('team/admin')) &&
                        (AuthStore.can('user/read') || AuthStore.can('user/team') || AuthStore.can('user/admin'))) &&
                        <ListItem value="admin.teams" className="AdminMenu__item">Équipes et utilisateurs</ListItem>
                    }

                    { (AuthStore.can('barrelType/admin') || AuthStore.can('barrel/restricted')
                        || AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <ListItem value="admin.barrels" className="AdminMenu__item">Gestion des fûts</ListItem>
                    }

                    { (AuthStore.can('barrelType/admin')) &&
                        <ListItem value="admin.bottles" className="AdminMenu__item">Gestion des bouteilles</ListItem>
                    }

                    { (AuthStore.can('alertButton/admin')) &&
                        <ListItem value="admin.alerts" className="AdminMenu__item">Gestion des boutons d'alerte</ListItem>
                    }
                </SelectableList>
            </div>
        );
    }
}
