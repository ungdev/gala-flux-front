import BaseStore from './BaseStore';
import TeamService from '../services/TeamService';

class TeamStore extends BaseStore {

    constructor() {
        super('team', TeamService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get teams() {
        return this.getUnIndexedData();
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
