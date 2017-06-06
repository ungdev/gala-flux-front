import AppDispatcher from 'lib/AppDispatcher.js';
import * as constants from 'config/constants';
import NotificationActions from 'actions/NotificationActions';
import AuthService from 'services/AuthService';

export default {

    /**
     * Remove token from the localStorage
     */
    logout() {
        AppDispatcher.dispatch({
            type: 'AUTH_LOGOUT'
        });
    },

    /**
     * authenticate as someone else
     * @param {string} id Id of the target user
     */
    loginAs(id) {
        AppDispatcher.dispatch({
            type: 'AUTH_LOGIN_AS',
            userId: id,
        });
    },

    /**
     * authenticate back to main account after a login as
     */
    loginBack() {
        AppDispatcher.dispatch({
            type: 'AUTH_LOGIN_BACK'
        });
    },

    /**
     * Inform all stores that we are authenticated to server and they can start pulling data.
     *
     * Emitted when server has accepted our authentication but that doesn't mean
     * AuthStore knows everything about user. You have to wait for AuthStore.ready
     * for that.
     */
    authenticated() {
        AppDispatcher.dispatch({
            type: 'AUTH_AUTHENTICATED',
        });
    },

    /**
     * Inform all stores that we will not be authenticated, so We can act as guest.
     */
    notAuthenticated() {
        AppDispatcher.dispatch({
            type: 'AUTH_NOT_AUTHENTICATED',
        });
    },

    /**
     * Indicate to stores that EtuUTT auth is started
     */
    authEtuuttStarted() {
        AppDispatcher.dispatch({
            type: 'AUTH_ETUUTT_STARTED'
        });
    },

    /**
     * Indicate to stores that EtuUTT auth is done
     */
    authEtuuttDone() {
        AppDispatcher.dispatch({
            type: 'AUTH_ETUUTT_DONE'
        });
    },
}
