import React from 'react';

import AlertActions from '../../actions/AlertActions.jsx';
import AlertButtonService from '../../services/AlertButtonService';
import AlertService from '../../services/AlertService';

require('../../styles/bar/AlertButton.scss');

export default class BarAlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button,
            alert: props.alert
        };

        // binding
        this._createAlert = this._createAlert.bind(this);
        this._updateAlertSeverity = this._updateAlertSeverity.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            button: nextProps.button,
            alert: nextProps.alert
        });
    }

    /**
     * Call the AlertButtonService to create a new alert
     */
    _createAlert() {
        AlertButtonService.createAlert(this.state.button.id)
            .catch(error => console.log("create alert button error", error));
    }

    /**
     * Call the AlertService to update an alert
     */
    _updateAlertSeverity(severity) {
        if (!this.state.alert) return;
        if (severity !== "done" && severity !== "serious") {
            severity = this.state.alert.severity === "warning" ? "serious" : "done";
        }
        AlertService.update(this.state.alert.id, {severity})
            .then(data => {
                // if the alert is closed, remove it from the store
                if (data.severity === "done") {
                    AlertActions.alertClosed(data.id);
                }
            })
            .catch(error => console.log("failed to update the alert severity", error));
    }

    render() {

        if (this.state.alert) {
            return (
                <div>
                    <button className="AlertButton_button" onClick={this._updateAlertSeverity}>
                        !! {this.state.button.title}
                    </button>
                </div>
            );
        }

        return (
            <div>
                <button className="AlertButton_button" onClick={this._createAlert}>
                    {this.state.button.title}
                </button>
            </div>
        );
    }

}