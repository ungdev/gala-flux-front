import * as constants from 'config/constants';
import NotificationActions from 'actions/NotificationActions';
import WebSocketActions from 'actions/WebSocketActions';
import AuthService from 'services/AuthService';
import AuthActions from 'actions/AuthActions';
import socketIOClient from 'socket.io-client';
import {ApiError} from 'errors';
import router from 'router';

// Hold the set interval identifier which will try to reconnect every 5 sec
let watchdog = null;

// This request ID is used to associate socket request with answer. (socket io doesn't have any built-in answer system like HTTP)
let lastRequestId = 0;

/**
 * Service which will create and manage webSocket connection
 */
class WebSocketService {

    /**
     * connect - Connect to the websocket server if we are not already connected
     */
    connect() {
        if(!global.io) { //  || !global.io.isConnected()
            global.io = socketIOClient.connect(constants.webSocketUri, {reconnect: true});

            io.on('connect', () => this._handleConnected());
            io.on('disconnect', () => this._handleDisconnected());
            io.on('refresh', () => this._handleRefresh());


            // When we wan to start a new fake HTTP request
            // TODO implement timeout
            io.request = (data) => {
                return new Promise((resolve, reject) => {
                    data.requestId = ++lastRequestId;

                    io.emit('request', data);
                    io.once('response-' + data.requestId, (data) => {
                        if(data.statusCode != 200) {
                            return reject(new ApiError(data));
                        }
                        return resolve(data.data);
                    });
                });
            };
        }

        // Try to reconnect every 5 seconds
        // if(!watchdog) {
            // watchdog = setInterval(() => this.connect(), 5000);
        // }
    }

    _handleConnected() {
        let jwtError = null;
        // Authenticate with stored jwt
        let jwt = localStorage.getItem(constants.jwtName);
        console.log('Authenticate with jwt', jwt)
        AuthService.tryToAuthenticateWithJWT(jwt)
        .then((data) => {
            AuthActions.saveJWT(data.jwt);
            WebSocketActions.connected();
        })
        .catch((error) => {
            if(jwt) {
                jwtError = error;
                localStorage.removeItem(constants.jwtName);
            }

            // Authenticate with jwt stored before 'login as'
            jwt = localStorage.getItem(constants.firstJwtName);
            AuthService.tryToAuthenticateWithJWT(jwt)
            .then((data) => {
                AuthActions.saveJWT(data.jwt);
                localStorage.removeItem(constants.firstJwtName);
                WebSocketActions.connected();
            })
            .catch((error) => {
                if(jwt) {
                    jwtError = error;
                }

                // Authenticate via EtuUTT
                let authCode = AuthService.getAuthorizationCode();
                if(authCode) {
                    AuthActions.authEtuuttStarted();
                }
                AuthService.sendAuthorizationCode(authCode)
                .then((data) => {
                    AuthActions.saveJWT(data.jwt);
                    history.replaceState({}, 'Flux', '/');
                    router.navigate('home');
                    AuthActions.authEtuuttDone();
                })
                .catch((error) => {
                    router.navigate('home');
                    AuthActions.authEtuuttDone();
                    if(authCode) {
                        if(error && error.status == 'LoginNotFound') {
                            NotificationActions.error('Un administrateur de Flux doit vous ajouter avant que vous puissiez vous connecter.', error, null, true);
                        }
                        else {
                            NotificationActions.error('Une erreur s\'est produite pendant votre authentification via EtuUTT. Veuillez recommencer.', error, null, true);
                        }
                    }

                    console.log('Auth par ip try')
                    // Authenticate with IP
                    AuthService.tryToAuthenticateWithIP()
                    .then((data) => {
                        console.log('Auth par ip success', data.jwt)
                        AuthActions.saveJWT(data.jwt);
                        WebSocketActions.connected();
                        AuthActions.authEtuuttDone();
                    })
                    // Ignore this error
                    .catch((error) => {
                        AuthActions.noJWT();
                        WebSocketActions.connected();
                        AuthActions.authEtuuttDone();
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

    _handleRefresh() {
        location.href = '/';
    }
}

export default new WebSocketService();
