import BaseStore from './BaseStore';
import BarrelTypeService from '../services/BarrelTypeService';

class BarrelTypeStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._types = [];

        this._handleBarrelTypeEvents = this._handleBarrelTypeEvents.bind(this);
        this._deleteBarrelType = this._deleteBarrelType.bind(this);
    }

    get types() {
        return this._types;
    }

    set types(v) {
        this._types = v;
        this.emitChange();
    }

    /**
     * Get the barrel type name by barrel type id
     * @param {string} typeId: the barrel type id
     * @returns {string|null}
     */
    getBarrelName(typeId) {
        for (let type of this._types) {
            if (type.id == typeId) {
                return type.name;
            }
        }
        return null;
    }

    /**
     * init the store : get the existing barrel types and
     * listen to webSocket events about BarrelType model
     */
    _init() {
        // fill the types attribute
        BarrelTypeService.getBarrelTypes(
            success => {
                this.types = success;
            },
            err => {
                console.log("get barrel types error : ", err);
            }
        );
        // listen model changes
        iosocket.on('barreltype', this._handleBarrelTypeEvents);
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
    _handleBarrelTypeEvents(e) {
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
            case "AUTH_JWT_SAVED":
                this._init();
                break;
            case "WEBSOCKET_DISCONNECTED":
                this._types = [];
                break;
        }
    }

}

export default new BarrelTypeStore();
