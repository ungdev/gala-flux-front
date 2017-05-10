import BaseStore from 'stores/BaseStore';
import BottleTypeService from 'services/BottleTypeService';

class BottleTypeStore extends BaseStore {

    constructor() {
        super('bottletype', BottleTypeService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get types() {
        return this.getUnIndexedData();
    }

    /**
     * Handle Actions from BottleTypeActions
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

export default new BottleTypeStore();
