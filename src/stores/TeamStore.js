import BaseStore from './BaseStore';
import TeamService from '../services/TeamService';

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

    _init() {
        // fill the teams attribute
        TeamService.getTeams(
            success => {
                this.teams = success;
                console.log("success : ", success);
            },
            err => {
                console.log("get teams error : ", err);
            }
        );
        // listen model changes
        io.socket.on('team', this._handleTeam);
    }

    _handleTeam(e) {
        console.log(e);
    }

    _handleActions(action) {
        switch(action.type) {
            case "SAVE_JWT":
                this._init();
                break;
        }
    }

}

export default new TeamStore();