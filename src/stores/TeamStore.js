import BaseStore from './BaseStore';
import TeamService from '../services/TeamService';

class TeamStore extends BaseStore {

    constructor() {
        super('team', TeamService.getTeams);

        this.subscribe(() => this._handleActions.bind(this));

        this._handleModelEvents = this._handleModelEvents.bind(this);
        this._deleteTeam = this._deleteTeam.bind(this);
    }

    get teams() {
        return this._modelData;
    }

    set teams(v) {
        this._modelData = v;
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
        for (let item of this._modelData) {
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
        for (let item of this._modelData) {
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
        for (let team of this._modelData) {
            if (team.id == id) {
                return team.name;
            }
        }
        return null;
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
    _handleModelEvents(e) {
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
            case "WEBSOCKET_DISCONNECTED":
                this._modelData = [];
                break;
        }
    }
}

export default new TeamStore();
