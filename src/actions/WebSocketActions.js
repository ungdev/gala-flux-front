import AppDispatcher from '../dispatchers/AppDispatcher.js';

/**
 * Emit a websocket connected event
 */
function connected () {
    AppDispatcher.dispatch({
        type: 'WEBSOCKET_CONNECTED',
    });
}
/**
 * Emit a websocket disconnected event
 */
function disconnected () {
    AppDispatcher.dispatch({
        type: 'WEBSOCKET_DISCONNECTED',
    });
}

exports.connected = connected;
exports.disconnected = disconnected;
