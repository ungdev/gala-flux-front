import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import AlertActions from 'actions/AlertActions.jsx';
import AlertButtonService from 'services/AlertButtonService';
import AlertService from 'services/AlertService';

import Comment from 'material-ui-icons/Comment';
import Check from 'material-ui-icons/Check';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

require('./AlertButton.scss');

/**
 * @param {Object} button
 * @param {Object} alert
 * @param {Object} team
 */
export default class AlertButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showInput: false,
            message: props.alert ? props.alert.message : (props.button.messageDefault || ''),
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
        this._handleScrolOnBlur = this._handleScrolOnBlur.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({
            message: props.alert ? props.alert.message : (props.button.messageDefault || ''),
        });
    }

    /**
     * toggle the boolean to show/hide the message input
     */
    _toggleMessageInput() {
        this.setState({ showInput: !this.state.showInput, messageError: '' });
    }


    componentDidUpdate() {
        if(this.textInput && this.state.showInput) {
            this.textInput.focus();
        }
    }

    /**
     * Call the AlertButtonService to create a new alert
     */
    _createAlert() {
        // if comment required but no comment
        if (this.props.button.messageRequired && (this.state.message.trim() === "" ||
                this.state.message === this.props.button.messageDefault)) {
            // If input not shown, only show input, else print in field error
            if(!this.state.showInput) {
                this.setState({ showInput: true });
            }
            else if(this.state.message === this.props.button.messageDefault && this.state.message.trim() !== "") {
                this.setState({ showInput: true, messageError: 'Veuillez modifier le commentaire par défaut' });
            }
            else if(this.state.message.trim() === "") {
                this.setState({ showInput: true, messageError: 'Commentaire obligatoire' });
            }
        }
        else {

            AlertService.create({
                title: this.props.button.title,
                severity: 'warning',
                message: this.state.message,
                buttonId: this.props.button.id,
                senderTeamId: this.props.team.id,
                receiverTeamId: this.props.button.receiverTeamId,
            })
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
        if (!this.props.alert) return;
        // if the state is already serious and the user clicked on the button
        if (this.props.alert.severity === severity) return;

        // if the severity is valid
        if (severity === "done" || severity === "serious") {
            AlertService.update(this.props.alert.id, {severity})
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
        if (this.props.button.messageRequired && this.state.message.trim() === "") {
            this.setState({ showInput: true, messageError: 'Commentaire obligatoire' });
        }
        else if (this.props.button.messageRequired && this.state.message === this.props.button.messageDefault) {
            this.setState({ showInput: true, messageError: 'Vous devez modifier ce commentaire' });
        }
        else {
            AlertService.update(this.props.alert.id, {message: this.state.message})
            .then(_ => this.setState({ showInput: false }))
            .catch(error => NotificationActions.error("Erreur lors de la modification du commentaire.", error));
        }
    }

    /**
     * Update the message in the state when the input change
     *
     * @param e: event
     */
    _handleInputChange(e) {
        this.setState({ message: e.target.value, messageError: ''  });
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
            // Submit on enter press
            if(!e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                this._commentAlert();
            }
            // Generally on browser ctrl+enter doesn't do anything, so we will manually insert return
            else if(e.ctrlKey && e.target && typeof e.target.selectionStart == 'number') {
                e.preventDefault();
                let finalSelection = e.target.selectionStart+1;
                e.target.value = this.state.message.slice(0, e.target.selectionStart) + '\n' + this.state.message.slice(e.target.selectionEnd);
                e.target.setSelectionRange(finalSelection,finalSelection);
                this.setState({message: e.target.value});
            }
        }
    }

    /**
     * if an alert exists for this button, update the message
     * else, create a new alert with this message
     */
    _commentAlert() {
        if (this.props.alert) {
            this._updateAlertMessage();
        } else {
            this._createAlert();
        }
    }


    /**
     * This function ensure user can still scroll the alert area when blur is on
     */
    _handleScrolOnBlur(e) {
        let scrollArea = document.getElementsByClassName('BarHomePage__alerts')[0];
        if(document.getElementsByClassName('BarHomePage__alerts')[0]) {
            scrollArea.scrollTop += e.deltaY;
        }
    }

    render() {
        // true if it's
        const commentRequired = this.props.button.messageRequired && !this.props.alert && this.state.showInput;

        let alertButton = (this.props.alert && this.props.alert.severity != 'done') ?
                (<div className="AlertButtons__Button_active_container">
                    <button className={`AlertButtons__Button_button AlertButtons__Button_autowidth ${this.props.alert.severity === "warning" ? "AlertButtons__orange_background" : "AlertButtons__red_background"}`} onClick={_ => this._updateAlertSeverity("serious")}>
                        {this.props.button.title}
                    </button>
                    <IconButton className="AlertButtons__Button_iconButton" onClick={this._toggleMessageInput}>
                        <Comment className={`AlertButtons__SmallIcon ${(this.props.alert && this.props.alert.message) && "AlertButtons__greenIcon"}`} />
                    </IconButton>
                    <IconButton className="AlertButtons__Button_iconButton AlertButtons__green_background" onClick={_ => this._updateAlertSeverity("done")}>
                        <Check className="AlertButtons__SmallIcon AlertButtons__whiteIcon" />
                    </IconButton>
                </div>)
            :
                (<div className={`AlertButtons__Button_active_container ${commentRequired && "AlertButtons__Button--required"}`}>
                    <button className="AlertButtons__Button_button AlertButtons__Button_autowidth" onClick={this._createAlert}>
                        {this.props.button.title}
                    </button>
                </div>);

        return (
            <div className="AlertButtons__Button">
                {alertButton}
                {
                    this.state.showInput && commentRequired &&
                    <div className="AlertButtons__Button_input_blur" onWheel={this._handleScrolOnBlur} onTouchTap={_ => this._toggleMessageInput("done")}></div>
                }
                { this.state.showInput &&
                    <form
                        onSubmit={this._handleSubmit}
                        className={`AlertButtons__Button_input_container ${commentRequired && "AlertButtons__Button--required"}`}>

                        <div className="AlertButtons__Button_input_label">{this.props.button.messagePrompt || "Commentaire"}</div>
                        <TextField
                            className="AlertButtons__Button_input__TextField"
                            multiline
                            autoFocus
                            rows={2}
                            rowsMax={10}
                            onKeyDown={this._handleKeyDown}
                            onChange={this._handleInputChange}
                            value={(this.state.showInput ? this.state.message : '') || ''}
                            placeholder={this.props.button.messageRequired ? "Commentaire obligatoire" : ""}
                            error={!!this.state.messageError}
                            helperText={this.state.messageError}
                            id={"button-"+this.props.button.id}
                            />
                        <div className="AlertButtons__Button_input_actions">
                            <Button
                                color="accent"
                                onClick={_ => this._toggleMessageInput("done")}
                            >
                                Annuler
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                            >
                                {commentRequired ? "Créer l'alerte" : "Envoyer"}
                            </Button>
                        </div>
                    </form>
                }
            </div>
        );
    }

}
