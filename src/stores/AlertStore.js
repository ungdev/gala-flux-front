import BaseStore from './BaseStore';
import AlertService from '../services/AlertService';

class AlertStore extends BaseStore {

    constructor() {
        super('alert', AlertService);
        this.subscribe(() => this._handleActions.bind(this));
    }

    get alerts() {
        return this.getUnIndexedData();
    }

    /**
     * Handle Actions from BarrelActions
     *
     * @param {object} action : the action
     */
    _handleActions(action) {
        switch(action.type) {
            case "ALERT_CLOSED":
                this._delete(action.id);
                break;
            case "WEBSOCKET_DISCONNECTED":
                this._modelData = [];
                break;
        }
    }
}

export default new AlertStore();
