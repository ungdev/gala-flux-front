import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';

export default class NotificationsDialog extends React.Component {

    constructor(props) {
        super(props);

        // read current values for notification parameters
        let currentNotificationSound = JSON.parse(localStorage.getItem('notificationSound'));
        let currentNotificationFlash = JSON.parse(localStorage.getItem('notificationFlash'));

        this.state = {
            sound: currentNotificationSound !== false,
            flash: currentNotificationFlash !== false
        };

        // binding
        this._updateParameters = this._updateParameters.bind(this);
        this._toggleSound = this._toggleSound.bind(this);
        this._toggleFlash = this._toggleFlash.bind(this);
    }

    /**
     * Update the notification parameters in the localStorage
     */
    _updateParameters() {
        localStorage.setItem('notificationSound', this.state.sound);
        localStorage.setItem('notificationFlash', this.state.flash);
        this.props.close();
    }

    _toggleSound() {
        this.setState({ sound: !this.state.sound });
    }

    _toggleFlash() {
        this.setState({ flash: !this.state.flash });
    }

    render() {
        const actions = [
            <FlatButton
                label="Annuler"
                primary={true}
                onTouchTap={this.props.close}
            />,
            <FlatButton
                label="Valider"
                primary={true}
                onTouchTap={this._updateParameters}
            />,
        ];

        return (
            <Dialog
                title="Notifications"
                actions={actions}
                modal={false}
                open={true}
                onRequestClose={this.props.close}
            >
                <p>
                    Modification des paramètres de notifications.
                </p>
                <div>
                    <Toggle
                        label="Jouer un son lors des notifications"
                        toggled={this.state.sound}
                        onToggle={this._toggleSound}
                    />
                    <Toggle
                        label="Ecran clignotant lors des notifications"
                        toggled={this.state.flash}
                        onToggle={this._toggleFlash}
                    />
                </div>
            </Dialog>
        );
    }

}