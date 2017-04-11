import BaseStore from './BaseStore';
import UserService from '../services/UserService';

class UserStore extends BaseStore {

    constructor() {
        super('user', UserService.getUsers);

        this.subscribe(() => this._handleActions.bind(this));

        this._handleUserEvents = this._handleUserEvents.bind(this);
    }

    get users() {
        return this._modelData;
    }

    /**
     * Handle webSocket events about the User model
     *
     * @param {object} e : the event
     */
    _handleUserEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._delete(e.id);
                break;
            case "updated":
                this._set(e.id, e.data);
                break;
        }
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
