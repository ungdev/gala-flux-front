import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import NotificationStore from 'stores/NotificationStore';

export default class SnackbarNotification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: null,
            count: 0,
        };

        // Set this variable to true to prevent message refresh before state has been updated
        this.preventMessage = false;

        // binding
        this._openMessageIfNecessary = this._openMessageIfNecessary.bind(this);
        this._handleRequestClose = this._handleRequestClose.bind(this);
    }

    componentDidMount() {
        // listen the store change
        NotificationStore.addChangeListener(this._onNotificationStoreChange.bind(this));
    }

    componentDidUpdate() {
        // Prevent message to show before end of transition
        setTimeout(() => {
            this.preventMessage = false;
            this._openMessageIfNecessary();
        }, 300);
    }

    _onNotificationStoreChange() {
        this._openMessageIfNecessary();
    }

    /**
     * Open the message if there is new notification in the store and if there is no notification currently
     */
    _openMessageIfNecessary() {
        if(!this.state.message && !this.preventMessage) {
            let message = NotificationStore.shiftSnackbar();
            if(message) {
                // Enable notification
                this.preventMessage = true;
                this.setState({ message: message });
                console.info('Notification:', message);
            }
        }
    }


    _handleRequestClose() {
        this.setState({ message: null, count: this.state.count+1 });
    }


    render() {
        return (
            <Snackbar
                open={(this.state.message != null && this.preventMessage != null)}
                message={(this.state.message ? this.state.message : '')}
                autoHideDuration={3000}
                onRequestClose={this._handleRequestClose}
            />
        );
    }

}
