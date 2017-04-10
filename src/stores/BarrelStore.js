import BaseStore from './BaseStore';
import BarrelService from '../services/BarrelService';

class BarrelStore extends BaseStore {

    constructor() {
        super('barrel', BarrelService.getBarrels);

        this.subscribe(() => this._handleActions.bind(this));

        this._handleModelEvents = this._handleModelEvents.bind(this);
        this._deleteBarrel = this._deleteBarrel.bind(this);
        this._updateBarrel = this._updateBarrel.bind(this);
    }

    get barrels() {
        return this._modelData;
    }

    set barrels(v) {
        this._modelData = v;
        this.emitChange();
    }

    getTeamBarrels(team) {
        return this._modelData.filter(barrel => {
            return barrel.place == team
        });
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
     * Find the barrel in the array and update it
     *
     * @param {string} barrelId: the id of the barrel to update
     * @param {object} updatedBarrel: the new values of the barrel's attribute
     */
    _updateBarrel(barrelId, updatedBarrel) {
        for (let barrel of this._modelData) {
            if (barrel.id === barrelId) {
                barrel = updatedBarrel;
                break;
            }
        }
        this.emitChange();
    }

    /**
     * Handle webSocket events about the Barrel model
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        switch (e.verb) {
            case "destroyed":
                this._deleteBarrel(e.id);
                break;
            case "updated":
                this._updateBarrel(e.id, e.data);
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
            case "WEBSOCKET_DISCONNECTED":
                this._modelData = [];
                break;
        }
    }

}

export default new BarrelStore();
