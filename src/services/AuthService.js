import {ApiError} from '../errors';

/**
 * Class used to make requests about authentication.
 */
class AuthService {
    /**
     * Pull the current role->permission configuration of the server
     *
     * @return {Promise}    Promise that resolve to role->permission association object
     */
    getRoles() {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                url: '/login/roles'
            }, (resData, jwres) => {
                if(jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
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
                    return reject(new ApiError(jwres));
                }
                return resolve(jwres.body.jwt);
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
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'get',
                url: '/login/oauth'
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(resData);
            });
        });
    }

    /**
     * Try to authenticate with oauth (EtuUTT) : Step 2
     * After been redirected to the EtuUTT website, the user his
     * redirected back here with an authorization code in the URL.
     * We have to send this authorization code to the server.
     * If all is ok, the server send us a JWT.
     *
     * @param authorizationCode
     * @return {Promise} Promise for the jwt
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
                    return reject(new ApiError(jwres));
                }
                return resolve(jwres.body.jwt);
            });
        });
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
     * @return {Promise} Promise for the new authenticated jwt
     */
    tryToAuthenticateWithJWT(jwt) {
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
                    return reject(new ApiError(jwres));
                }
                return resolve(jwres.body.jwt);
            });
        });
    }

    /**
     * Try to authenticate the user with an other account, by user id.
     * In case of success, the server responds with a JWT.
     *
     * @param {String} id : the user id
     * @return {Promise} Promise for the jwt
     */
    tryToLoginAs(id) {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'post',
                url: '/login/as/' + id
            }, (resData, jwres, tmp) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve(jwres.body.jwt);
            });
        });
    }

    /**
     * Inform the server that the user clicked on logout
     *
     * @returns {Promise}
     */
    logout() {
        return new Promise((resolve, reject) => {
            iosocket.request({
                method: 'post',
                url: '/logout'
            }, (resData, jwres) => {
                if (jwres.error) {
                    return reject(new ApiError(jwres));
                }
                return resolve();
            })
        });
    }

}

export default new AuthService();
