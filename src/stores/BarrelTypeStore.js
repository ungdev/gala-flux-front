import BaseStore from './BaseStore';
import BarrelTypeService from '../services/BarrelTypeService';

class BarrelTypeStore extends BaseStore {

    constructor() {
        super('barreltype', BarrelTypeService.getBarrelTypes);

        this.subscribe(() => this._handleActions.bind(this));

        this._handleModelEvents = this._handleModelEvents.bind(this);
    }

    get types() {
        return this.getUnIndexedData();
    }

    /**
     * Handle webSocket events about the BarrelType model
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._delete(e.id);
                break;
            case "created":
                this._set(e.id, e.data);
                break;
        }
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
