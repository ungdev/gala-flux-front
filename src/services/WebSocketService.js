import * as constants from 'config/constants';
import WebSocketActions from 'actions/WebSocketActions';
import { ApiError } from 'lib/errors';
import socketIOClient from 'socket.io-client';

/**
 * Service which will create and manage webSocket connection
 */
class WebSocketService {

    constructor() {
        // This request ID is used to associate socket request with answer.
        // (because socket io doesn't have any built-in answer system like HTTP)
        this.lastRequestId = 0;

        // Init the global io object
        global.io = socketIOClient(constants.webSocketUri);

        // Hook event listeners
        io.on('connect', this._handleConnection.bind(this));
        io.on('disconnect', this._handleDisconnection.bind(this));
        io.on('refresh', this._handleRefresh.bind(this));

        // Add our request builder method
        io.request = this.request.bind(this);
    }

    /**
     * Flux API Request builder
     * @param {string} method Equivalent of HTTP method (`post`, `get`, `put`)
     * @param {string} url Path of the request (eg: ``/user/12`)
     * @param {Object} data object that will be serialzed (to json) and sent as endpoint parameter
     * @return {Promise} to the request answer or error (timeout or server error)
     */
    request(method, url, data) {
        return new Promise((resolve, reject) => {
            let requestId = ++this.lastRequestId;
            let timeout = null;

            // Emit request
            io.emit('request', {
                method,
                url,
                data: data || null,
                requestId,
            });

            // Listen for answer
            io.once('response-' + requestId, (data) => {
                // Cancel timeout
                clearTimeout(timeout);

                if(data.statusCode != 200) {
                    return reject(new ApiError(data));
                }
                return resolve(data.data);
            });

            // In case of timeout
            timeout = setTimeout(() => {
                // Cancel answer listening
                io.removeAllListeners('response-' + requestId);

                // Throw warning in console
                console.warn('Server timeout on request', {
                    method,
                    url,
                    data: data || null,
                    requestId,
                });

                // We don't throw an error because in case of connetion lost
                // it would force flux to show an error and then force page refresh
                // and we don't want a page refresh in case of lost connection.
                // But it's also not a success, so we do nothing but a warning
                // in the console (and clean the memory by removing listeners)
            }, 30000);

        });
    }

    /**
     * Will be called each time socket.io get connected (first time or reconnection)
     */
    _handleConnection() {
        WebSocketActions.connected();
    }

    /**
     * Will be called on socket connetion lost
     */
    _handleDisconnection() {
        WebSocketActions.disconnected();
    }

    /**
     * Will be called when and admin request a client refresh
     * So we refresh Flux to the homepage
     */
    _handleRefresh() {
        location.href = '/';
    }
}

export default WebSocketService;
