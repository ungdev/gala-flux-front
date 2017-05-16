import React from 'react';

import AlertButtonStore from 'stores/AlertButtonStore';
import AuthStore from 'stores/AuthStore';
import AlertStore from 'stores/AlertStore';
import NotificationActions from 'actions/NotificationActions';

import BarAlertButton from 'components/alertButtons/BarAlertButton.jsx';

require('styles/bar/AlertButton.scss');

export default class BarAlertButtons extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buttons: {},
            alerts: {},
            barId: props.barId
        };

        this.AlertButtonStoreToken = null;
        this.AlertStoreToken = null;

        // binding
        this._setButtons = this._setButtons.bind(this);
        this._setAlerts = this._setAlerts.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            barId: nextProps.barId
        }, _ => {
            this._setAlerts();
        });
    }

    componentDidMount() {
        // fill the alert buttons store
        AlertButtonStore.loadData([{senderGroup: (AuthStore.team ? AuthStore.team.group : '')}, {senderGroup: null}])
            .then(data => {
                // ensure that last token doesn't exist anymore.
                AlertButtonStore.unloadData(this.AlertButtonStoreToken);
                // save the component token
                this.AlertButtonStoreToken = data.token;

                return AlertStore.loadData(null);
            })
            .then(data => {
                // ensure that last token doesn't exist anymore.
                AlertStore.unloadData(this.AlertStoreToken);
                // save the component token
                this.AlertStoreToken = data.token;

                // listen the stores changes
                AlertButtonStore.addChangeListener(this._setButtons);
                AlertStore.addChangeListener(this._setAlerts);
                // init teams
                this._setButtons();
                this._setAlerts();
            })
            .catch(error => NotificationActions.error("Erreur lors de la lecture des boutons d'alerte.", error));
    }

    componentWillUnmount() {
        // clear store
        AlertButtonStore.unloadData(this.AlertButtonStoreToken);
        AlertStore.unloadData(this.AlertStoreToken);
        // remove the listener
        AlertButtonStore.removeChangeListener(this._setButtons);
        AlertStore.removeChangeListener(this._setAlerts);
    }

    /**
     * Update the buttons in the state with the buttons from the alert buttons store
     */
    _setButtons() {
        const storeButtons = AlertButtonStore.find([{senderGroup: (AuthStore.team ? AuthStore.team.group : '')}, {senderGroup: null}]);
        let buttons = {};

        for (let button of storeButtons) {
            if (!buttons[button.category]) {
                buttons[button.category] = [];
            }
            buttons[button.category].push(button);
        }

        this.setState({ buttons });
    }

    /**
     * Update the alerts in the state with the alerts from the alerts store
     */
    _setAlerts() {
        const storeAlerts = this.state.barId ? AlertStore.find([{sender: this.state.barId}]) : AlertStore.alerts;
        let alerts = {};

        // store them by button (because only one alert by button by team)
        for (let alert of storeAlerts) {
            if (alert.button) {
                alerts[alert.button] = alert;
            }
        }

        this.setState({ alerts });
    }

    render() {
        const categories = Object.keys(this.state.buttons);

        return(
            <div className="AlertButtons_container">
                {
                    categories.map((category, i) => {
                        return  <div key={i}>
                                    <h3>{category}</h3>
                                    {
                                        this.state.buttons[category].map(button => {
                                            return <BarAlertButton
                                                        key={button.id}
                                                        button={button}
                                                        alert={this.state.alerts[button.id]}
                                                    />
                                        })
                                    }
                                </div>
                    })
                }
            </div>
        );
    }

}
