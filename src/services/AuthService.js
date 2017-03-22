class AuthService {

    constructor() {
        this._jwtName = 'token';
    }

    /**
     * Check if there is a item in the localStorage with the value
     * of this._jwtName as name. The value of this item should be a JWT.
     *
     * @returns {Object|null} A JWT or null if the item is not in the localStorage
     */
    isAuthenticated() {
        return localStorage.getItem(this._jwtName);
    }

    /**
     * Create or update the jwt in the localStorage
     *
     * @param jwt
     */
    saveJWT(jwt) {
        localStorage.setItem(this._jwtName, jwt);
    }

    /**
     * Send an HttpRequest to the server to try to authenticate
     * the client with the IP address
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
                error(jwres);
            }
            success(jwres)
        });
    }

    /**
     * Try to authenticate with oauth (EtuUTT)
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
                error(jwres);
            }
            success(jwres)
        });
    };

    /**
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
                error(jwres);
            }
            success(jwres);
        });
    }

}

export default new AuthService();