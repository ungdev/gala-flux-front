import AuthActions from '../actions/AuthActions';
import NotificationActions from '../actions/NotificationActions';
import jwtDecode from 'jwt-decode';

/**
 * Class used to make requests about authentication.
 */
class AuthService {

    getUserData(jwt) {
        return new Promise((resolve, reject) => {
            // first request : get the user
            iosocket.request({
                method: 'get',
                url: '/user/' + jwtDecode(jwt).userId
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(jwres.error);
                }
                AuthActions.getUserData(resData);
                NotificationActions.snackbar('Bonjour ' + resData.name + ' !')
                return resolve();
            });
        });
    }

    /**
     * Send an webSocket request to the server to try to authenticate
     * the user with IP address
     *
     * @return {Promise}
     */
    tryToAuthenticateWithIP() {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'post',
                url: '/login/ip'
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(jwres.error);
                }
                this.getUserData(jwres.body.jwt).
                then(() => {
                    AuthActions.saveJWT(jwres.body.jwt);
                    return resolve();
                })
            });
        });
    }

    /**
     * Try to authenticate with oauth (EtuUTT) : Step 1
     * Do a webSocket request to get the EtuUTT redirection link.
     *
     * @callback success
     * @callback error
     */
    authWithEtuUTT(success, error) {
        iosocket.request({
            method: 'get',
            url: '/login/oauth'
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            return success(jwres);
        });
    }

    /**
     * Try to authenticate with oauth (EtuUTT) : Step 2
     * After been redirected to the EtuUTT website, the user his
     * redirected back here with an authorization code in the URL.
     * We have to send this authorization code to the server.
     * If all is ok, the server send us a JWT.
     *
     * @callback errorCallback
     *
     * @param authorizationCode
     * @return {Promise}
     */
    sendAuthorizationCode(authorizationCode) {
        return new Promise((resolve, reject) => {
            if (!authorizationCode) {
                reject(new Error('No authorizationCode'));
            }
            iosocket.request({
                method: 'post',
                url: '/login/oauth/submit',
                data: {authorizationCode}
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(jwres.error);
                }
                this.getUserData(jwres.body.jwt).
                then(() => {
                    AuthActions.saveJWT(jwres.body.jwt);
                    return resolve();
                });
            });
        })
    }

    /**
     * Cut the current URL and search for the authorization code in it
     * @returns {String|null} The authorization code or null
     */
    getAuthorizationCode() {
        // get the part of the URL after '?'
        const query = (window.location.href).split("?")[1];
        if (query) {
            // look at each parameters
            const parameters = query.split("&");
            for (let i = 0; i < parameters.length; i++) {
                // if the parameter name is authorization_code, return the value
                const parameter = parameters[i].split("=");
                if (parameter[0] == "authorization_code")
                    return parameter[1];
            }
        }
        return null;
    }

    /**
     * If there is a jwt in the localStorage, try to authenticate the
     * webSocket connexion by sending the jwt to the server.
     * In case of success, the response contains a new jwt.
     *
     * @param {String} jwt
     *
     * @return {boolean} the authentication success
     */
    tryToAuthenticateConnexion(jwt) {
        return new Promise((resolve, reject) => {
            if (!jwt) {
                reject(new Error('No JWT'));
            }
            iosocket.request({
                method: 'post',
                url: '/login/jwt',
                data: {jwt}
            }, (resData, jwres) => {
                if (jwres.error) {
                    reject(new Error(jwres.error));
                    return false;
                }
                this.getUserData(jwres.body.jwt).
                then(() => {
                    AuthActions.saveJWT(jwres.body.jwt);
                    return resolve();
                });
            });
        });
    }

    /**
     * Try to authenticate the user with an other account, by user id.
     * In case of success, the server responds with a JWT.
     *
     * @callback callback
     *
     * @param {String} id : the user id
     * @param {callback} callback
     */
    tryToLoginAs(id, callback) {
        iosocket.request({
            method: 'post',
            url: '/login/as/' + id
        }, (resData, jwres) => {
            if (jwres.error) {
                // if there is an error, call the callback with the error
                callback(jwres);
            } else {
                this.getUserData(jwres.body.jwt).
                then(() => {
                    AuthActions.loginAs(jwres.body.jwt);
                    return callback();
                })
            }
        });
    }

}

export default new AuthService();
