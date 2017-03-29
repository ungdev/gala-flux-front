import BaseStore from './BaseStore';
import UserService from '../services/UserService';

class UserStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._users = [];

        this._handleUserEvents = this._handleUserEvents.bind(this);
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

    /**
     * init the store : get the existing users and
     * listen to webSocket events about User model
     */
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
        io.socket.on('user', this._handleUserEvents);
    }

    /**
     * Handle webSocket events about the User model
     *
     * @param {object} e : the event
     */
    _handleUserEvents(e) {
        console.log("user store event : ", e);
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
            case "SAVE_JWT":
                this._init();
                break;
        }
    }

}

export default new UserStore();