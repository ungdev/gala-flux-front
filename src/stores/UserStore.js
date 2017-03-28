import BaseStore from './BaseStore';
import UserService from '../services/UserService';

class UserStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._users = [];

        this._handleUser = this._handleUser.bind(this);
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

    _init() {
        // fill the users attribute
        UserService.getUsers(
            success => {
                this.users = success;
                console.log("success : ", success);
            },
            err => {
                console.log("get users error yolo : ", err);
            }
        );
        // listen model changes
        io.socket.on('user', this._handleUser);
    }

    _handleUser(e) {
        switch (e.verb) {
            case "destroyed":
                this.users = this.users.filter(user => user.id != e.id);
                break;
        }
    }

    _handleActions(action) {
        switch(action.type) {
            case "SAVE_JWT":
                this._init();
                break;
        }
    }

}

export default new UserStore();