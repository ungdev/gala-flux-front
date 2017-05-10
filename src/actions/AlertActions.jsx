import AppDispatcher from 'dispatchers/AppDispatcher.js';

export default {

    alertClosed(id) {
        AppDispatcher.dispatch({
            type: 'ALERT_CLOSED',
            id
        });
    }
}
