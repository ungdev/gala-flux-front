import React from 'react';

import NotificationActions from '../../actions/NotificationActions';
import AlertActions from '../../actions/AlertActions.jsx';
import AlertButtonService from '../../services/AlertButtonService';
import AlertService from '../../services/AlertService';

import Comment from 'material-ui/svg-icons/communication/comment';
import Check from 'material-ui/svg-icons/navigation/check';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class BarAlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button,
            alert: props.alert,
            showInput: false,
            message: props.alert ? props.alert.message : ""
        };

        // binding
        this._createAlert = this._createAlert.bind(this);
        this._updateAlertSeverity = this._updateAlertSeverity.bind(this);
        this._updateAlertMessage = this._updateAlertMessage.bind(this);
        this._toggleMessageInput = this._toggleMessageInput.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._commentAlert = this._commentAlert.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            button: nextProps.button,
            alert: nextProps.alert,
            message: nextProps.alert ? nextProps.alert.message : ""
        });
    }

    /**
     * toggle the boolean to show/hide the message input
     */
    _toggleMessageInput() {
        this.setState({ showInput: !this.state.showInput });
    }

    /**
     * Call the AlertButtonService to create a new alert
     */
    _createAlert() {
        if (this.state.button.message && this.state.message === "") {
            this.setState({ showInput: true });
        } else {
            AlertButtonService.createAlert(this.state.button.id, this.state.message)
                .then(_ => {
                    this.setState({ showInput: false });
                })
                .catch(error => NotificationActions.error("Erreur lors de la création de l'alerte.", error));
        }
    }

    /**
     * Call the AlertService to update the severity of an alert
     */
    _updateAlertSeverity(severity) {
        if (!this.state.alert) return;

        if (severity === "done" || severity === "serious") {
            AlertService.update(this.state.alert.id, {severity})
                .then(data => {
                    // if the alert is closed, remove it from the store
                    if (data.severity === "done") {
                        AlertActions.alertClosed(data.id);
                        this.setState({ showInput: false });
                    }
                })
                .catch(error => NotificationActions.error("Erreur lors de la modification de l'alerte.", error));
        }

    }

    /**
     * Call the alert service to update the message of an alert
     */
    _updateAlertMessage() {
        AlertService.update(this.state.alert.id, {message: this.state.message})
            .then(_ => this.setState({ showInput: false }))
            .catch(error => NotificationActions.error("Erreur lors de la modification du commentaire.", error));
    }

    /**
     * Update the message in the state when the input change
     *
     * @param e: event
     * @param v: the input value
     */
    _handleInputChange(e, v) {
        this.setState({ message: v });
    }

    /**
     * Handle key down on the input text
     * @param e: event
     */
    _handleKeyDown(e) {
        if(e.key === 'Enter') {
            this._commentAlert();
        }
    }

    /**
     * if an alert exists for this button, update the message
     * else, create a new alert with this message
     */
    _commentAlert() {
        if (this.state.alert) {
            this._updateAlertMessage();
        } else {
            this._createAlert();
        }
    }

    render() {

        let alertButton = this.state.alert
            ?
                (<div className="AlertButton_active_container">
                    <div className={`AlertButton_status ${this.state.alert.users && this.state.alert.users.length ? "green_background" : "red_background"} `}></div>
                    <button className={`AlertButton_button AlertButton_autowidth ${this.state.alert.severity === "warning" ? "orange_background" : "red_background"}`} onClick={_ => this._updateAlertSeverity("serious")}>
                        {this.state.button.title}
                    </button>
                    <button className="AlertButton_button" onClick={this._toggleMessageInput}>
                        <Comment className={`SmallIcon ${(this.state.alert && this.state.alert.message) && "greenIcon"}`} />
                    </button>
                    <button className="AlertButton_button green_background" onClick={_ => this._updateAlertSeverity("done")}>
                        <Check className="SmallIcon whiteIcon" />
                    </button>
                </div>)
            :
                (<div className="AlertButton_active_container">
                    <button className="AlertButton_button AlertButton_autowidth" onClick={this._createAlert}>
                        {this.state.button.title}
                    </button>
                </div>);

        return (
            <div>
                {
                    alertButton
                }
                {
                    this.state.showInput &&
                    <div className="AlertButton_input_container">
                        <TextField
                            floatingLabelText={this.state.button.messagePlaceholder || "Commentaire"}
                            multiLine={true}
                            rows={2}
                            fullWidth={true}
                            onChange={this._handleInputChange}
                            value={this.state.message}
                            onKeyDown={this._handleKeyDown}
                            hintText={this.state.button.message ? "Commentaire obligatoire" : ""}
                            autoFocus
                        />
                        <div className="AlertButton_input_actions">
                            <FlatButton label="Annuler" secondary={true} onClick={_ => this._toggleMessageInput("done")} />
                            <FlatButton label={(this.state.button.message && !this.state.alert) ? "Créer l'alerte" : "Envoyer"} primary={true} onClick={this._commentAlert} />
                        </div>
                    </div>
                }
            </div>
        );
    }

}