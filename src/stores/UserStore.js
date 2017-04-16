import BaseStore from './BaseStore';
import UserService from '../services/UserService';

class UserStore extends BaseStore {

    constructor() {
        super('user', UserService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get users() {
        return this.getUnIndexedData();
    }

    /**
     * Handle Actions from UserActions
     *
     * @param {object} action : the action
     */
    _handleActions(action) {
        switch(action.type) {
            case "WEBSOCKET_DISCONNECTED":
                this._modelData = [];
                break;
        }
    }

}

export default new UserStore();
