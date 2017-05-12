import BaseStore from 'stores/BaseStore';
import BottleActionService from 'services/BottleActionService';
import NotificationActions from 'actions/NotificationActions';

class BottleActionStore extends BaseStore {

    constructor() {
        super('bottleaction', BottleActionService);

        this._count = {};

        this.subscribe(() => this._handleActions.bind(this));
    }

    get count() {
        return this._count;
    }

    /**
     * Overload fetchData to load or unload bottle count on filter update
     *
     * @param {number} [componentToken]: the new component
     * @return {Promise}
     */
    fetchData(componentToken) {
        return BottleActionService.getCount()
        .then((count) => {
            if(count) {
                this._count = count;
            }
            return super.fetchData(componentToken);
        });
    }


    /**
     * Overload _handleModelEvents to update bottle count
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        // init count object
        if(!this._count[e.data.team || null]) this._count[e.data.team || null] = {};
        if(!this._count[e.data.team || null][e.data.type]) this._count[e.data.team || null][e.data.type] = {empty: 0, new: 0};
        if(e.data.fromTeam) {
            if(!this._count[e.data.fromTeam || null]) this._count[e.data.fromTeam || null] = {};
            if(!this._count[e.data.fromTeam || null][e.data.type]) this._count[e.data.fromTeam || null][e.data.type] = {empty: 0, new: 0};
        }

        let old;
        switch (e.verb) {
            case "created":
                if(!this.findById(e.id)) {
                    // Update count
                    if(e.data.operation == 'purchased') {
                        this._count[e.data.team || null][e.data.type].new -= e.data.quantity;
                        this._count[e.data.team || null][e.data.type].empty += e.data.quantity;
                    }
                    else if(e.data.operation == 'moved') {
                        this._count[e.data.fromTeam || null][e.data.type].new -= e.data.quantity;
                        this._count[e.data.team || null][e.data.type].new += e.data.quantity;
                    }
                }
                break;
            case "updated":
                old = this.findById(e.id);
                if(old) {
                    // Update count
                    if(old.operation == 'purchased') {
                        // Delete old
                        this._count[old.team || null][old.type].new += old.quantity;
                        this._count[old.team || null][old.type].empty -= old.quantity;
                        // Add new
                        this._count[e.data.team || null][e.data.type].new -= e.data.quantity;
                        this._count[e.data.team || null][e.data.type].empty += e.data.quantity;
                    }
                    else if(e.data.operation == 'moved') {
                        // Delete old
                        this._count[old.fromTeam || null][old.type].new += old.quantity;
                        this._count[old.team || null][old.type].new -= old.quantity;
                        // add new
                        this._count[e.data.fromTeam || null][e.data.type].new -= e.data.quantity;
                        this._count[e.data.team || null][e.data.type].new += e.data.quantity;
                    }
                }
                break;
            case "destroyed":
                old = this.findById(e.id);
                if(old) {
                    // Update count
                    if(old.operation == 'purchased') {
                        this._count[old.team || null][old.type].new += old.quantity;
                        this._count[old.team || null][old.type].empty -= old.quantity;
                    }
                    else if(e.data.operation == 'moved') {
                        this._count[old.fromTeam || null][old.type].new += old.quantity;
                        this._count[old.team || null][old.type].new -= old.quantity;
                    }
                }
                break;
        }
        return super._handleModelEvents(e);
    }

    /**
     * Handle Actions from BottleAction
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

export default new BottleActionStore();
