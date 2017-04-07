import BaseStore from './BaseStore';
import BarrelService from '../services/BarrelService';

class BarrelStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._barrels = [];

        this._handleBarrelEvents = this._handleBarrelEvents.bind(this);
        this._deleteBarrel = this._deleteBarrel.bind(this);
    }

    get barrels() {
        return this._barrels;
    }

    set barrels(v) {
        this._barrels = v;
        this.emitChange();
    }

    /**
     * init the store : get the existing barrel and
     * listen to webSocket events about Barrel model
     */
    _init() {
        // fill the types attribute
        BarrelService.getBarrels(
            success => {
                this.barrels = success;
            },
            err => {
                console.log("get barrels error : ", err);
            }
        );
        // listen model changes
        iosocket.on('barrel', this._handleBarrelEvents);
    }

    /**
     * Remove a barrel by id in the store
     *
     * @param {String} barrelId : the barrel to remove
     */
    _deleteBarrel(barrelId) {
        this.barrels = this.barrels.filter(barrel => barrel.id != barrelId);
    }

    /**
     * Handle webSocket events about the Barrel model
     *
     * @param {object} e : the event
     */
    _handleBarrelEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._deleteBarrel(e.id);
                break;
            case "created":
                this.barrels.push(e.data);
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
            case "SAVE_JWT":
                this._init();
                break;
            case "WEBSOCKET_DISCONNECTED":
                this._barrels = [];
                break;
        }
    }

}

export default new BarrelStore();
