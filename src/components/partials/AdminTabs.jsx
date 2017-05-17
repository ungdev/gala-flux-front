import React from 'react';

import AuthStore from 'stores/AuthStore';
import NotificationStore from 'stores/NotificationStore';

import { Tabs, Tab } from 'material-ui/Tabs';

require('styles/partials/AuthMenu.scss');


/**
 * @param {function} onChange
 * @param {string} value tab name
 */
export default class AdminTabs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            messageCount: 0,
            hasMessage: false,
            Count: 0,
            alertCount: 0,
        };


        // binding
        this._updateData = this._updateData.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            value: props.value,
        });
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
            <div>
                {/* Tabs for tablet */}
                <Tabs className="AdminPage__tabs show-sm" onChange={this.props.onChange} value={this.state.value}>
                    { !this.state.hasMessage ?
                        <Tab label={<span>Chat { this.state.messageCount > 0 && <span className="Notification_bubble">{this.state.messageCount}</span> } </span>} value="home"/>
                    :
                        <Tab label={<strong>Chat { this.state.messageCount > 0 && <span className="Notification_bubble">{this.state.messageCount}</span> } </strong>} value="home"/>
                    }

                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                        <Tab label={<span>Alertes { this.state.alertCount > 0 && <span className="Notification_bubble">{this.state.alertCount}</span> } </span>}  value="alert"/>
                    }

                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                    (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Bars" value="bars"/>
                    }

                    { (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Gestion du stock" value="stock"/>
                    }
                    <Tab label="Administration" value="admin"/>
                </Tabs>

                {/* Tabs for desktop */}
                <Tabs className="AdminPage__tabs hide-sm" onChange={this.props.onChange} value={this.state.value}>
                    <Tab label={<span>Dashboard { (this.state.messageCount+this.state.alertCount) > 0 && <span className="Notification_bubble">{(this.state.messageCount+this.state.alertCount)}</span> } </span>} value="home"/>
                    { (AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) &&
                    (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Bars" value="bars"/>
                    }
                    { (AuthStore.can('barrel/read') || AuthStore.can('barrel/admin')) &&
                        <Tab label="Gestion du stock" value="stock"/>
                    }
                    <Tab label="Administration" value="admin"/>
                </Tabs>
            </div>
        );
    }

}
