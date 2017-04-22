import BaseStore from './BaseStore';
import BottleService from '../services/BottleService';

class BottleStore extends BaseStore {

    constructor() {
        super('bottle', BottleService);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get bottles() {
        return this.getUnIndexedData();
    }

    /**
     * Handle Actions from BottleActions
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

export default new BottleStore();
