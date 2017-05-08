import AppDispatcher from '../dispatchers/AppDispatcher.js';
import * as constants from '../config/constants';
import NotificationActions from './NotificationActions';
import AuthService from '../services/AuthService'
import router from '../router'

/**
 * Create or update the token in the localStorage
 *
 * Emitted when server is accepted our authentication but we don't have
 * informations about current user
 * @param jwt
 */
function saveJWT (jwt) {
    localStorage.setItem(constants.jwtName, jwt);
    AppDispatcher.dispatch({
        type: 'AUTH_JWT_SAVED',
        jwt
    });

    // Restore "login as" state on page refresh
    if(localStorage.getItem(constants.firstJwtName)) {
        AppDispatcher.dispatch({
            type: 'AUTH_LOGGED_AS'
        });
    }
}

/**
 * Remove token from the localStorage
 */
function logout() {
    localStorage.removeItem(constants.jwtName);
    localStorage.removeItem(constants.firstJwtName);
    router.navigate('home');
    NotificationActions.snackbar('À bientôt !');

    AppDispatcher.dispatch({
        type: 'AUTH_LOGGED_OUT'
    });
}

/**
 * authenticate as someone else
 * @param {string} id Id of the target user
 */
function loginAs(id) {
    return new Promise((resolve, reject) => {
        AuthService.tryToLoginAs(id)
        .then((jwt) => {
            // Backup original jwt
            localStorage.setItem(constants.firstJwtName, localStorage.getItem(constants.jwtName));

            // Save new jwt
            saveJWT(jwt);

            AppDispatcher.dispatch({
                type: 'AUTH_LOGGED_AS'
            });

            return resolve();
        })
        .catch((error) => {
            return reject(error);
        });
    });
}


/**
 * authenticate back to main account after a login as
 */
function loginBack() {
    return new Promise((resolve, reject) => {
        // get original jwt
        let jwt = localStorage.getItem(constants.firstJwtName);
        AuthService.tryToAuthenticateWithJWT(jwt)
        .then((jwt) => {
            // Save new jwt
            saveJWT(jwt);

            // Delete backup jwt
            localStorage.removeItem(constants.firstJwtName);

            AppDispatcher.dispatch({
                type: 'AUTH_LOGGED_BACK'
            });

            return resolve();
        })
        .catch((error) => {
            return reject(error);
        });
    });
}

/**
 * Send user data on authentication
 *
 * Emitted when server has accepted our authentication and then we've got user data
 *
 * @param user Current authenticated user object
 * @param team Current authenticated team object
 */
function authenticated(user, team) {
    AppDispatcher.dispatch({
        type: 'AUTH_AUTHENTICATED',
        user: user,
        team: team,
    });
}

exports.saveJWT = saveJWT;
exports.logout = logout;
exports.loginAs = loginAs;
exports.loginBack = loginBack;
exports.authenticated = authenticated;
