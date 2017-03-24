import jwtDecode from 'jwt-decode';

/**
 * Class used for all about Authentication
 */
class AuthService {

    constructor() {
        // The value of _jwtName is the name of the JWT in the localStorage
        this._jwtName = 'token';
        // The value of _loginAsJwtName is the name of the JWT in the localStorage if the user is "login as" someone else
        this._firstJwtName = "firstToken";
        // The jwt (the active account, with the _jwtName) decoded payload
        this._payload = null;

        // binding
        this.requireAuth = this.requireAuth.bind(this);
    }

    /**
     * Return the decoded jwt payload
     * @returns {object|null}
     */
    get payload() {
        return this._payload;
    }

    /**
     * Check if the user is authenticated.
     * Used to protect some routes.
     *
     * Parameters from react-router (onEnter prop)
     *
     * @param nextState
     * @param replace
     * @param callback
     * @returns callback
     */
    requireAuth (nextState, replace, callback) {
        // if there is a JWT in the localStorage
        if (this.getJWT()) {
            return callback();
        }
        // if there is no JWT, send a request to the server in order to try
        // to authenticate the user by his IP address
        this.checkIpAddress(
            success => {
                // save the JWT. Now the User can access the route.
                this.saveJWT(success.body.jwt);
                return callback();
            },
            error => {
                // if the IP address is not valid, redirect him to the home page
                // so he can login with EtuUTT
                replace('/');
                return callback();
            }
        );
    }

    /**
     * Check if there is an item in the localStorage with the value
     * of this._jwtName as name. The value of this item should be a JWT.
     *
     * @returns {String|null} A JWT or null if the item is not in the localStorage
     */
    getJWT() {
        return localStorage.getItem(this._jwtName);
    }

    /**
     * Create or update the JWT in the localStorage
     *
     * @param jwt
     */
    saveJWT(jwt) {
        localStorage.setItem(this._jwtName, jwt);
        this._payload = jwtDecode(jwt);
    }

    /**
     * Send an webSocket request to the server to try to authenticate
     * the user with IP address
     *
     * @callback successCallback
     * @callback errorCallback
     *
     * @param {successCallback} success
     * @param {errorCallback} error
     */
    checkIpAddress(success, error) {
        io.socket.request({
            method: 'post',
            url: '/login/ip'
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            return success(jwres);
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
        io.socket.request({
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
     * @callback successCallback
     * @callback errorCallback
     *
     * @param authorizationCode
     * @param {successCallback} success
     * @param {errorCallback} error
     */
    sendAuthorizationCode(authorizationCode, success, error) {
        io.socket.request({
            method: 'post',
            url: '/login/oauth/submit',
            data: {authorizationCode}
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            return success(jwres);
        });
    }

    /**
     * If there is a jwt in the localStorage, try to authenticate the
     * webSocket connexion by sending the jwt to the server.
     * In case of success, the response contains a new jwt.
     *
     * @return {boolean} the authentication success
     */
    tryToAuthenticateConnexion() {
        let jwt = this.getJWT();
        if (!jwt) {
            return false;
        }
        io.socket.request({
            method: 'post',
            url: '/login/jwt',
            data: {jwt}
        }, (resData, jwres) => {
            if (jwres.error) {
                return false;
            }
            this.saveJWT(jwres.body.jwt);
            return true;
        });
    }

    /**
     * Try to authenticate the user with an other account, by user id.
     * In case of success, the server responds with a JWT.
     *
     * @callback successCallback
     * @callback errorCallback
     *
     * @param {String} id : the user id
     * @param {successCallback} success
     * @param {errorCallback} error
     */
    tryToLoginAs(id, success, error) {
        io.socket.request({
            method: 'post',
            url: '/login/as/' + id
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            // check if the user is already authenticated with an other account
            let firstJwt = localStorage.getItem(this._firstJwtName);
            if (firstJwt) {
                // if it's the case, just replace the current jwt
                this.saveJWT(jwres.body.jwt);
            } else {
                // else, save the current jwt in the localStorage and update the main token
                localStorage.setItem(this._firstJwtName, localStorage.getItem(this._jwtName));
                this.saveJWT(jwres.body.jwt);
            }
            return success(jwres);
        });
    }

    /**
     * Remove the token from the localStorage
     */
    logout() {
        localStorage.removeItem(this._jwtName);
    }

    /**
     * Switch tokens
     */
    backToMainAccount() {
        const firstToken = localStorage.getItem(this._firstJwtName);
        if (firstToken) {
            // remove the item in the localStorage which saves the main account jwt
            localStorage.removeItem(this._firstJwtName);
            // set the main token value and update the websocket connexion
            this.saveJWT(firstToken);
            this.tryToAuthenticateConnexion();
        }
    }

}

export default new AuthService();