import BaseStore from './BaseStore';

class UserStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._users = [];
    }

    get users() {
        return this._users;
    }

    set users(v) {
        this._users = v;
        this.emitChange();
    }

    /**
     * Get the users by team
     *
     * @param {String} id : the team id
     * @returns {Array} the matching users
     */
    getByTeam(id) {
        return this._users.filter(user => user.team == id);
    }

    _handleActions(action) {
        switch(action.type) {
            case "GET_USERS":
                this.users = action.users;
                break;
        }
    }

}

export default new UserStore();