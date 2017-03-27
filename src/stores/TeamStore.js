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

    /**
     * Search a team by his id and return his name.
     * If the team can't be found, return null
     *
     * @param {string} id : the team id
     * @returns {String|null}
     */
    getTeamName(id) {
        for (let team of this._teams) {
            if (team.id == id) {
                return team.name;
            }
        }
        return null;
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