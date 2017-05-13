import BaseStore from 'stores/BaseStore';
import BottleActionService from 'services/BottleActionService';
import NotificationActions from 'actions/NotificationActions';

class BottleActionStore extends BaseStore {

    constructor() {
        super('bottleaction', BottleActionService);

        this._count = {};
        this._countRequest = 0;

        this.subscribe(() => this._handleActions.bind(this));
    }

    get count() {
        return this._count;
    }


    /**
     * Same as loadDAta bur for requesting count
     */
    loadCount() {
        this._countRequest++;
        // Use a fake filter to load 0 entry but subscribe
        return new Promise((resolve, reject) => {
            BottleActionService.getCount()
            .then((count) => {
                this._count = count;
                return resolve();
            })
            .catch((error) => {
                return reject(error);
            });
        })
        .then(() => this.loadData({id: '0'}));
    }


    /**
     * Same as unloadData but for unrequesting count
     *
     * @param {number|null} token: the component's token
     */
    unloadCount(token) {
        if(this._filters[token] !== undefined) {
            this._countRequest--;
            if(this._countRequest === 0) {
                this._count = {};
            }
        }
        return this.unloadData(token);
    }


    /**
     * Overload _handleModelEvents to update bottle count
     *
     * @param {object} e : the event
     */
    _handleModelEvents(e) {
        if(this._countRequest) {
            // init count object
            if(!this._count[e.data.team || null]) this._count[e.data.team || null] = {};
            if(!this._count[e.data.team || null][e.data.type]) this._count[e.data.team || null][e.data.type] = {empty: 0, new: 0};
            if(e.data.fromTeam) {
                if(!this._count[e.data.fromTeam || null]) this._count[e.data.fromTeam || null] = {};
                if(!this._count[e.data.fromTeam || null][e.data.type]) this._count[e.data.fromTeam || null][e.data.type] = {empty: 0, new: 0};
            }

            switch (e.verb) {
                case "created":
                    // Update count
                    if(e.data.operation == 'purchased') {
                        this._count[e.data.team || null][e.data.type].new -= e.data.quantity;
                        this._count[e.data.team || null][e.data.type].empty += e.data.quantity;
                    }
                    else if(e.data.operation == 'moved') {
                        this._count[e.data.fromTeam || null][e.data.type].new -= e.data.quantity;
                        this._count[e.data.team || null][e.data.type].new += e.data.quantity;
                    }
                    this.emitChange();
                    break;
            }
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
