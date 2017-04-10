import BaseStore from './BaseStore';
import BarrelService from '../services/BarrelService';

class BarrelStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(() => this._handleActions.bind(this));

        this._filters = {
            length: 0
        };

        this._barrels = [];

        this._handleBarrelEvents = this._handleBarrelEvents.bind(this);
        this._deleteBarrel = this._deleteBarrel.bind(this);
        this._updateBarrel = this._updateBarrel.bind(this);
    }

    get barrels() {
        return this._barrels;
    }

    set barrels(v) {
        this._barrels = v;
        this.emitChange();
    }

    loadData(filters, callback) {
        const componentToken = this._filters.length;
        this._filters.length++;
        this._filters[componentToken] = filters;
        // refresh the store with the new filters
        return this.fetchData(callback, componentToken);
    }

    unloadData(token) {
        delete this._filters[token];
    }

    fetchData(callback, componentToken) {
        let filters = [];
        for (let filter in this._filters) {
            if (this._filters[filter] === null) {
                filters = null;
                break;
            }
            filters = [...new Set([...filters, ...this._filters[filter]])];
        }

        BarrelService.getBarrels(filters, (error, result) => {
            if (error) {
                return callback(error);
            }
            this.barrels = result;
            return callback(null, result, componentToken);
        });
        // listen model changes
        iosocket.on('barrel', this._handleBarrelEvents);
    }

    getTeamBarrels(team) {
        return this._barrels.filter(barrel => {
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
        for (let barrel of this._barrels) {
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
    _handleBarrelEvents(e) {
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
                this._barrels = [];
                break;
        }
    }

}

export default new BarrelStore();
