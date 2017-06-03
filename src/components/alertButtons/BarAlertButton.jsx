import React from 'react';

import NotificationActions from 'actions/NotificationActions';
import AlertActions from 'actions/AlertActions.jsx';
import AlertButtonService from 'services/AlertButtonService';
import AlertService from 'services/AlertService';

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
            message: props.alert ? props.alert.message : (props.button.messageDefault || ''),
            messageError: '',
            teamId: props.teamId
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

    componentWillReceiveProps(nextProps) {
        this.setState({
            teamId: nextProps.teamId,
            button: nextProps.button,
            alert: nextProps.alert,
            message: nextProps.alert ? nextProps.alert.message : (nextProps.button.messageDefault || ''),
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
        if (this.state.button.messageRequired && (this.state.message.trim() === "" ||
                this.state.message === this.state.button.messageDefault)) {
            // If input not shown, only show input, else print in field error
            if(!this.state.showInput) {
                this.setState({ showInput: true });
            }
            else if(this.state.message === this.state.button.messageDefault && this.state.message.trim() !== "") {
                this.setState({ showInput: true, messageError: 'Veuillez modifier le commentaire par défaut' });
            }
            else if(this.state.message.trim() === "") {
                this.setState({ showInput: true, messageError: 'Commentaire obligatoire' });
            }
        }
        else {

            AlertService.create({
                title: this.state.button.title,
                severity: 'warning',
                message: this.state.message,
                buttonId: this.state.button.id,
                senderTeamId: this.state.teamId,
                receiverTeamId: this.state.button.receiverTeamId,
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
        else if (this.state.button.messageRequired && this.state.message === this.state.button.messageDefault) {
            this.setState({ showInput: true, messageError: 'Vous devez modifier ce commentaire' });
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
        if (this.state.alert) {
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
            <div className="AlertButton">
                {alertButton}
                {
                    this.state.showInput && commentRequired &&
                    <div className="AlertButton_input_blur" onWheel={this._handleScrolOnBlur} onTouchTap={_ => this._toggleMessageInput("done")}></div>
                }
                <form
                    onSubmit={this._handleSubmit}
                    style={(this.state.showInput ? {} : {display:'none'})}
                    className={`AlertButton_input_container ${commentRequired && "AlertButton_required"}`}>

                    <div className="AlertButton_input_label">{this.state.button.messagePrompt || "Commentaire"}</div>
                    <TextField
                        className="AlertButton_input__TextField"
                        multiLine={true}
                        rows={2}
                        rowsMax={10}
                        onKeyDown={this._handleKeyDown}
                        onChange={this._handleInputChange}
                        value={(this.state.showInput ? this.state.message : '') || ''}
                        hintText={this.state.button.messageRequired ? "Commentaire obligatoire" : ""}
                        fullWidth={true}
                        autoFocus={true}
                        errorText={this.state.messageError}
                        ref={(input) => { this.textInput = input; }}
                        id={"button-"+this.state.button.id}
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
            </div>
        );
    }

}
