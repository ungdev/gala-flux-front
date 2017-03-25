import jwtDecode from 'jwt-decode';
import BaseStore from './BaseStore';

class AuthStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._jwt = null;
    }

    get jwt() {
        return this._jwt;
    }

    _setJWT(jwt) {
        this._jwt = jwt;
        this.emitChange();
    }

    _handleActions(action) {
        switch(action.type) {
            case "SAVE_JWT":
                this._setJWT(jwtDecode(action.jwt));
                break;
            case "LOGOUT":
                this._setJWT(null);
                break;
        }
    }

}

export default new AuthStore();