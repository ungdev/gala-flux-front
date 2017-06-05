import AppDispatcher from 'lib/AppDispatcher.js';

export default {

    alertClosed(id) {
        AppDispatcher.dispatch({
            type: 'ALERT_CLOSED',
            id
        });
    },

    /**
     * reset the new alert counter
     */
    alertViewed() {
        AppDispatcher.dispatch({
            type: 'ALERT_VIEWED'
        });
    },
}
