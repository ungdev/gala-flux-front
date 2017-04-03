import * as constants from '../config/constants';
import NotificationActions from '../actions/NotificationActions';
import WebSocketActions from '../actions/WebSocketActions';
import AuthService from '../services/AuthService';

// Hold the set interval identifier which will try to reconnect every 5 sec
let watchdog = null;

/**
 * Service which will create and manage webSocket connection
 */
class WebSocketService {

    /**
     * connect - Connect to the websocket server if we are not already connected
     */
    connect() {
        if(!global.iosocket || !global.iosocket.isConnected()) {
            global.iosocket = io.sails.connect(constants.webSocketUri);

            iosocket.on('connect', () => {this._handleConnected()});
            iosocket.on('disconnect', () => {this._handleDisconnected()});

            // Show this notification only if it takes some time to connect
            setTimeout(() => {
                if(!iosocket.isConnected()) {
                    NotificationActions.loading('Connexion au serveur perdue..');
                }
            }, 1000);
        }

        // Try to reconnect every 5 seconds
        if(!watchdog) {
            watchdog = setInterval(() => {this.connect()}, 5000);
        }
    }

    _handleConnected() {
        let jwtError = null;
        // Authenticate with stored jwt
        let jwt = localStorage.getItem(constants.jwtName);
        AuthService.tryToAuthenticateConnexion(jwt)
        .then(() => {
            WebSocketActions.connected();
            NotificationActions.hideLoading();
        })
        .catch((error) => {
            if(jwt) {
                jwtError = error;
                localStorage.removeItem(constants.jwtName);
            }

            // Authenticate with jwt stored before 'login as'
            jwt = localStorage.getItem(constants.firstJwtName);
            AuthService.tryToAuthenticateConnexion(jwt)
            .then(() => {
                localStorage.removeItem(constants.firstJwtName);
                WebSocketActions.connected();
                NotificationActions.hideLoading();
            })
            .catch((error) => {
                if(jwt) {
                    jwtError = error;
                }

                // Authenticate with IP
                AuthService.tryToAuthenticateWithIP()
                .then(() => {
                    WebSocketActions.connected();
                    NotificationActions.hideLoading();
                })
                // Ignore this error
                .catch((error) => {
                    WebSocketActions.connected();
                    NotificationActions.hideLoading();
                    if(jwtError) {
                        NotificationActions.error('Votre connexion a expiré, veuillez vous reconnecter.', jwtError);
                    }
                });
            });
        });
    }

    _handleDisconnected() {
        WebSocketActions.disconnected();
    }
}

export default new WebSocketService();
