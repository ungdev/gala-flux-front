import BaseStore from './BaseStore';
import BarrelTypeService from '../services/BarrelTypeService';

class BarrelTypeStore extends BaseStore {

    constructor() {
        super('barreltype', BarrelTypeService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get types() {
        return this.getUnIndexedData();
    }

    /**
     * Handle Actions from BarrelTypeActions
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

export default new BarrelTypeStore();
