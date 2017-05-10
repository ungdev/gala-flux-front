import BaseStore from 'stores/BaseStore';
import BarrelService from 'services/BarrelService';

class BarrelStore extends BaseStore {

    constructor() {
        super('barrel', BarrelService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get barrels() {
        return this.getUnIndexedData();
    }

    /**
     * Handle Actions from BarrelActions
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

export default new BarrelStore();
