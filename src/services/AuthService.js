import {ApiError} from 'lib/errors';
import BaseService from 'services/BaseService';

/**
 * Class used to make requests about authentication.
 */
class AuthService extends BaseService {

    constructor() {
        super('auth');
    }

    /**
     * Pull the current role->permission configuration of the server
     *
     * @return {Promise}    Promise that resolve to role->permission association object
     */
    getRoles() {
        return this.request('get', '/auth/roles');
    }

    /**
     * Send an webSocket request to the server to try to authenticate
     * the user with IP address
     *
     * @return {Promise}
     */
    tryToAuthenticateWithIP() {
        return this.request('post', '/auth/ip');
    }

    /**
     * Try to authenticate with oauth (EtuUTT) : Step 1
     * Do a webSocket request to get the EtuUTT redirection link.
     *
     * @return {Promise}
     */
    authWithEtuUTT() {
        return this.request('get', '/auth/oauth');
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
        if(!authorizationCode) {
            return Promise.reject(new Error('No authorizationCode'));
        }
        return this.request('post', '/auth/oauth/submit', {authorizationCode});
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
        if(!jwt) {
            return Promise.reject(new Error('No JWT'));
        }
        return this.request('post', '/auth/jwt', {jwt});
    }

    /**
     * Try to authenticate the user with an other account, by user id.
     * In case of success, the server responds with a JWT.
     *
     * @param {String} id : the user id
     * @return {Promise} Promise for the jwt
     */
    tryToLoginAs(id) {
        return this.request('post',  '/auth/as/' + id);
    }

    /**
     * Inform the server that the user clicked on logout
     *
     * @returns {Promise}
     */
    logout() {
        return this.request('post',  '/auth/logout');
    }

}

export default new AuthService();
