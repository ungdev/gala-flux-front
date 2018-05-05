import jwtDecode from 'jwt-decode';
import BaseStore from 'stores/BaseStore';
import AuthStore from 'stores/AuthStore';
import MessageStore from 'stores/MessageStore';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';
import MessageService from 'services/MessageService';
import AlertService from 'services/AlertService';
import NotificationActions from 'actions/NotificationActions';
import { Router, browserHistory } from 'react-router';

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

        // Counts of new messages for each channel
        this._newMessageCounts = {};

        // Date of last message for each channel
        try {
            this._lastReadMessages = localStorage.getItem('lastReadMessages') ? JSON.parse(localStorage.getItem('lastReadMessages')) : {};
        } catch (e) {
            this._lastReadMessages = {};
            console.error('localstorage lastReadMessages json parsing error', e);
        }

        // Date of last alert
        this._lastReadAlert = localStorage.getItem('lastReadAlert') ? new Date(localStorage.getItem('lastReadAlert')) : (new Date()).toISOString();
        localStorage.setItem('lastReadAlert', this._lastReadAlert);

        // Count of new alert
        this._newAlertCount = 0;

        // List notification not cleared
        this._notifications = [];

        // Notification Id used to avoid start same notification multiple times
        this._nextNotificationId = 0;

        // Notification configuration
        try {
            this._configuration = localStorage.getItem('notificationConfiguration') ? JSON.parse(localStorage.getItem('notificationConfiguration')) : {};
        } catch (e) {
            this._configuration = {};
            console.error('localstorage notificationConfiguration json parsing error', e);
        }
        this._configuration = Object.assign({
            enable: true,
            sound: true,
            flash: true,
            desktop: true,
            android: true,
            channels: {}, // notify, show, hide
            alerts: {}, // notify, show
        }, this._configuration);
        localStorage.setItem('notificationConfiguration', JSON.stringify(this._configuration));
        if(global.Android) Android.setConfiguration(JSON.stringify(this._configuration));

        // Bind
        this._handleMessageEvent = this._handleMessageEvent.bind(this);
        this._handleAlertEvent = this._handleAlertEvent.bind(this);

    }

    /**
     * init the store : pull last messages and last alertes
     */
    _init() {
        // fetch new messages counts
        MessageService.get()
        .then(messages => {
            // read the last messages viewed
            const newMessages = {};
            const newChannels = {};

            // for each messages, check if he is more recent than the last viewed
            for (let message of messages) {
                if(this._lastReadMessages[message.channel]) {
                    if ((new Date(this._lastReadMessages[message.channel])) < (new Date(message.createdAt))) {
                        if (newMessages[message.channel]) {
                            newMessages[message.channel]++;
                        } else {
                            newMessages[message.channel] = 1;
                        }
                    }
                }
                else if(!newChannels[message.channel]) {
                    newChannels[message.channel] = new Date();
                }

            }

            this._newMessageCounts = newMessages;
            this._lastReadMessages = Object.assign(this._lastReadMessages, newChannels);
            localStorage.setItem('lastReadMessages', JSON.stringify(this._lastReadMessages));

            // Fetch new alert count
            if(AuthStore.can('alert/read') || AuthStore.can('alert/restrictedReceiver') || AuthStore.can('alert/admin')) {
                return AlertService.get([{ createdAt: {'>': this._lastReadAlert}}]);
            }
            return Promise.resolve([]);
        })
        .then(alertes => {
            this._newAlertCount = alertes.length;
            this.emitChange();

            // Update configuration with new channels
            return MessageService.getChannels();
        })
        .then(channels => {
            console.log(channels)
            for (let channel of channels) {
                if(!this._configuration.channels[channel]) {
                    this._configuration.channels[channel] = 'notify';
                }
            }
            localStorage.setItem('notificationConfiguration', JSON.stringify(this._configuration));
            if(global.Android) Android.setConfiguration(JSON.stringify(this._configuration));
            this.emitChange();
        })
        .catch(error => NotificationActions.error("Erreur lors de la lecture des messages et alertes non lus.", error));

        // Listen for new events
        io.on('model:message', this._handleMessageEvent);
        io.on('model:alert', this._handleAlertEvent);
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
                this.emitChange();
            });
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
            });
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
     * Removes the first notification in the list
     *
     * @return {Object}  {title: 'string', text: 'string'}
     */
    shiftNotification() {
        let notification = this._notifications.shift();
        if(notification) {
            process.nextTick(() => {
                // Prevent from breaking syncronous code
                this.emitChange();
            });
            return notification;
        }
        return null;
    }

    /**
     * Add a new notification in the list
     * @param {String} title Title of the notification
     * @param {String} text Text of the notification
     * @param {String} route Route to redirect on notification click
     * @param {String} routeParams Param of the route to redirect on notification click
     * @param {String} tag Notification with a tag will be replaced by the new with the same type
     *
     */
    pushNotification(title, text, route = null, routeParams = null, tag = null) {
        this._notifications.push({title, text, id: this._nextNotificationId, route, routeParams, tag});
        this._nextNotificationId++;
        this.emitChange();
    }

    /**
     * return list of notifications
     *
     * @return {array}  [{title: 'string', text: 'string'}]
     */
    get notifications() {
        return this._notifications;
    }

    get newMessageCounts() {
        return this._newMessageCounts;
    }

    get newMAlertCount() {
        return this._newAlertCount;
    }

    get configuration() {
        return this._configuration;
    }

    set configuration(newConfiguration) {
        this._configuration = Object.assign(this._configuration, newConfiguration);
        localStorage.setItem('notificationConfiguration', JSON.stringify(this._configuration));
        if(global.Android) Android.setConfiguration(JSON.stringify(this._configuration));
        this.emitChange();
    }


    /**
     * Return the number of new messages of the given channel
     * @param {string} channel: the channel name
     * @returns {number}
     */
    getNewMessageCount(channel) {
        if (this._newMessageCounts[channel]) {
            return this._newMessageCounts[channel];
        }
        return 0;
    }

    /**
     * set new messages of a given channel to 0
     * @param {string} channel
     */
    _resetNewMessages(channel) {
        let lastReadMessage = MessageStore.getLastChannelMessage(channel);
        this._newMessageCounts[channel] = 0;
        this._lastReadMessages[channel] = lastReadMessage ? lastReadMessage.createdAt : null;

        localStorage.setItem('lastReadMessages', JSON.stringify(this._lastReadMessages));
        this.emitChange();
    }

    /**
     * Handle new Message
     * @param message
     */
    _handleMessageEvent(e) {
        if(e.verb == 'created')
        {
            let message = e.data;
            let user = UserStore.findById(message.userId);
            let team = user ? TeamStore.findById(user.teamId) : null;

            // it's new message only if the sender is not the authenticated user
            if (AuthStore.user.id !== message.userId) {
                // increment the number of unviewed messages for this channel
                this._newMessageCounts[message.channel] = this._newMessageCounts[message.channel] ? this._newMessageCounts[message.channel]+1 : 1;

                // Send notification
                if(!this.configuration.channel || !this.configuration.channel[message.channel] || this.configuration.channel[message.channel] == 'notify') {
                    let contentPrefix = (user? user.name + (team?' ('+team.name+')':'') + ' : ' : '');
                    let route = null;
                    let routeParams = null;
                    if(AuthStore.can('ui/admin')) {
                        route = 'chat.channel';
                        routeParams = {channel: message.channel};
                    }
                    this.pushNotification('Nouveau message sur ' + message.channel.split(':')[1], contentPrefix + message.text, route, routeParams, 'chat/'+message.channel);
                }
                // Emit changes
                this.emitChange();
            }

            // Add this channel to lastRead messages if necessary
            if(!this._lastReadMessages[message.channel]) {
                // Register the "seen date" to one second before this message
                let date = new Date(message.createdAt);
                date.setTime(date.getTime() - 1000);
                this._lastReadMessages[message.channel] = date.toISOString();
                localStorage.setItem('lastReadMessages', JSON.stringify(this._lastReadMessages));
            }
        }
    }

    /**
     * Handle new alert
     * @param message
     */
    _handleAlertEvent(e) {
        if(e.verb == 'created')
        {
            let alert = e.data;
            let team = TeamStore.findById(alert.senderId);

            let receiverFilter = [];
            if(localStorage.getItem('alertReceivers')) {
                try {
                    receiverFilter = JSON.parse(localStorage.getItem('alertReceivers'));
                } catch (e) {
                    receiverFilter = [];
                    console.error('localstorage notificationConfiguration json parsing error', e);
                }
            }

            if (AuthStore.team.id !== alert.senderId && (receiverFilter.length === 0 || receiverFilter.includes(alert.receiverId || null))) {

                // increment the number of unread alerts if not already on the page
                if(browserHistory.getCurrentLocation().pathname == '/dashboard' || browserHistory.getCurrentLocation().pathname == '/alerts') {
                    this._newAlertCount = 0;
                    this._lastReadAlert = (new Date()).toISOString();
                    localStorage.setItem('lastReadAlert', this._lastReadAlert);
                }
                else {
                    this._newAlertCount++;
                }

                // Send notification
                if(this.configuration.alert) {
                    this.pushNotification('Alerte' + (team ? ' de ' + team.name : ''), alert.title, 'alert', null, 'alert');
                }

                // Emit changes
                this.emitChange();
            }
        }
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
            case "AUTH_AUTHENTICATED":
                this._init();
                break;
            case "NOTIFICATIONS_CLEAR":
                this._notifications = [];
                this.emitChange();
                break;
            case "ALERT_VIEWED":
                this._lastReadAlert = (new Date()).toISOString();
                localStorage.setItem('lastReadAlert', this._lastReadAlert);
                this._newAlertCount = 0;
                this.emitChange();
                break;
            case "MESSAGES_VIEWED":
                this._resetNewMessages(action.channel);
                break;
            case "NOTIFICATION_CONFIGURATION":
                this.configuration = action.data;
                break;
        }
    }
}

export default new NotificationStore();
