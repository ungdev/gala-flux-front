import BaseStore from 'stores/BaseStore';
import BottleTypeStore from 'stores/BottleTypeStore';
import BottleActionService from 'services/BottleActionService';
import NotificationActions from 'actions/NotificationActions';

class BottleActionStore extends BaseStore {

    constructor() {
        super('bottleAction', BottleActionService);

        // Contain live count of bottle per team
        this._count = {};

        // Reset count on bottleType store update
        BottleTypeStore.addChangeListener(() => this.resetCount());
    }

    /**
     * Get bottle count for each teams
     * You should use this function only if you've load both BottleAction and BottleType with no filter
     */
    get count() {
        return this._count;
    }


    _setModelData(data) {
        // Reset bottle count
        this.resetCount(data);

        // Transmit to basestore
        return super._setModelData(data);
    }

    /**
     * Reset count on values from this store and BottleTypeStore
     */
    resetCount(data) {
        this._count = {
            null: {},
        };
        if(!data) data = this._modelData.values();

        // Set original stock
        let types = BottleTypeStore.find();
        for (let type of types.values()) {
            this._count[null][type.id] = {new: type.originalStock, empty: 0};
        }

        // Update it with actions
        for (let action of data) {
            this._countAction(action);
        }
    }

    /**
     * Count a new action into the bottle count
     * @param {BottleAction} action
     */
    _countAction(action) {
        // Init for team
        if(!this._count[action.teamId || null]) this._count[action.teamId || null] = {};
        if(!this._count[action.teamId || null][action.typeId]) this._count[action.teamId || null][action.typeId] = {empty: 0, new: 0};

        // Init for fromteam
        if(!this._count[action.fromTeamId || null]) this._count[action.fromTeamId || null] = {};
        if(!this._count[action.fromTeamId || null][action.typeId]) this._count[action.fromTeamId || null][action.typeId] = {empty: 0, new: 0};

        if(action.operation == 'purchased') {
            this._count[action.teamId || null][action.typeId].new -= action.quantity;
            this._count[action.teamId || null][action.typeId].empty += action.quantity;
        }
        else if(action.operation == 'moved') {
            this._count[action.fromTeamId || null][action.typeId].new -= action.quantity;
            this._count[action.teamId || null][action.typeId].new += action.quantity;
        }
    }


    /**
     * Overload _handleModelEvents to update bottle count
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        if(e.verb === 'created' && !this._modelData.has(e.data.id)) {
            this._countAction(e.data);
        }
        return super._handleModelEvents(e);
    }

}

module.exports = new BottleActionStore();
export default module.exports;
