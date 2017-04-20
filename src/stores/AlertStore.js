import BaseStore from './BaseStore';
import AlertService from '../services/AlertService';

class AlertStore extends BaseStore {

    constructor() {
        super('alert', AlertService.getAlerts);

        this.subscribe(() => this._handleActions.bind(this));
    }

    get alerts() {
        return this.getUnIndexedData();
    }

    _handleActions(action) {
        switch(action.type) {
            case "NEW_ALERT":
                this._newAlert(action.alert);
                break;
        }
    }
}

export default new AlertStore();
