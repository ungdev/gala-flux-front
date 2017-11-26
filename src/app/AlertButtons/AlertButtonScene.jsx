import React from 'react';

import AlertButtonStore from 'stores/AlertButtonStore';
import AuthStore from 'stores/AuthStore';
import AlertStore from 'stores/AlertStore';
import NotificationActions from 'actions/NotificationActions';
import DataLoader from 'app/components/DataLoader.jsx';

import AlertButton from 'app/AlertButtons/components/AlertButton.jsx';

require('./AlertButtonScene.scss');

/**
 * @param {Team} team
 */
export default class AlertButtonScene extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buttons: {},
            alerts: {},
        };

        // binding
        this.handleDatastoreChange = this.handleDatastoreChange.bind(this);
    }

    /**
     * Update state when store are updated
     */
    handleDatastoreChange(datastore) {
        // Set buttons
        let buttons = {};
        for (let button of datastore.AlertButton.values()) {
            if (!buttons[button.category]) {
                buttons[button.category] = [];
            }
            buttons[button.category].push(button);
        }

        // set alerts indexed by button id
        let alerts = {};
        for (let alert of datastore.Alert.values()) {
            if (alert.buttonId) {
                alerts[alert.buttonId] = alert;
            }
        }

        this.setState({ buttons, alerts });
    }


    render() {
        const categories = Object.keys(this.state.buttons);
        return (
            <div className="AlertButtonScene">
                <DataLoader
                    filters={new Map([
                        ['AlertButton', [{senderGroup: this.props.team.group}, {senderGroup: null}]],
                        ['Alert', (datastore) => {return {senderTeamId: this.props.team.id, buttonId: datastore.AlertButton.map(button => button.id), severity: ['warning', 'serious']}}],
                    ])}
                    onChange={ datastore => this.handleDatastoreChange(datastore) }
                >
                    { () => (
                        <div>
                            {
                                categories.map((category, i) => {
                                    return  <div key={i}>
                                                <h3>{category}</h3>
                                                {
                                                    this.state.buttons[category].map(button => {
                                                        return <AlertButton
                                                                    key={button.id}
                                                                    button={button}
                                                                    alert={this.state.alerts[button.id]}
                                                                    team={this.props.team}
                                                                />
                                                    })
                                                }
                                            </div>
                                })
                            }
                        </div>
                    )}
                </DataLoader>
            </div>
        );
    }

}
