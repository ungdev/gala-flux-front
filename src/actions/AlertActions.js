import AppDispatcher from '../dispatchers/AppDispatcher.js';

export default {

    newAlert(alert) {
        AppDispatcher.dispatch({
            type: 'NEW_ALERT',
            alert
        });
    },

    getAlerts(alerts) {
        AppDispatcher.dispatch({
            type: 'GET_ALERTS',
            alerts
        });
    }
}
