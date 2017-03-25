import AppDispatcher from '../dispatchers/AppDispatcher.js';
import { browserHistory } from 'react-router';
import * as constants from '../config/constants';

/**
 * Create or update the token in the localStorage
 * @param jwt
 */
function saveJWT (jwt) {
    localStorage.setItem(constants.jwtName, jwt);

    AppDispatcher.dispatch({
        type: 'SAVE_JWT',
        jwt
    });

    browserHistory.push('/bar');
}

/**
 * Remove token from the localStorage
 */
function logout() {
    localStorage.removeItem(constants.jwtName);

    AppDispatcher.dispatch({
        type: 'LOGOUT'
    });

    browserHistory.push('/');
}

/**
 * Switch tokens to come back to the main account
 */
function backToMainAccount() {
    const firstToken = localStorage.getItem(constants.firstJwtName);
    if (firstToken) {
        // remove the item in the localStorage which saves the main account jwt
        localStorage.removeItem(constants.firstJwtName);
        // set the main token value and update the webSocket connexion
        saveJWT(firstToken);

        AppDispatcher.dispatch({
            type: 'LOGOUT_AS'
        });
    }
}

/**
 * Try to login as someone else.
 * We keep the first jwt (= main account)
 *
 * @param newJWT
 */
function loginAs(newJWT) {
    // check if the user is already authenticated with an other account
    let firstJwt = localStorage.getItem(constants.firstJwtName);
    // if not, save the current jwt in the localStorage and update the main token
    if (!firstJwt) {
        // if it's the case, just replace the current jwt
        localStorage.setItem(constants.firstJwtName, localStorage.getItem(constants.jwtName));
    }
    // replace the current jwt
    saveJWT(newJWT);

    AppDispatcher.dispatch({
        type: 'LOGIN_AS'
    });
}

/**
 * Send authenticated user's data
 * @param data
 */
function getUserData(data) {
    AppDispatcher.dispatch({
        type: 'GET_USER_DATA',
        data
    });
}

exports.saveJWT = saveJWT;
exports.logout = logout;
exports.backToMainAccount = backToMainAccount;
exports.loginAs = loginAs;
exports.getUserData = getUserData;
