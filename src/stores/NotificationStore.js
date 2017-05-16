import jwtDecode from 'jwt-decode';
import BaseStore from 'stores/BaseStore';

class NotificationStore extends BaseStore {

    constructor() {
        super();

        // Array of future notification messages as strings
        this._snackbarMessages = [];

        // Array of future errors messages as objects :
        //
        // errorMessage = {
        //      message: [String that will be shown to the user],
        //      error: [Optional Javascript Error object],
        //      details: [Optional additionnal object or string that will be shown in the console],
        //      refresh: [Optional boolean that tell if the browser should be refreshed after error acknoledgment],
        // }
        this._errorMessages = [];


        // Contains the message under the loading circular progress
        // The loading page will be shown only if this attribute is defined
        this._loadingMessage = null;
    }


    /**
     * shiftError - Removes the first error in the list and return it
     *
     * @return {errorMessage}  Error message defined in NotificationStore._errorMessages definition
     */
    shiftError() {
        let error = this._errorMessages.shift();
        if(error) {
            process.nextTick(() => {
                // Prevent from breaking syncronous code
                this.emitChange()
            })
            return error;
        }
        return null;
    }

    /**
     * pushError - Add a new error in the list and return it
     * @param {errorMessage}  Error message defined in NotificationStore._errorMessages definition
     *
     */
    pushError(errorMessage) {
        this._errorMessages.push({
            message: errorMessage.message,
            stack: errorMessage.stack,
            error: errorMessage.error,
            details: errorMessage.details,
            refresh: errorMessage.refresh,
            timeout: errorMessage.timeout,
        });
        this.emitChange();
    }

    /**
     * shiftSnackbar - Removes the first snackbar notification in the list
     *
     * @return {string}  Notification message
     */
    shiftSnackbar() {
        let notification = this._snackbarMessages.shift();
        if(notification) {
            process.nextTick(() => {
                // Prevent from breaking syncronous code
                this.emitChange();
            })
            return notification;
        }
        return null;
    }

    /**
     * pushSnackbar - Add a new snackbar notification in the list
     * @param {String} message String that will be shown to the user,
     *
     */
    pushSnackbar(message) {
        this._snackbarMessages.push(message);
        this.emitChange();
    }


    /**
     * set loadingMessage - Show or hide the loading screen with the given message
     *
     * @param  {type} message Message shown on the loading screen or nothing to hide it
     */
    set loadingMessage(message) {
        this._loadingMessage = message ? message : null;
        this.emitChange();
    }


    /**
     * get loadingMessage - Return the current message on the loading screen or nothing if hidden
     *
     * @return {string|null}  The current message or nothing
     */
    get loadingMessage() {
        return this._loadingMessage;
    }


    _handleActions(action) {
        super._handleActions(action);
        switch(action.type) {
            case "ERROR":
                this.pushError(action.data);
                break;
            case "SNACKBAR":
                this.pushSnackbar(action.data);
                break;
            case "LOADING":
                this.loadingMessage = action.data;
                break;
        }
    }

}

export default new NotificationStore();
