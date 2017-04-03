import AuthActions from '../actions/AuthActions';
import jwtDecode from 'jwt-decode';

/**
 * Class used to make requests about authentication.
 */
class AuthService {

    getUserData(jwt) {
        // first request : get the user
        io.socket.request({
            method: 'get',
            url: '/user/' + jwtDecode(jwt).userId
        }, (resData, jwres) => {
            AuthActions.getUserData(resData);
        });
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
            this.getUserData(jwres.body.jwt);
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
     * @callback errorCallback
     *
     * @param authorizationCode
     * @param {errorCallback} error
     */
    sendAuthorizationCode(authorizationCode, error) {
        io.socket.request({
            method: 'post',
            url: '/login/oauth/submit',
            data: {authorizationCode}
        }, (resData, jwres) => {
            if (jwres.error) {
                return error(jwres);
            }
            this.getUserData(jwres.body.jwt);
            AuthActions.saveJWT(jwres.body.jwt);
        });
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
        if (!jwt) {
            return false;
        }
        io.socket.request({
            method: 'post',
            url: '/login/jwt',
            data: {jwt}
        }, (resData, jwres) => {
            if (jwres.error) {
                console.log("try to authenticate error : ", jwres.error);
                return false;
            }
            this.getUserData(jwres.body.jwt);
            AuthActions.saveJWT(jwres.body.jwt);
            return true;
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
        io.socket.request({
            method: 'post',
            url: '/login/as/' + id
        }, (resData, jwres) => {
            if (jwres.error) {
                // if there is an error, call the callback with the error
                callback(jwres);
            } else {
                this.getUserData(jwres.body.jwt);
                AuthActions.loginAs(jwres.body.jwt);
                callback();
            }
        });
    }

}

export default new AuthService();