import * as constants from 'config/constants';
import { browserHistory } from 'react-router';
import jwtDecode from 'jwt-decode';
import BaseStore from 'stores/BaseStore';
import AuthService from 'services/AuthService';
import UserStore from 'stores/UserStore';
import TeamStore from 'stores/TeamStore';
import AuthActions from 'actions/AuthActions';
import SessionService from 'services/SessionService';
import NotificationActions from 'actions/NotificationActions';

class AuthStore extends BaseStore {

    constructor() {
        super();

        // hold the userId read from a jwt
        this._userId = null;

        // Hold the value used to indicate if client has lost connection to serveur
        // It doesn't mean that we are authenticated
        // If null we didn't even try to connect yet
        this._connected = null;

        // True when user data is ready after boot (never come back to false on ready)
        this._ready = false;

        // True if an etuutt authentication (step 2) is started
        this._etuuttLoading = false;

        // if the user is logged as someone else
        this._loginAs = (localStorage.getItem(constants.firstJwtName) !== null);

        // contains data about the authenticated user
        this._user = null;

        // contains data about the teams
        this._team = null;

        // Roles->permission configuration
        // No need to listen to roles updates, because configuration can only
        // change on server reboot wich will trigger re-authentication anyway
        this._roles = null;

        // Store tokens
        this._TeamStoreToken = null;
        this._UserStoreToken = null;

        // Binding
        this._updateData = this._updateData.bind(this);
    }

    /**
     * Check if the authenticated user has the permission
     *
     * @param  {string} permission permission name
     * @param  {Team} team If given, the permission will be tested on this team. Else on the user's team.
     * @return {boolean}            true if the user has the permission
     */
    can(permission, team) {
        if(team) {
            return (this.roles && this.roles[team.role] && this.roles[team.role].indexOf(permission) !== -1);
        }
        return (this.roles && this.permissions.indexOf(permission) !== -1);
    }

    /**
     * Public getters
     */
    get connected() {
        return this._connected;
    }
    get ready() {
        return this._ready;
    }
    get etuuttLoading() {
        return this._etuuttLoading;
    }
    get loginAs() {
        return this._loginAs;
    }
    get user() {
        return Object.freeze(this._user);
    }
    get team() {
        return Object.freeze(this._team);
    }
    get roles() {
        return Object.freeze(this._roles);
    }
    get permissions() {
        return (this._roles && this._team) ? this._roles[this._team.role] : [];
    }


    /**
     * Will set the value of the attribute
     * and emit a change event if the value has changed
     * Warning: Simple strict comparaison, don't use with object
     * @param {string} attribute
     * @param {mixed} value
     */
    _setAndEmit(attribute, value) {
        let change = (this[attribute] !== value);
        this[attribute] = value;
        if (change) {
            this.emitChange();
        }
    }

    /**
     * Try to authenticate user to the server and set all authentication vars
     * called after a socket connection
     */
    _authenticate() {
        let jwtError = null;
        let authCode = null;

            // If AuthorisationCode in in uri try to authenticate with it
        authCode = browserHistory.getCurrentLocation().query.authorization_code;
        return AuthService.authByEtuUTT(authCode)
        .then((data) => {
            // On EtuUTT auth success save jwt and remove authcode
            localStorage.setItem(constants.jwtName, data.jwt);
            AuthActions.authenticated();
            browserHistory.replace(browserHistory.getCurrentLocation().pathname);
        })
        .catch((error) => {
            // Remove authcode from uri
            browserHistory.replace(browserHistory.getCurrentLocation().pathname);
            this._setAndEmit('_etuuttLoading', false);
            // Handle etuutt error
            if(authCode) {
                if(error && error.status == 'LoginNotFound') {
                    NotificationActions.error('Un administrateur de Flux doit vous ajouter avant que vous puissiez vous connecter.', error, null, true);
                }
                else {
                    NotificationActions.error('Une erreur s\'est produite pendant votre authentification via EtuUTT. Veuillez recommencer.', error, null, true);
                }
            }

            // Try to use stored jwt
            let jwt = localStorage.getItem(constants.jwtName);
            AuthService.authByJWT(jwt)
            .then((data) => {
                localStorage.setItem(constants.jwtName, data.jwt);
                AuthActions.authenticated();
            })
            .catch((error) => {
                localStorage.removeItem(constants.jwtName);

                // Authenticate with jwt stored before 'login as'
                jwt = localStorage.getItem(constants.firstJwtName);
                return AuthService.authByJWT(jwt)
                .then((data) => {
                    localStorage.removeItem(constants.firstJwtName);
                    localStorage.setItem(constants.jwtName, data.jwt);
                    AuthActions.authenticated();
                })
                .catch((error) => {
                    localStorage.removeItem(constants.jwtName);

                    // Authenticate with IP
                    return AuthService.authByIP()
                    .then((data) => {
                        localStorage.setItem(constants.jwtName, data.jwt);
                        AuthActions.authenticated();
                    })
                    // Ignore this error
                    .catch((error) => {
                        AuthActions.notAuthenticated();
                    });
                });
            });
        });
    }

