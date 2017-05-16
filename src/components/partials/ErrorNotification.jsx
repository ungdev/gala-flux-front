import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Dialog from 'components/partials/ResponsiveDialog.jsx';

import ErrorLogService from 'services/ErrorLogService';
import NotificationStore from 'stores/NotificationStore';
import AuthActions from 'actions/AuthActions';

require('styles/partials/ErrorNotification.scss');

export default class ErrorNotification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            count: 0,
            showTechnical: localStorage.getItem('ErrorNotification/technical') == 'true' || process.env.NODE_ENV == 'development',
        };

        // Set this variable to true to prevent errorMessage refresh before state has been updated
        this.preventDialog = false;
        this.interval = null;

        // binding
        this._openDialogIfNecessary = this._openDialogIfNecessary.bind(this);
        this._closeDialog = this._closeDialog.bind(this);
        this._handleTechnicalToggle = this._handleTechnicalToggle.bind(this);
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

    _handleTechnicalToggle(value) {
        this.setState({showTechnical: value});
        localStorage.setItem('ErrorNotification/technical', value);
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
                // Default values
                if(errorMessage.refresh === undefined && process.env.NODE_ENV != 'development') {
                    errorMessage.refresh = true;
                }
                if(errorMessage.timeout === undefined && process.env.NODE_ENV != 'development') {
                    errorMessage.timeout = 180;
                }

                // Enable refresh if too much errors
                if(this.state.count >= 10) {
                    errorMessage.refresh = true;
                }

                // Send error log to the server
                ErrorLogService.create({
                    message: errorMessage.message,
                    error: (typeof errorMessage.error === 'string' || errorMessage.error instanceof String) ?
                        errorMessage.error
                        :
                        Object.assign(
                            {},
                            (errorMessage.error.message ? {message: errorMessage.error.message} : {}),
                            errorMessage.error,
                        ),
                    details: (typeof errorMessage.details === 'string' || errorMessage.details instanceof String) ?
                        errorMessage.details
                        :
                        Object.assign(
                            {},
                            errorMessage.details,
                        ),
                    stack: errorMessage.error ? errorMessage.error.stack : null,
                    notificationStack: errorMessage.stack,
                })
                .catch((e) => {
                    console.error('Couldnt send error log to server:',e);
                });


                // Enable error
                this.preventDialog = true;
                this.setState({ errorMessage: errorMessage });
                console.error('Error notification ('+ errorMessage.message + '):', errorMessage);

                // Enable timeout update
                if(errorMessage.timeout > 0) {
                    this.interval = setInterval(() => {
                        this._updateTimeout()
                    }, 1000);
                }
            }
        }
    }

    /**
     * hide the dialog
     */
    _closeDialog() {
        if(this.state.errorMessage.refresh) {
            AuthActions.logout();
            location.href = '/';
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
            <Toggle
                label="Données techniques"
                labelPosition="right"
                className="ErrorNotification__technicalSwitch"
                onToggle={(e, v) => this._handleTechnicalToggle(v)}
                toggled={this.state.showTechnical}
                />,
            <FlatButton
                label={buttonLabel}
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._closeDialog}
                />,
        ];

        return (
            <Dialog
                className="ErrorNotification"
                title={<div>Erreur !</div>}
                actions={actions}
                modal={false}
                open={(this.state.errorMessage != null && this.preventDialog != null)}
                onRequestClose={this._closeDialog}
                style={{zIndex: 2000}}
            >
                {(this.state.errorMessage ? this.state.errorMessage.message : '')}

                { this.state.showTechnical &&  this.state.errorMessage &&
                    <div>
                        { this.state.errorMessage.error &&
                            <div>
                                <h4>Error</h4>
                                <pre>
                                    { (typeof this.state.errorMessage.error === 'string' || this.state.errorMessage.error instanceof String) ?
                                        this.state.errorMessage.error
                                        :
                                        JSON.stringify(
                                            Object.assign(
                                                {},
                                                (this.state.errorMessage.error.message ? {message: this.state.errorMessage.error.message} : {}),
                                                this.state.errorMessage.error,
                                            ), null, 4
                                        )
                                    }
                                </pre>
                            </div>
                        }
                        { this.state.errorMessage.details &&
                            <div>
                                <h4>Details</h4>
                                <pre>
                                    {
                                        (typeof this.state.errorMessage.details === 'string' || this.state.errorMessage.details instanceof String) ?
                                        this.state.errorMessage.details
                                        :
                                        JSON.stringify(this.state.errorMessage.details, null, 4)
                                    }
                                </pre>
                            </div>
                        }
                        { this.state.errorMessage.error.stack &&
                            <div>
                                <h4>Error stack</h4>
                                <pre>
                                    {this.state.errorMessage.error.stack}
                                </pre>
                            </div>
                        }
                        { this.state.errorMessage.stack &&
                            <div>
                                <h4>Error Notification stack</h4>
                                <pre>
                                    {this.state.errorMessage.stack}
                                </pre>
                            </div>
                        }
                    </div>
                }
            </Dialog>
        );
    }

}
