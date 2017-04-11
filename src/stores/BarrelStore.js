import BaseStore from './BaseStore';
import BarrelService from '../services/BarrelService';

class BarrelStore extends BaseStore {

    constructor() {
        super('barrel', BarrelService.getBarrels);

        this.subscribe(() => this._handleActions.bind(this));

        this._handleModelEvents = this._handleModelEvents.bind(this);
    }

    get barrels() {
        return this._modelData;
    }

    /**
     * Handle webSocket events about the Barrel model
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._delete(e.id);
                break;
            case "updated":
                this._set(e.id, e.data);
                break;
            case "created":
                this._set(e.id, e.data);
                break;
        }
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
