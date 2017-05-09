import React from 'react';

import NotificationActions from '../../actions/NotificationActions';
import AlertActions from '../../actions/AlertActions.jsx';
import AlertButtonService from '../../services/AlertButtonService';
import AlertService from '../../services/AlertService';

import Comment from 'material-ui/svg-icons/communication/comment';
import Check from 'material-ui/svg-icons/navigation/check';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

export default class BarAlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            button: props.button,
            alert: props.alert,
            showInput: false,
            message: props.alert ? props.alert.message : "",
            messageError: '',
        };

        // binding
        this._createAlert = this._createAlert.bind(this);
        this._updateAlertSeverity = this._updateAlertSeverity.bind(this);
        this._updateAlertMessage = this._updateAlertMessage.bind(this);
        this._toggleMessageInput = this._toggleMessageInput.bind(this);
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
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
        this.setState({ showInput: !this.state.showInput, messageError: '' });
    }

    /**
     * Call the AlertButtonService to create a new alert
     */
    _createAlert() {
        // if comment required but no comment
        if (this.state.button.messageRequired && this.state.message.trim() === "") {
            // If input not shown, only show input, else print in field error
            if(!this.state.showInput) {
                this.setState({ showInput: true });
            }
            else {
                this.setState({ showInput: true, messageError: 'Commentaire obligatoire' });
            }

        }
        else {
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
        // if there is no alert
        if (!this.state.alert) return;
        // if the state is already serious and the user clicked on the button
        if (this.state.alert.severity === severity) return;

        // if the severity is valid
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
        // if comment required but no comment empty print in field error
        if (this.state.button.messageRequired && this.state.message.trim() === "") {
            this.setState({ showInput: true, messageError: 'Commentaire obligatoire' });
        }
        else {
            AlertService.update(this.state.alert.id, {message: this.state.message})
            .then(_ => this.setState({ showInput: false }))
            .catch(error => NotificationActions.error("Erreur lors de la modification du commentaire.", error));
        }
    }

    /**
     * Update the message in the state when the input change
     *
     * @param e: event
     * @param v: the input value
     */
    _handleInputChange(e, v) {
        this.setState({ message: v, messageError: ''  });
    }

    /**
     * Handle comment form submit on the input text
     * @param e: event
     */
    _handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }
        this._commentAlert();
    }

    /**
     * Will submit on enter, and add new line on ctrl+enter
     * @param e: event
     */
    _handleKeyDown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            if(!e.ctrlKey && !e.shiftKey) {
                this._commentAlert();
            }
            else {
                this.setState({ message: this.state.message + '\n'});
            }
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

        // true if it's
        const commentRequired = this.state.button.messageRequired && !this.state.alert && this.state.showInput;

        let alertButton = (this.state.alert && this.state.alert.severity != 'done') ?
                (<div className="AlertButton_active_container">
                    <button className={`AlertButton_button AlertButton_autowidth ${this.state.alert.severity === "warning" ? "orange_background" : "red_background"}`} onClick={_ => this._updateAlertSeverity("serious")}>
                        {this.state.button.title}
                    </button>
                    <IconButton className="AlertButton_iconButton" onClick={this._toggleMessageInput}>
                        <Comment className={`SmallIcon ${(this.state.alert && this.state.alert.message) && "greenIcon"}`} />
                    </IconButton>
                    <IconButton className="AlertButton_iconButton green_background" onClick={_ => this._updateAlertSeverity("done")}>
                        <Check className="SmallIcon whiteIcon" />
                    </IconButton>
                </div>)
            :
                (<div className={`AlertButton_active_container ${commentRequired && "AlertButton_required"}`}>
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
                    this.state.showInput && commentRequired && <div className="AlertButton_input_blur" onTouchTap={_ => this._toggleMessageInput("done")}></div>
                }
                {
                    this.state.showInput &&
                    <form onSubmit={this._handleSubmit} className={`AlertButton_input_container ${commentRequired && "AlertButton_required"}`}>

                        <div className="AlertButton_input_label">{this.state.button.messagePlaceholder || "Commentaire"}</div>
                        <TextField
                            multiLine={true}
                            rows={1}
                            rowsMax={4}
                            fullWidth={true}
                            onKeyDown={this._handleKeyDown}
                            onChange={this._handleInputChange}
                            value={this.state.message}
                            hintText={this.state.button.messageRequired ? "Commentaire obligatoire" : ""}
                            autoFocus
                            errorText={this.state.messageError}
                        />
                        <div className="AlertButton_input_actions">
                            <FlatButton
                                secondary={true}
                                onClick={_ => this._toggleMessageInput("done")}
                                label="Annuler"
                            />
                            <FlatButton
                                primary={true}
                                type="submit"
                                label={commentRequired ? "Créer l'alerte" : "Envoyer"}
                            />
                        </div>
                    </form>
                }
            </div>
        );
    }

}
