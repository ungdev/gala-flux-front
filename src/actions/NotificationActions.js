import AppDispatcher from 'dispatchers/AppDispatcher.js';

export default {


    /**
     * error - Throw error to the user
     *
     * @param {String} message Message that will be shown to the user],
     * @param {Error} error Optional Javascript Error object,
     * @param {Object|String} details Optional additionnal object or string that will be shown in the console,
     * @param {boolean} refresh Optional boolean that tell if the browser should be refreshed after error acknoledgment,
     * @param {integer} timeout Optional number of seconds before auto-acknowledgement of the error
     */
    error(message, error, details, refresh, timeout) {
        AppDispatcher.dispatch({
            type: 'ERROR',
            data: {message, error, details, refresh, timeout, stack: (new Error('NotificationError').stack)},
        });
        if(console.trace) {
            console.trace();
        }
    },


    /**
     * error - Show a snackbar message
     *
     * @param {String} message Message that will be shown to the user],
     */
    snackbar(message) {

        AppDispatcher.dispatch({
            type: 'SNACKBAR',
            data: message,
        });

    },


    /**
     * Clear the notification list but not last message and last alert count
     *
     * @param {Alert} alert Alert object
     */
    clearNotifications() {
        AppDispatcher.dispatch({
            type: 'NOTIFICATIONS_CLEAR',
            data: alert,
        });
    },



    /**
     * Show a chat message notification according to user settings
     *
     * @param {Message} message Chat message object
     */
    notifyChatMessage(message) {

        AppDispatcher.dispatch({
            type: 'CHAT_NOTIFICATION',
            data: message,
        });
    },

}
