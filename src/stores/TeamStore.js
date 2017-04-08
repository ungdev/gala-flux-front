import BaseStore from './BaseStore';
import TeamService from '../services/TeamService';

class TeamStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._teams = [];

        this._handleTeamEvents = this._handleTeamEvents.bind(this);
        this._deleteTeam = this._deleteTeam.bind(this);
    }

    get teams() {
        return this._teams;
    }

    set teams(v) {
        this._teams = v;
        this.emitChange();
    }


    /**
     * Find list of elements that match filters
     *
     * @param  {Object} filters Object of filters
     * @return {Array}         Array of elements
     */
    find(filters) {
        let out = [];
        for (let item of this._teams) {
            let add = true;
            for (let key in filters) {
                if(item[key] !== filters[key]) {
                    add = false;
                    break;
                }
            }
            if(add) {
                out.push(item);
            }
        }
        return out;
    }


    /**
     * Find one element that match filters
     *
     * @param  {Object} filters Object of filters
     * @return {Object}         Element
     */
    findOne(filters) {
        for (let item of this._teams) {
            let ok = true;
            for (let key in filters) {
                if(item[key] !== filters[key]) {
                    ok = false;
                    break;
                }
            }
            if(ok) {
                return item;
            }
        }
        return null;
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

    /**
     * init the store : get the existing teams and
     * listen to webSocket events about Team model
     */
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
        iosocket.on('team', this._handleTeamEvents);
    }

    /**
     * Remove a team by id in the store
     *
     * @param {String} teamId : the team to remove
     */
    _deleteTeam(teamId) {
        this.teams = this.teams.filter(team => team.id != teamId);
    }

    /**
     * Handle webSocket events about the Team model
     *
     * @param {object} e : the event
     */
    _handleTeamEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._deleteTeam(e.id);
                break;
            case "created":
                this.teams.push(e.data);
                break;
        }
    }

    /**
     * Handle Actions from TeamActions
     *
     * @param {object} action : the action
     */
    _handleActions(action) {
        switch(action.type) {
            case "AUTH_JWT_SAVED":
                this._init();
                break;
            case "WEBSOCKET_DISCONNECTED":
                this._teams = [];
                break;
        }
    }
}

export default new TeamStore();
