import BaseStore from 'stores/BaseStore';
import AuthStore from 'stores/AuthStore';
import TeamService from 'services/TeamService';

class TeamStore extends BaseStore {

    constructor() {
        super('team', TeamService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get teams() {
        return this.getUnIndexedData();
    }


    /**
     * Find a list of team which have the given permission
     * @param {string} permission
     * @return {array} List of teams
     */
    findByPermission(permission) {
        let out = [];
        for (let i in this._modelData) {
            if(AuthStore.can(permission, this._modelData[i])) {
                out.push(Object.assign({}, this._modelData[i]));
            }
        }
        return out;
    }


    /**
     * Get available groups from team list
     * @param {array} teams team list
     * @return {array} role list
     */
    get groups() {
        let groups = new Set();
        for (let i in this._modelData) {
            groups.add(this._modelData[i].group);
        }
        groups = [...groups];
        groups.sort((a,b) =>  a.localeCompare(b));
        return groups;
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