    /**
     * Try to authenticate user to the server with the given jwt (for login back)
     */
    _authenticateByJWT(jwt) {
        AuthService.authByJWT(jwt)
        .then(({jwt}) => {
            // As our id may have change we need to clear the stores
            this._ready = false;
            this._user = null;
            this._team = null;
            this._roles = null;
            this._userId = null;
            this._loginAs = (localStorage.getItem(constants.firstJwtName) !== null);
            UserStore.removeChangeListener(this._updateData);
            TeamStore.removeChangeListener(this._updateData);
            browserHistory.push('/');

            // Set new jwt
            localStorage.setItem(constants.jwtName, jwt);
            AuthActions.authenticated();
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant votre authentification manuelle. Veuillez recommencer.', error);
        });
    }


    /**
     * Try to authenticate user to the server with antoher user id (for login as)
     */
    _authenticateByUserId(id) {
        AuthService.authByUserId(id)
        .then(({jwt}) => {
            // As our id should change we need to clear the stores
            this._ready = false;
            this._user = null;
            this._team = null;
            this._roles = null;
            this._userId = null;
            this._loginAs = (localStorage.getItem(constants.firstJwtName) !== null);
            UserStore.removeChangeListener(this._updateData);
            TeamStore.removeChangeListener(this._updateData);
            browserHistory.push('/');

            // Set new jwt
            localStorage.setItem(constants.jwtName, jwt);
            AuthActions.authenticated();
        })
        .catch((error) => {
            NotificationActions.error('Une erreur s\'est produite pendant votre authentification manuelle. Veuillez recommencer.', error);
        });
    }

    /**
     * Load user and team data after a successful authentication
     */
    _loadData() {
        // This function has to be called only once
        // So ignore if it is called again (in case of reconnection for instance)
        if(this.ready) return;

        // Get user id
        let data = jwtDecode(localStorage.getItem(constants.jwtName));
        this._userId = parseInt(data.userId);
        if(!this._userId) return console.error('User ID not found in JWT');

        // Run some promises in parralel
        let promises = [];

        // Request user data
        promises[0] = UserStore.loadData({id: this._userId})
        .then(data => {
            // ensure that last token doen't exist anymore.
            UserStore.unloadData(this._UserStoreToken);

            // save the component token
            this._UserStoreToken = data.token;

            // save the new value
            if(!data.result || !data.result.first) {
                throw new Error('User not found.');
            }
            this._user = data.result.first;

            // Request team data
            return TeamStore.loadData({id: this._user.teamId});
        })
        .then(data => {
            // ensure that last token doen't exist anymore.
            UserStore.unloadData(this._TeamStoreToken);

            // save the component token
            this._TeamStoreToken = data.token;

            // save the new value
            if(!data.result || !data.result.first) {
                throw new Error('Team not found.');
            }
            this._team = data.result.first;

            // Subscribe to each stores
            UserStore.addChangeListener(this._updateData);
            TeamStore.addChangeListener(this._updateData);
        });

        // Get roles
        promises[1] = AuthService.getRoles()
        .then(data => {
            this._roles = data;
        });

        // Wait for all promises
        Promise.all(promises)
        .then(() => {
            this._ready = true;
            this._loginAs = (localStorage.getItem(constants.firstJwtName) !== null);
            this.emitChange();
        })
        .catch(error => {
            // Ensure all vars are reset so this function can run again
            this._ready = false;
            this._user = null;
            this._team = null;
            this._roles = null;
            this._userId = null;
            this._loginAs = (localStorage.getItem(constants.firstJwtName) !== null);
            this.emitChange();
            NotificationActions.error('Une erreur s\'est produite pendant la récupération des infomraitons sur l\'utilisateur.', error);
        });
    }

