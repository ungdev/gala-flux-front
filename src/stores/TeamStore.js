import BaseStore from './BaseStore';

class TeamStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._teams = [];
    }

    get teams() {
        return this._teams;
    }

    set teams(v) {
        this._teams = v;
        this.emitChange();
    }

    _handleActions(action) {
        switch(action.type) {
            case "GET_TEAMS":
                this.teams = action.teams;
                break;
        }
    }

}

export default new TeamStore();