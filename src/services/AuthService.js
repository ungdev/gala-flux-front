/**
 * Class used for all about Authentication
 */
class AuthService {

    constructor() {
        // The value of _jwtName is the name of the JWT in the localStorage
        this._jwtName = 'token';

        // binding
        this.requireAuth = this.requireAuth.bind(this);
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
        if (this.isAuthenticated()) {
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
    isAuthenticated() {
        return localStorage.getItem(this._jwtName);
    }

    /**
     * Create or update the JWT in the localStorage
     *
     * @param jwt
     */
    saveJWT(jwt) {
        localStorage.setItem(this._jwtName, jwt);
    }

    /**
     * Send an webSocket request to the server to try to authenticate
     * the user with IP address
     *
     * @callback success
     * @callback error
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
     * @param authorizationCode
     * @callback success
     * @callback error
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
        let jwt = this.isAuthenticated();
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

}

export default new AuthService();