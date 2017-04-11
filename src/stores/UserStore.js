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

    set users(v) {
        this._modelData = v;
        this.emitChange();
    }

    /**
     * Get the users by team
     *
     * @param {String} id : the team id
     * @returns {Array} the matching users
     */
    getByTeam(id) {
        return this._modelData.filter(user => user.team == id);
    }

    /**
     * Handle webSocket events about the User model
     *
     * @param {object} e : the event
     */
    _handleUserEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this.users = this.users.filter(user => user.id != e.id);
                break;
            case "updated":
                let temp = this.users;
                for (let i = 0; i < temp.length; i++) {
                    if (temp[i].id == e.id) {
                        temp[i] = e.data;
                    }
                }
                this.users = temp;
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
