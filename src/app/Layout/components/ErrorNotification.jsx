import React from 'react';

import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import { FormControlLabel } from 'material-ui/Form';
import { DialogTitle, DialogActions, DialogContent } from 'material-ui/Dialog';
import Dialog from 'app/components/ResponsiveDialog.jsx';

import ErrorLogService from 'services/ErrorLogService';
import NotificationStore from 'stores/NotificationStore';
import AuthActions from 'actions/AuthActions';

require('./ErrorNotification.scss');

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
        this.openDialogIfNecessary = this.openDialogIfNecessary.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.handleTechnicalToggle = this.handleTechnicalToggle.bind(this);
        this.onNotificationStoreChange = this.onNotificationStoreChange.bind(this);
    }

    componentDidMount() {
        // listen the store change
        NotificationStore.addChangeListener(this.onNotificationStoreChange);
    }

    componentWillUnmount() {
        // unlisten the store change
        NotificationStore.removeChangeListener(this.onNotificationStoreChange);
    }

    componentDidUpdate() {
        // Prevent dialog to show before end of transition
        setTimeout(() => {
            this.preventDialog = false;
            this.openDialogIfNecessary();
        }, 300);
    }

    handleTechnicalToggle(value) {
        this.setState({showTechnical: value});
        localStorage.setItem('ErrorNotification/technical', value);
    }

    onNotificationStoreChange() {
        this.openDialogIfNecessary();
    }

    /**
     * Open the dialog if there is new error in the store and if there is no error currently
     */
    openDialogIfNecessary() {
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
                        this.updateTimeout()
                    }, 1000);
                }
            }
        }
    }

    /**
     * hide the dialog
     */
    closeDialog() {
        if(this.state.errorMessage.refresh) {
            AuthActions.logout();
            location.href = '/';
        }
        this.setState({ errorMessage: null, count: this.state.count+1 });
    }


    /**
     * hide the dialog
     */
    updateTimeout() {
        if(this.state.errorMessage.timeout > 1) {
            const errorMessage = this.state.errorMessage;
            errorMessage.timeout = errorMessage.timeout - 1;
            this.setState({errorMessage});
        }
        else if(this.state.errorMessage.timeout === 1) {
            clearInterval(this.interval);
            this.closeDialog();
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
        
        return (
            <Dialog
                className="Layout__ErrorNotification"
                open={(this.state.errorMessage != null && this.preventDialog != null)}
                onRequestClose={this.closeDialog}
                style={{zIndex: 2000}}
            >
                <DialogTitle>Erreur !</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions
                    classes={{action: 'Layout__ErrorNotification__action'}}
                >
                    <FormControlLabel 
                        label="Données techniques"
                        className="Layout__ErrorNotification__technicalSwitch"
                        control={
                            <Switch
                                onChange={(e, v) => this.handleTechnicalToggle(v)}
                                checked={this.state.showTechnical}
                            />
                        }
                    />
                    <Button
                        color="primary"
                        onTouchTap={this.closeDialog}
                    >
                        {buttonLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}