    /**
     * Will be called when team or user store has been updated
     * This function will update user and team according to new store value
     * and send a change event in case of a change.
     */
    _updateData() {
        let newUser = UserStore.find({id: this._userId}).first;
        let newTeam = TeamStore.find({id: newUser && newUser.teamId}).first;

        // In case of removal
        if(!newUser || !newTeam) {
            localStorage.removeItem(constants.jwtName);
            this._user = null;
            this._team = null;
            this._userId = null;
            this._loginAs = (localStorage.getItem(constants.firstJwtName) !== null);
            this.emitChange();
            NotificationActions.error('Votre utilisateur ou votre équipe a été supprimé. Vous êtes maintenant déconnecté.',null,e);
            return;
        }

        let notify = false;
        // Compare user
        let tmpNewUser = Object.assign({}, newUser);
        let tmpUser = Object.assign({}, this._user);
        delete tmpNewUser.createdAt;
        delete tmpUser.createdAt;
        delete tmpNewUser.updatedAt;
        delete tmpUser.updatedAt;
        if(JSON.stringify(tmpNewUser) != JSON.stringify(tmpUser)) {
            console.log('user change', tmpNewUser, tmpUser)
            notify = true;
        }
        this._user = newUser;

        // Compare team
        let tmpNewTeam = Object.assign({}, newTeam);
        let tmpTeam = Object.assign({}, this._team);
        delete tmpNewTeam.createdAt;
        delete tmpTeam.createdAt;
        delete tmpNewTeam.updatedAt;
        delete tmpTeam.updatedAt;
        if(JSON.stringify(tmpNewTeam) != JSON.stringify(tmpTeam)) {
            console.log('team change', tmpNewTeam, tmpTeam)
            notify = true;
        }
        this._team = newTeam;

        if(notify) {
            console.log('Authstore emit change');
            this.emitChange();
        }
    }

    _handleActions(action) {
        super._handleActions(action);
        switch(action.type) {
            case "WEBSOCKET_CONNECTED":
                this._setAndEmit('_connected', true);
                this._authenticate();
                break;
            case "WEBSOCKET_DISCONNECTED":
                this._setAndEmit('_connected', false);
                break;
            case "AUTH_ETUUTT_STARTED":
                this._setAndEmit('_etuuttLoading', true);
                break;
            case "AUTH_ETUUTT_DONE":
                this._setAndEmit('_etuuttLoading', false);
                break;
            case "AUTH_AUTHENTICATED":
                this._loadData();
                break;
            case "AUTH_NOT_AUTHENTICATED":
                this._setAndEmit('_ready', true);
                break;
            case "AUTH_LOGIN_BACK": {
                // Find old jwt
                let jwt = localStorage.getItem(constants.firstJwtName);
                localStorage.removeItem(constants.firstJwtName);
                if(!jwt) {
                    console.warn('Login back requested without original jwt.');
                    this._setAndEmit('_loginAs', false);
                    return;
                }

                this._authenticateByJWT(jwt);
                break;
            }
            case "AUTH_LOGIN_AS": {
                // Save old jwt
                if(!localStorage.getItem(constants.firstJwtName)) {
                    localStorage.setItem(constants.firstJwtName, localStorage.getItem(constants.jwtName));
                }
                this._authenticateByUserId(action.userId);
                break;
            }
            case "AUTH_LOGOUT": {
                // Tell the server we logout but don't wait for the answer
                AuthService.logout();

                // We refresh the page becase the user may use logout as a "problem fixer"
                // And a refresh can be good to fix problems and clean everything.
                localStorage.removeItem(constants.jwtName);
                localStorage.removeItem(constants.firstJwtName);
                console.log('Logout refresh')
                location.href = '/';
                break;
            }
        }
    }
}

export default new AuthStore();
