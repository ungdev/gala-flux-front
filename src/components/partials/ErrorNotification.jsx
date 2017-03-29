import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import NotificationStore from '../../stores/NotificationStore';

export default class ErrorNotification extends React.Component {

        constructor(props) {
            super(props);

            this.state = {
                errorMessage: null,
                count: 0,
            };

            // Set this variable to true to prevent errorMessage refresh before state has been updated
            this.preventDialog = false;
            this.interval = null;

            // binding
            this._openDialogIfNecessary = this._openDialogIfNecessary.bind(this);
            this._closeDialog = this._closeDialog.bind(this);
        }

    componentDidMount() {
        // listen the store change
        NotificationStore.addChangeListener(this._onNotificationStoreChange.bind(this));
    }

    componentDidUpdate() {
        // Prevent dialog to show before end of transition
        setTimeout(() => {
            this.preventDialog = false;
            this._openDialogIfNecessary();
        }, 300);
    }

    _onNotificationStoreChange() {
        this._openDialogIfNecessary();
    }

    /**
     * Open the dialog if there is new error in the store and if there is no error currently
     */
    _openDialogIfNecessary() {
        if(!this.state.errorMessage && !this.preventDialog) {
            let errorMessage = NotificationStore.shiftError();
            if(errorMessage) {
                // Enable refresh if too much errors
                if(this.state.count >= 10) {
                    errorMessage.refresh = true;
                }

                // Enable error
                this.preventDialog = true;
                this.setState({ errorMessage: errorMessage });
                console.log('## Error notification ('+ errorMessage.message + '):', errorMessage);

                // Enable timeout update
                if(errorMessage.timeout > 0) {
                    this.interval = setInterval(() => {
                        this._updateTimeout()
                    }, 1000);
                }

                // Prevent from stopping the current function
                process.nextTick(() => {
                    if(errorMessage.error) {
                        throw errorMessage.error;
                    }
                    else {
                        throw new global.Error(errorMessage.message);
                    }
                })
            }
        }
    }

    /**
     * hide the dialog
     */
    _closeDialog() {
        if(this.state.errorMessage.refresh) {
             location.reload();
        }
        this.setState({ errorMessage: null, count: this.state.count+1 });
    }


    /**
     * hide the dialog
     */
    _updateTimeout() {
        if(this.state.errorMessage.timeout > 1) {
            const errorMessage = this.state.errorMessage;
            errorMessage.timeout = errorMessage.timeout - 1;
            this.setState({errorMessage});
        }
        else if(this.state.errorMessage.timeout === 1) {
            clearInterval(this.interval);
            this._closeDialog();
        }
        else {
            clearInterval(this.interval);
        }
    }

    render() {
        let buttonLabel = 'OK';
        if(this.state.errorMessage) {
            if(this.state.errorMessage.refresh) {
                buttonLabel = 'Redémarrer Flux';
            }
            if(this.state.errorMessage.timeout) {
                buttonLabel += ' ('+this.state.errorMessage.timeout+')';
            }
        }
        const actions = [
            <FlatButton
                label={buttonLabel}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._closeDialog}
                />,
        ];

        return (
            <div>
                <Dialog
                    title="Erreur :/"
                    actions={actions}
                    modal={false}
                    open={(this.state.errorMessage != null && this.preventDialog != null)}
                    onRequestClose={this._closeDialog}
                >
                    {(this.state.errorMessage ? this.state.errorMessage.message : '')}
                </Dialog>
            </div>
        );
    }

}
