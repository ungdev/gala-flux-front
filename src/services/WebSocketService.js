import * as constants from 'config/constants';
import NotificationActions from 'actions/NotificationActions';
import WebSocketActions from 'actions/WebSocketActions';
import AuthService from 'services/AuthService';
import AuthActions from 'actions/AuthActions';
import router from 'router';

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

            iosocket.on('connect', () => this._handleConnected());
            iosocket.on('disconnect', () => this._handleDisconnected());
        }
    }

    _handleConnected() {
        let jwtError = null;
        // Authenticate with stored jwt
        let jwt = localStorage.getItem(constants.jwtName);
        AuthService.tryToAuthenticateWithJWT(jwt)
        .then((jwt) => {
            AuthActions.saveJWT(jwt);
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
            AuthService.tryToAuthenticateWithJWT(jwt)
            .then((jwt) => {
                AuthActions.saveJWT(jwt);
                localStorage.removeItem(constants.firstJwtName);
                WebSocketActions.connected();
                NotificationActions.hideLoading();
            })
            .catch((error) => {
                if(jwt) {
                    jwtError = error;
                }

                // Authenticate via EtuUTT
                let authCode = AuthService.getAuthorizationCode();
                if(authCode) {
                    NotificationActions.loading('Connexion depuis EtuUTT en cours..');
                }
                AuthService.sendAuthorizationCode(authCode)
                .then((jwt) => {
                    AuthActions.saveJWT(jwt);
                    history.replaceState({}, 'Flux', '/');
                    router.navigate('home');
                    NotificationActions.hideLoading();
                })
                .catch((error) => {
                    router.navigate('home');
                    NotificationActions.hideLoading();
                    if(authCode) {
                        if(error && error.status == 'LoginNotFound') {
                            NotificationActions.error('Un administrateur de Flux doit vous ajouter avant que vous puissiez vous connecter.', error, null, true);
                        }
                        else {
                            NotificationActions.error('Une erreur s\'est produite pendant votre authentification via EtuUTT. Veuillez recommencer.', error, null, true);
                        }
                    }

                    // Authenticate with IP
                    AuthService.tryToAuthenticateWithIP()
                    .then((jwt) => {
                        AuthActions.saveJWT(jwt);
                        WebSocketActions.connected();
                        NotificationActions.hideLoading();
                    })
                    // Ignore this error
                    .catch((error) => {
                        WebSocketActions.connected();
                        NotificationActions.hideLoading();
                        if(jwtError) {
                            AuthActions.logout();
                            location.href = '/';
                        }
                    });
                });
            });
        });
    }

    _handleDisconnected() {
        WebSocketActions.disconnected();
    }
}

export default new WebSocketService();
