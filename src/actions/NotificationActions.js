import AppDispatcher from '../dispatchers/AppDispatcher.js';

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
     * error - Show a loading message
     *
     * @param {String} message Message that will be shown to the user],
     */
    loading(message) {

        AppDispatcher.dispatch({
            type: 'LOADING',
            data: message,
        });
    },

    /**
     * error - Hide the loading message
     */
    hideLoading() {

        AppDispatcher.dispatch({
            type: 'LOADING',
            data: null,
        });
    },

}
