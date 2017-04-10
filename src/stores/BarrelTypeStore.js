import BaseStore from './BaseStore';
import BarrelTypeService from '../services/BarrelTypeService';

class BarrelTypeStore extends BaseStore {

    constructor() {
        super('barreltype', BarrelTypeService.getBarrelTypes);

        this.subscribe(() => this._handleActions.bind(this));

        this._handleModelEvents = this._handleModelEvents.bind(this);
        this._deleteBarrelType = this._deleteBarrelType.bind(this);
    }

    get types() {
        return this._modelData;
    }

    set types(v) {
        this._modelData = v;
        this.emitChange();
    }

    /**
     * Get the barrel type name by barrel type id
     * @param {string} typeId: the barrel type id
     * @returns {string|null}
     */
    getBarrelName(typeId) {
        for (let type of this._modelData) {
            if (type.id == typeId) {
                return type.name;
            }
        }
        return null;
    }

    /**
     * Remove a barrel type by id in the store
     *
     * @param {String} typeId : the type to remove
     */
    _deleteBarrelType(typeId) {
        this.types = this.types.filter(type => type.id != typeId);
    }

    /**
     * Handle webSocket events about the BarrelType model
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._deleteBarrelType(e.id);
                break;
            case "created":
                this.types.push(e.data);
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
