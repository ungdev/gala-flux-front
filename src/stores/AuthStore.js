import jwtDecode from 'jwt-decode';
import BaseStore from './BaseStore';

class AuthStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        // active account
        this._jwt = null;

        // is not null if the user is logged as someone else
        this._loginAs = false;

        // contains data about the authenticated user
        this._user = null;
    }

    get jwt() {
        return this._jwt;
    }

    get loginAs() {
        return this._loginAs;
    }

    get user() {
        return this._user;
    }

    set loginAs(v) {
        this._loginAs = v;
        this.emitChange();
    }

    set jwt(v) {
        this._jwt = v;
        this.emitChange();
    }

    set user(v) {
        console.log('USER : ', v);
        this._user = v;
        this.emitChange();
    }

    _handleActions(action) {
        switch(action.type) {
            case "SAVE_JWT":
                this.jwt = jwtDecode(action.jwt);
                break;
            case "LOGOUT":
                this.loginAs = false;
                this.jwt = null;
                this.user = null;
                break;
            case "LOGIN_AS":
                this.loginAs = true;
                break;
            case "LOGOUT_AS":
                this.loginAs = false;
                break;
            case "GET_USER_DATA":
                this.user = action.data;
                break;
        }
    }

}

export default new AuthStore();