import AppDispatcher from 'lib/AppDispatcher.js';

export default {
    /**
     * Emit a websocket connected event
     */
    connected() {
        AppDispatcher.dispatch({
            type: 'WEBSOCKET_CONNECTED',
        });
    },

    /**
     * Emit a websocket disconnected event
     */
    disconnected() {
        AppDispatcher.dispatch({
            type: 'WEBSOCKET_DISCONNECTED',
        });
    }
}
