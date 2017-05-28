import AppDispatcher from 'dispatchers/AppDispatcher.js';
import * as constants from 'config/constants';
import NotificationActions from 'actions/NotificationActions';
import AuthService from 'services/AuthService';
import router from 'router';

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
 * Emitted when client admin we are not logged in
 */
function noJWT () {
    AppDispatcher.dispatch({
        type: 'AUTH_JWT_NONE'
    });
}

/**
 * Remove token from the localStorage
 */
function logout() {
    localStorage.removeItem(constants.jwtName);
    localStorage.removeItem(constants.firstJwtName);

    location.reload();

    router.navigate('home');
    NotificationActions.snackbar('À bientôt !');
    location.href = '/';
}

/**
 * authenticate as someone else
 * @param {string} id Id of the target user
 */
function loginAs(id) {
    return new Promise((resolve, reject) => {
        AuthService.tryToLoginAs(id)
        .then(({jwt}) => {
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
        .then(({jwt}) => {
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

/**
 * Indicate to stores that EtuUTT auth is started
 */
function authEtuuttStarted() {
    AppDispatcher.dispatch({
        type: 'AUTH_ETUUTT_STARTED'
    });
}

/**
 * Indicate to stores that EtuUTT auth is done
 */
function authEtuuttDone() {
    AppDispatcher.dispatch({
        type: 'AUTH_ETUUTT_DONE'
    });
}

exports.saveJWT = saveJWT;
exports.noJWT = noJWT;
exports.logout = logout;
exports.loginAs = loginAs;
exports.loginBack = loginBack;
exports.authenticated = authenticated;
exports.authEtuuttStarted = authEtuuttStarted;
exports.authEtuuttDone = authEtuuttDone;
